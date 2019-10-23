// import { Utils } from './../utils/utils';
import { FirebaseApp } from '@angular/fire';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Audioguide, POI } from './models';
import { FilesServiceProvider } from './files-service';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class SqliteServiceProvider implements OnInit {
    fileUrl: string;
    loading: any;
    idAuthor: string;

    private database: SQLiteObject;
    private dbReady: BehaviorSubject<boolean>;
    storageImageRef: any;
    storageAudioRef: any;

    location$ = new Subject<string>();

    constructor(private platform: Platform,
        private sqlite: SQLite,
        private fileService: FilesServiceProvider,
        private firebaseStorage: FirebaseApp,
        private loadingCtrl: LoadingController) {

    }

    ngOnInit() {
        this.dbReady = new BehaviorSubject(false);
        this.platform.ready().then(() => {
            this.sqlite.create({
                name: 'discovery.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    this.database = db;
                    this.createAudioguidesTable();
                    this.createPoisTable();
                    this.dbReady.next(true);
                })
                .catch(error => console.log(`creating database ` + JSON.stringify(error)));

        });
    }

    async presentLoadingWithOptions(message) {
        const loading = await this.loadingCtrl.create({
            spinner: 'bubbles',
            duration: 500,
            message: message,
            translucent: true,
            //   cssClass: 'custom-class custom-loading'
        });
        return await loading.present();
    }

    createAudioguidesTable() {
        this.database.executeSql(`create table if not exists audioguides(
        id integer primary key autoincrement, idFirebase CHAR(20), idAuthor CHAR(20), idLocation CHAR(20), location CHAR(255),
         title CHAR(255), description CHAR(255), duration INTEGER, pois INTEGER, lang CHAR(20), price FLOAT, image CHAR(255),
         imageUrl CHAR(255), purchased INTEGER)`, []).then(
            () => this.dbReady.next(true)
            ).catch(error => console.log(`creating table ` + error.message.toString()));
    }

    createPoisTable() {
        this.database.executeSql(`create table if not exists pois(id integer primary key autoincrement, idFirebase CHAR(20),
        idAudioguide INTEGER, idLocation char(20), title CHAR(20), lat FLOAT, lon FLOAT, image CHAR(250), imageUrl CHAR(250),
        file CHAR(250), duration INTEGER, isPreview INTEGER, size INTEGER)`, []).then(
            () => this.dbReady.next(true)
            ).catch(error => console.log(`creating table ` + error.message.toString()));
    }

    addAudioguide(audioguide) {
        console.log(audioguide)
        return this.database.executeSql(`INSERT INTO audioguides (idFirebase, idAuthor, idLocation, location, title, description,
            duration, pois, lang, price, image, imageUrl, purchased) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [audioguide.key,
            audioguide.idAuthor, audioguide.idLocation, audioguide.location, audioguide.title, audioguide.description, audioguide.duration,
            audioguide.audioguidePois.length, audioguide.lang, audioguide.price, audioguide.image, audioguide.imageUrl,
            audioguide.purchased]).then(result => {
                if (result.insertId) {
                    this.presentLoadingWithOptions('Downloading files from the server...');
                    return this.getAudioguideFiles(audioguide).then(() => {
                        console.log(`audioguide.id ` + result.insertId);
                        return this.addPois(result.insertId, audioguide.audioguidePois);
                    }).catch(error => {
                        console.log(error);
                        // this.utils.handlerError(error);
                        // this.loading.dismiss();
                        return [];
                    });
                }
            })
            .catch(error => {
                // this.loading.dismiss();
                // this.utils.handlerError(error);
                console.log('Error addAudioguide:' + error.message.toString());
                return [];
            });
    }

    addPois(idAudioguide, pois) {
        console.log(pois)
        pois.forEach(element => {
            return this.database.executeSql(`INSERT INTO pois (idFirebase, idAudioguide, idLocation, title, lat,
                lon, image, imageUrl, file, duration, isPreview, size) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [element.idFirebase, idAudioguide, element.idLocation, element.title, element.lat, element.lon, 
                element.image, element.imageUrl, element.file, element.duration, element.isPreview, element.size])
                .then(resultPois => {
                    return this.getPoiFiles(element).then(() => {
                        console.log('pois id' + resultPois.insertId)
                        this.loading.dismiss();
                    });
                }).catch((error) => {
                    // this.utils.handlerError(error)
                    console.log('Error addingPois ' + error.message.toString());
                    this.loading.dismiss();
                });

        });
    }

    getAudioguideFiles(audioguide) {
        this.storageImageRef = this.firebaseStorage.storage().ref().child(audioguide.image);
        return this.storageImageRef.getDownloadURL().then(url => {
            console.log(url)
            this.fileUrl = url;
            return this.fileService.downloadFile(this.fileUrl, audioguide.image).then(() => {
                console.log('image downloaded');
            });
        });
    }

    getPoiFiles(poi) {
        let audioUrl = '';
        let imageUrl = '';

        this.storageImageRef = this.firebaseStorage.storage().ref().child(poi.image);
        this.storageAudioRef = this.firebaseStorage.storage().ref().child(poi.file);

        return this.storageAudioRef.getDownloadURL().then(url => {
            console.log(`audio ` + url)
            audioUrl = url;
            return this.fileService.downloadFile(audioUrl, poi.file).then(() => {
                console.log('audio downloaded')
                return this.storageImageRef.getDownloadURL().then(url => {
                    console.log(`image poi ` + url)
                    imageUrl = url;
                    return this.fileService.downloadFile(imageUrl, poi.image).then(() => {
                        console.log('image poi downloaded')
                    });
                });
            });
        });
    }

    getAudioguide(idGuide: string) {
        return this.database.executeSql(`SELECT * FROM audioguides WHERE idFirebase = '${idGuide}'`, [])
            .then((data) => {
                if (data.rows.length === 1) {
                    return true;
                }
                return null;
            }).catch(error => console.log('getAudioguide ' + error.message.toString()))
    }

    findAudioguides() {
        return this.database.executeSql(`SELECT * FROM audioguides`, []).then(
            (data) => {
                const audioguidesList = Array<Audioguide>();
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        audioguidesList.push(data.rows.item(i));
                    }
                    console.log(`this.audioguidesList.length ` + audioguidesList.length)
                    return audioguidesList;
                }
            }, (error) => {
                console.log('Error findAll: ' + error.message.toString());
                return [];
            });
    }

    findMyAudioguides(idAuthor: string) {
        console.log('idAuthor findMyAudioguides ' + idAuthor)
        return this.database.executeSql(`SELECT * FROM audioguides WHERE idAuthor = '${idAuthor}'`, []).then(
            (data) => {
                console.log(data)
                const audioguidesList: Audioguide[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        audioguidesList.push(data.rows.item(i));
                    }
                    console.log(`this.audioguidesList.length ` + audioguidesList.length)
                    return audioguidesList;
                }
            }, (error) => {
                console.log('Error findMyAudioguides: ' + error.message.toString());
                return [];
            });
    }

    // findAllPois() {
    //   return this.database.executeSql(`SELECT * FROM pois`, []).then(
    //     (data) => {
    //       let poisList = Array<POI>();
    //         console.log(data.rows.length)       
    //       if(data.rows.length > 0) {            
    //         for(var i = 0; i < data.rows.length; i++) {
    //           console.log(data.rows.item(i))
    //           poisList.push(data.rows.item(i))  
    //         }
    //         return poisList;
    //       }
    //   }, (error) => {
    //       console.log("Error findPois: " + error.message.toString());
    //   });
    // }

    findPois() {
        return this.database.executeSql(`SELECT * FROM pois`, []).then(
            (data) => {
                console.log('data.rows.length ' + data.rows.length)
                const poisList: POI[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        poisList.push(data.rows.item(i));
                    }
                    console.log(`this.poisList.length ` + poisList.length)
                    return poisList;
                }
            });
    }
    findPoisByAudioguide(idAudioguide: number) {
        console.log('findPois ' + idAudioguide)
        return this.database.executeSql(`SELECT * FROM pois WHERE idAudioguide = ${idAudioguide}`, []).then(
            (data) => {
                console.log('data.rows.length ' + data.rows.length)
                const poisList: POI[] = [];
                if (data.rows.length > 0) {
                    for (let i = 0; i < data.rows.length; i++) {
                        poisList.push(data.rows.item(i));
                    }
                    console.log(`this.poisList.length ` + poisList.length)
                    return poisList;
                } else {
                    return [];
                }
            }, (error) => {
                console.log('Error findPoisByAudioguide: ' + error.message.toString());
                return [];
            });
    }

    deleteAudioguide(idAudioguide: number) {
        this.findPoisByAudioguide(idAudioguide).then(poiList => {
            if (poiList) {
                let poisList: POI[] = [];
                poisList = poiList;
                poisList.forEach(element => {
                    this.fileService.deleteFile(element.file);
                    this.fileService.deleteFile(element.image);
                });
                this.database.executeSql(`DELETE FROM pois WHERE idAudioguide = ${idAudioguide}`, []).then(() => {
                    console.log('pois deleted successfully');
                }).catch(error => console.log('Error deletePois: ' + error.message.toString()));
            }

        });
        return this.database.executeSql(`DELETE FROM audioguides WHERE id = ${idAudioguide}`, []).then(() => {
            console.log('audioguide deleted successfully');
        }).catch(error => console.log('Error deleteAudioguides: ' + error.message.toString()));
    }

    createAudioguide(audioguide: Audioguide) {
        return this.database.executeSql(`INSERT INTO audioguides (idFirebase, idAuthor, idLocation, title, description,
            duration, pois, lang, price, image) VALUES (?,?,?,?,?,?,?,?,?,?)`, ['', audioguide.idAuthor, audioguide.idLocation,
            audioguide.title, audioguide.description, 0, 0, audioguide.lang, audioguide.price, audioguide.image])
            .then(result => {
                console.log(result)
                if (result.insertId) {
                    console.log(`audioguide.id ` + result.insertId);
                }
            }).catch(error => console.log('Error addAudioguide:  ' + error.message.toString()));
    }

    createPoi(poi: POI) {
        return this.database.executeSql(`INSERT INTO pois (idFirebase, idAudioguide, title, lat, lon, image, file, duration)
        VALUES (?,?,?,?,?,?,?,?)`, [poi.idFirebase, poi.idAudioguide, poi.title, poi.lat, poi.lon, poi.image, poi.file, 0])
            .then(result => {
                console.log(result)
                if (result.insertId) {
                    return this.fileService.downloadFile(poi.imageUrl, poi.image).then(() => {
                        console.log(`poi.id ` + result.insertId);
                    });
                }
            }).catch(error => console.log('Error createPoi:  ' + error.message.toString()));
    }

    getDatabaseState() {
        return this.dbReady.asObservable();
    }
}

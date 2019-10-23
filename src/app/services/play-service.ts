import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { FirebaseApp } from '@angular/fire';
import { File } from '@ionic-native/file/ngx';
import { LoadingController, Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class PlayGuideProvider implements OnInit {
    mediaFile: MediaObject;
    storageRef: any;
    fileUrl: string;
    public isPlaying = new Subject();
    position = 0;
    storageDirectory: any;

    constructor(private media: Media,
        private firebaseStorage: FirebaseApp,
        private loadingCtrl: LoadingController,
        private file: File,
        private platform: Platform) {}

    ngOnInit(): void {
        // assign storage directory
        this.platform.ready().then(() => {
            if (this.platform.is('ios')) {
                this.storageDirectory = this.file.dataDirectory;
            } else if (this.platform.is('android')) {
                this.storageDirectory = this.file.dataDirectory;
            } else {
                // exit otherwise, but you could add further types here e.g. Windows
                return false;
            }
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

    listenStreaming(fileName) {
        this.presentLoadingWithOptions('Loading the audioguide...');

        this.storageRef = this.firebaseStorage.storage().ref().child(fileName);
        this.storageRef.getDownloadURL().then(url => {
            this.fileUrl = url;
            this.mediaFile = this.media.create(this.fileUrl);

            this.mediaFile.onStatusUpdate.subscribe(status => {
                console.log(status)

                if (this.media.MEDIA_RUNNING === status) {
                    console.log(`MEDIA_RUNNING status ` + status)
                    this.mediaFile.seekTo(this.position * 1000);
                }

                if (this.media.MEDIA_STARTING === status) {
                    console.log(`MEDIA_STARTING status ` + status)
                }

                if (this.media.MEDIA_ERR_DECODE === status) {
                    console.log(`MEDIA_ERR_DECODE status ` + status)
                    this.isPlaying.next(false);
                }

                if (this.media.MEDIA_STOPPED === status) {
                    this.isPlaying.next(false);
                }
            }); // fires when file status changes

            this.mediaFile.onSuccess.subscribe(() => {
                console.log('Action is successful')
            });

            this.mediaFile.onError.subscribe(error => console.log('Error!', error.toString()));
            this.mediaFile.play();
            this.isPlaying.next(true);
        }).catch(error => {
            // this.utils.handlerError(err);
            console.log(error.message.toString())
        });
    }

    listen(fileName) {
        this.presentLoadingWithOptions('Loading the audioguide...');

        this.mediaFile = this.media.create(this.storageDirectory + fileName);
        this.mediaFile.onStatusUpdate.subscribe(status => {
            console.log(status)
            if (this.media.MEDIA_RUNNING === status) {
                console.log(`MEDIA_RUNNING ` + status)
                this.isPlaying.next(true);
                this.mediaFile.seekTo(this.position * 1000);
            }

            if (this.media.MEDIA_STARTING === status) {
                this.isPlaying.next(true);
                console.log(`MEDIA_STARTING status ` + status)
            }

            if (this.media.MEDIA_ERR_DECODE === status) {
                console.log(`MEDIA_ERR_DECODE status ` + status)
                this.isPlaying.next(false);
            }

            if (this.media.MEDIA_STOPPED === status) {
                this.isPlaying.next(false);
            }
        }); // fires when file status changes

        this.mediaFile.onSuccess.subscribe(() => {
            console.log('Action is successful')
        });

        this.mediaFile.onError.subscribe(error => console.log('Error!', error.toString()));
        this.mediaFile.play();
        this.isPlaying.next(true);
    }

    pause() {
        this.mediaFile.pause();
        this.mediaFile.getCurrentPosition().then(position => this.position = position)
        this.isPlaying.next(false);
    }

    stop() {
        this.mediaFile.stop();
        this.mediaFile.release();
        this.position = 0;
        this.isPlaying.next(false);
    }

    startRecord(poiName: string) {
        this.file.createFile(this.storageDirectory, poiName, true).then(() => {
            if (this.platform.is('ios')) {  //ios
                this.mediaFile = this.media.create(this.storageDirectory.replace(/^file:\/\//, '') + poiName);
            } else {  // android
                this.mediaFile = this.media.create(this.storageDirectory + poiName);
            }
            this.mediaFile.startRecord();
        });
    }

    stopRecord() {
        this.mediaFile.stopRecord();
    }

}

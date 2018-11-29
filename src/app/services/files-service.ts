import { Platform, AlertController } from '@ionic/angular';
import { Injectable, OnInit } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Upload } from './models';
import * as firebase from 'firebase';

@Injectable()
export class FilesServiceProvider implements OnInit {

    storageDirectory: any;

    constructor(private platform: Platform,
        private file: File,
        private transfer: FileTransfer,
        private alertCtrl: AlertController) {}

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

    downloadFile(url, filename) {
        console.log(url, filename)
        return this.file.resolveDirectoryUrl(this.storageDirectory)
            .then((resolvedDirectory) => {
                console.log("resolved  directory: " + resolvedDirectory.nativeURL);

                return this.file.checkFile(resolvedDirectory.nativeURL, filename)
                    .then((data) => {
                        console.log('File already exist ' + data)
                        return null;
                    })
                    .catch(err => {
                        console.log("Error occurred while checking local files:");
                        console.log(err);
                        if (err.code === 1) {
                            const fileTransfer: FileTransferObject = this.transfer.create();
                            console.log('url ' + url + ' this.storageDirectory ' + this.storageDirectory + filename)
                            return fileTransfer.download(url, this.storageDirectory + filename)
                                .then(entry => {
                                    console.log('download complete ' + entry.toURL());
                                    return entry;
                                })
                                .catch(err_2 => {
                                    console.log('Download error!');
                                    console.log(err_2);
                                });
                        }
                    });
            });
    }

    uploadFile(folder: string, upload: Upload) {
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${folder}/${upload.file}`).put(upload.file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // upload in progress
                upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
            },
            (error) => {
                // upload failed
                console.log(error)
            },
            () => {
                // upload success
                upload.imageUrl = uploadTask.snapshot.downloadURL;
                // upload.image = upload.file
            }
        );
        return uploadTask.then(() => {
            return upload.imageUrl;
        });
    }

    deleteFile(fileName) {
        this.file.removeFile(this.storageDirectory, fileName)
            .then(() => console.log(`File ` + fileName + ` deleted`))
            .catch(err => {
                console.log('Error occurred while deleting local files: ');
                console.log(err);
            });
    }
}

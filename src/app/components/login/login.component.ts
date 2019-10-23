import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, NavController } from '@ionic/angular';
import { SqliteServiceProvider } from '../../services/sqlite-service';
import { UserService } from '../../services/user.service';
import { User, Audioguide } from '../../services/models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    user: User = new User();
    audioguide: Audioguide;
    isLoggedin: boolean;
    isAuthor: boolean;

    constructor(public formBuilder: FormBuilder,
        public fireAuth: AngularFireAuth,
        private loadingCtrl: LoadingController,
        private storage: Storage,
        public navCtrl: NavController,
        private route: ActivatedRoute,
        private sqliteService: SqliteServiceProvider,
        private userService: UserService) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
            password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
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

    doLogin() {

        this.presentLoadingWithOptions('Logging in your account...');

        this.fireAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(
            (data) => {
                console.log(data)
                this.storage.set('isLoggedin', true);
                this.isLoggedin = true;

                this.userService.getUsers(this.loginForm.value.email).subscribe(user => {
                    console.log(user)
                    this.user = user[0];
                    this.isAuthor = this.user.isAuthor;
                    this.storage.set('isAuthor', this.user.isAuthor);
                    if (this.user.isAuthor) {
                        console.log(this.user.key)
                        this.storage.set('idAuthor', this.user.key);
                    }
                });
                console.log(this.route.snapshot.data.audioguide);
                if (this.route.snapshot.data.audioguide !== null) {
                    this.audioguide = this.route.snapshot.data.audioguide;
                    this.buyAudioguide();
                }

                this.navCtrl.navigateForward('/GuidesPage');
            }
        ).catch(
            (error) => {
                this.storage.set('isLoggedin', false);
                // this.utils.handlerError(error);
                console.log(error);
            }
        );
    }

    buyAudioguide() {
        // TODO sistema de compra
        this.sqliteService.getDatabaseState().subscribe(ready => {
            if (ready) {
                this.sqliteService.addAudioguide(this.audioguide).catch(error => {
                    // this.utils.handlerError(error)
                });
            }
        });
    }
}

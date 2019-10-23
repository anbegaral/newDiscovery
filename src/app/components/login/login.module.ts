import { LoginComponent } from './login.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
    { path: '', component: LoginComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes)
    ],
    declarations: [LoginComponent],
    exports: [RouterModule]
})
export class LoginComponentModule {}

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule
  ],
  exports: [],
  declarations: [LoginComponent, SignupComponent],
  providers: []
})
export class AuthModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { ReproductorComponent } from "../../components/reproductor/reproductor.component";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [WelcomeComponent,ReproductorComponent],
  imports: [
    CommonModule,
    WelcomeRoutingModule,
    SweetAlert2Module.forRoot()
  ]
})
export class WelcomeModule { }

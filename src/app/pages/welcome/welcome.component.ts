import { Component, OnInit,Inject,ViewChild,ElementRef} from '@angular/core';
import Swal from'sweetalert2';



import { DOCUMENT } from '@angular/common';@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  flower:boolean = false;
  content:boolean = true;
  animateFather:string ='';
  animateChild:string ='img-fluid animate__animated animate__bounceInDown';
  animation:any = sessionStorage.getItem('animation');



  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
      if (this.animation == null) {//
          this.flower = true;
          this.animationStart();
      }
  }

  animationStart =() =>{
    setTimeout(() => {
      this.animateChild ='mg-fluid animate__animated animate__rotateOut';
      this.animateFather = 'animate__animated animate__fadeOut';
      setTimeout(() => { 
        sessionStorage.setItem('animation', 'true');  
        this.flower = false;
        this.content = false;           
      }, 1000);     
    }, 10000);
  }
}

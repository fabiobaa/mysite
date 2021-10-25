import { Component,Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'resume';


  constructor(private titleService: Title) { }

  ngOnInit(): void {      
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log('Esto es un dispositivo móvil');
   }else{
    console.log('Esto es un dispositivo PC');
   }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.className = 'dark';
      
    }else{
      document.documentElement.className = 'light';
    }
      
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);    
  }

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MusicService } from 'src/app/services/music/music.service';
import { Song } from 'src/app/models/song/song';
import { Howl, Howler } from 'howler';
import { AppComponent } from 'src/app/app.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import FastAverageColor from 'fast-average-color';
// import { useMediaMeta } from 'use-media-session';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.scss'],
})
export class ReproductorComponent implements OnInit {
  apiEndpoint: string = environment.APIEndpoint;
  sound: any;
  index: number = 0;
  intervalo: any = 0;
  reproductor: boolean = false;
  intialPlay:boolean = false;
  mostrarPlay: boolean = true;
  fac = new FastAverageColor();
  root = document.documentElement;
  propertiesSong = {
    duration: '',
    remainingTime: '0:00',
    elapsedTime: '0:00',
    image: './assets/images/startPlayer.png',
    percentagPassed: 0,
    description: '',
    valueVolume: JSON.parse(localStorage.getItem('valueVolume') || '1.0')
  };


  songs: Song[] = [];
  constructor(
    private musicService: MusicService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.getAllSongs();   
    Howler.volume(this.propertiesSong.valueVolume);
   
    
   //@ts-ignore
    navigator.mediaSession.setActionHandler('play', async()=>{    
     this.play();     
    });
    //@ts-ignore
    navigator.mediaSession.setActionHandler('pause', async()=> {     
       this.pause();
  });
  
  }


  getAllSongs = () => {
    this.musicService.getAllSongs().subscribe(
      (resp) => {
        this.songs = resp;
      },
      (error: any) => {
        debugger;
      }
    );
  };

  play = () => {
      if (this.reproductor == false) {

        this.intialPlay = true;
        let song:any = "";
        song = this.songs[this.index];
        this.propertiesSong.image = song.Image;
    
        this.fac.getColorAsync(song.Image).then((color) => {
            if (color.isDark) {                 
              document.documentElement.style.setProperty('--text-color-reproductor',"#FFFFFF");
            }
            if (color.isLight) {         
              document.documentElement.style.setProperty('--text-color-reproductor',"#000000");
            }
            document.documentElement.style.setProperty('--progress-background-color',"#FFFFFF");
            document.documentElement.style.setProperty('--background-reproductor',color.hex);
          })
          .catch((e) => {
            console.log(e);
          });
    
        this.propertiesSong.description = song.Name + ' - ' + song.Author;
        this.appComponent.setTitle(this.propertiesSong.description);
    
      
        if ("mediaSession" in navigator) {
          // @ts-ignore
          navigator.mediaSession.metadata = new MediaMetadata({
            title:  song.Name,
            artist:  song.Author,
            artwork: [ 
              { src: song.Artwork[0].Src,   sizes: song.Artwork[0].Size,   type: song.Artwork[0].Type },    
              { src: song.Artwork[1].Src,   sizes: song.Artwork[1].Size,   type: song.Artwork[1].Type },
              { src: song.Artwork[2].Src,   sizes: song.Artwork[2].Size,   type: song.Artwork[2].Type },      
            ],        
          });
        }
  

        this.sound = new Howl({
          src: [song.Audio],
          html5: true,
          onplay: () => {
            this.mostrarPlay = false;
            this.reproductor = true;
            if (this.sound.playing() == false) {
              this.sound.play();
            }
            this.intervalo = setInterval(() => {
              //nos da la información del tiempo que lleva la reproducción de la canción
              let seek: any = this.sound.seek() || 0;
              //trasnformamos el tiempo transcurrido
              this.propertiesSong.elapsedTime = this.formatTime(Math.round(seek));
              //calculamos el tiempo restante
              this.propertiesSong.remainingTime =
                '-' +
                this.formatTime(
                  Math.round(this.sound.duration()) - Math.round(seek)
                );
              this.propertiesSong.percentagPassed =
                (this.sound.seek() / this.sound.duration()) * 100;
            }, 200);
          },
          onload: () => {
            if (this.reproductor == false) {
              this.propertiesSong.duration = this.formatTime(
                Math.round(this.sound.duration())
              );
              this.propertiesSong.remainingTime = this.formatTime(Math.floor(0));
              this.propertiesSong.elapsedTime = this.formatTime(Math.floor(0));
            }
          },
          onend: () => {
            //tiempo restante
            this.propertiesSong.remainingTime =
              '-' + this.formatTime(Math.floor(0));
            //tiempo transcurrido
            this.propertiesSong.elapsedTime = this.formatTime(Math.floor(0));
            clearInterval(this.intervalo);
            //  this.reproductor=false;
            if (this.index === this.songs.length - 1) {
              this.index = 0;
              this.play();
            } else {
              this.skip('next');
            }
          },
          onpause: () => {
            this.sound.pause();
            clearInterval(this.intervalo);
          },
  
          onseek: () => {
            let seek: any = this.sound.seek() || 0;
            console.log(seek);
          },
        });
        this.sound.play();
      } else {
        this.mostrarPlay = false;
        if (this.sound.playing() == false) {
          this.sound.play();
        }
      }
  };



  skip = (direction: string) => {
    if (this.reproductor) {
      if (direction === 'prev') {
        if (this.index == 0) {
          this.index = this.songs.length - 1;
        } else {
          this.index -= 1;
        }
      } else {
        this.index += 1;
        if (this.index >= this.songs.length) {
          this.index = 0;
        }
      }
      
      this.mostrarPlay = true;
      this.sound.stop();
      clearInterval(this.intervalo);
      this.reproductor = false;
      this.play();
    }
  };

  formatTime = (seconds: any) => {
    let minutos = Math.floor(seconds / 60) || 0;
    let segundos = seconds - minutos * 60 || 0;
    return minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
  };

  pause = () => {
    this.mostrarPlay = true; 
    this.sound.pause(this.index);  
  };

  volume = (range: any) => {
    this.propertiesSong.valueVolume = range;   
    localStorage.setItem('valueVolume', String(range));  
    Howler.volume(this.propertiesSong.valueVolume);
  };

  showModalVolume() {
    Swal.fire({
      width: 50,
      showConfirmButton: false,
      input: 'range',
      inputAttributes: { min: '0.0', max: '1.0', step: '0.1'},
      inputValue: this.propertiesSong.valueVolume,
      position: 'center-start',
      customClass: {
        content: 'content-range',
        popup: 'popup-input-range',
        input: 'input-range-volume',
        container: 'container-range',
        
      },
      didOpen: () => {
        const inputRange: any = Swal.getInput();
        inputRange.oninput = () => {
          this.volume(inputRange.value);
        };
      },
    });
  }

 


 
}

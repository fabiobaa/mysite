import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { ISong } from 'src/app/models/song/isong';
import { IMusicService } from "src/app/services/music/IMusicService";
import { map } from "rxjs/operators";
import { Song } from 'src/app/models/song/song';


@Injectable({
  providedIn: 'root'
})
export class MusicService  implements IMusicService{

  webapi:string = environment.WebApi;
  constructor(protected http: HttpClient) { }
  

  headers = new HttpHeaders();

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",          
    })
  };

  getAllSongs =() => {    
   this.httpOptions.headers = this.httpOptions.headers;  
   return this.http.get<Array<ISong>>(this.webapi  + 'music/songs',this.httpOptions).pipe(
     map(resp => {            
      return resp.map(song => Song.SongJson(song));      
     })
   );
  }
}

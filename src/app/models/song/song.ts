import { ISong } from "./isong";
import { environment } from "src/environments/environment";

export class Song   {

    static SongJson(obj: ISong){
      return new Song(          
        obj.Id,
        obj.Name,
        obj.Author,
        environment.origin +"assets/audio/"+ obj.Audio+".mp3",
        obj.Image,
        obj.Gender,
        obj.Status,
        obj.Artwork
      );         
    }

    constructor(
      public Id: number, 
      public Name: string,
      public Author: string,
      public Audio: string,
      public Image: string, 
      public Gender: string,
      public Status: boolean,
      public Artwork: []
    ){

    }

  




}

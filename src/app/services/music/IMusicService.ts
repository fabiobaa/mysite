import { Song } from "src/app/models/song/song";
import {Observable} from 'rxjs';
export interface IMusicService {
     getAllSongs: () => Observable<Song[]>;
}

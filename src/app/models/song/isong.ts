
export interface IMusic{
    ListSong: ISong[]
}

export interface ISong {
    Id: number, 
    Name: string,
    Author: string,
    Audio: string,
    Image: string, 
    Gender: string,
    Status: boolean
    Artwork:[]
}

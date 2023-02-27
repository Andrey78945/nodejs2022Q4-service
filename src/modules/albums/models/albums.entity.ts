export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null;
}

export type CreateAlbumDto = Omit<Album, 'id'>;

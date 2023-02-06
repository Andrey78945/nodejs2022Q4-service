import { Album } from 'src/modules/albums/models/albums.entity';
import { Artist } from 'src/modules/artists/models/artists.entity';
import { Track } from 'src/modules/tracks/models/tracks.entity';

export class Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export class FavoritesResponce {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

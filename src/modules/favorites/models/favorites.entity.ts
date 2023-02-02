import { Album } from 'src/modules/albums/models/albums.entity';
import { Artist } from 'src/modules/artists/models/artists.entity';
import { Track } from 'src/modules/tracks/models/tracks.entity';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponce {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

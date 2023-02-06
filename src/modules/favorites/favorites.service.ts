import { Injectable } from '@nestjs/common';
import { Favorites } from './models/favorites.entity';

@Injectable()
export class FavoritesService {
  private favs: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll(): Favorites {
    return this.favs;
  }

  add(id: string, itemType: string): void {
    if (itemType === 'artist') {
      this.favs.artists.push(id);
    }
    if (itemType === 'album') {
      this.favs.albums.push(id);
    }
    if (itemType === 'track') {
      this.favs.tracks.push(id);
    }
  }

  remove(id: string, itemType: string): void {
    if (itemType === 'artist') {
      const index = this.favs.tracks.indexOf(id);
      this.favs.artists.splice(index, 1);
    }
    if (itemType === 'album') {
      const index = this.favs.tracks.indexOf(id);
      this.favs.albums.splice(index, 1);
    }
    if (itemType === 'track') {
      const index = this.favs.tracks.indexOf(id);
      this.favs.tracks.splice(index, 1);
    }
  }

  isFavorite(id: string, itemType: string): boolean {
    if (itemType === 'artist') {
      return this.favs.artists.includes(id);
    }
    if (itemType === 'album') {
      return this.favs.albums.includes(id);
    }
    if (itemType === 'track') {
      return this.favs.tracks.includes(id);
    }
  }
}

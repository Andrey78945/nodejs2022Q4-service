import { Injectable } from '@nestjs/common';
import { Artist, CreateArtistDto } from './models/artists.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  create(artistDto: CreateArtistDto): Artist {
    const artist = {
      id: uuidv4(),
      name: artistDto.name,
      grammy: artistDto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const Artist: Artist | undefined = this.artists.find(
      (item: Artist): boolean => item.id === id,
    );
    return Artist;
  }

  remove(id: string): Artist {
    const Artist: Artist | undefined = this.artists.find(
      (item: Artist): boolean => item.id === id,
    );
    if (Artist) {
      const index = this.artists.indexOf(Artist);
      this.artists.splice(index, 1);
    }
    return Artist;
  }

  update(id: string, newArtistdDto: CreateArtistDto): Artist {
    const artist: Artist | undefined = this.artists.find(
      (item: Artist): boolean => item.id === id,
    );

    if (artist) {
      artist.grammy = newArtistdDto.grammy;
    }
    return artist;
  }
}

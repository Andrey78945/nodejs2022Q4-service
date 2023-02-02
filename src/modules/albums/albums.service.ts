import { Injectable } from '@nestjs/common';
import { Album, CreateAlbumDto } from './models/albums.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

  create(albumDto: CreateAlbumDto): Album {
    const user = {
      id: uuidv4(),
      name: albumDto.name,
      year: albumDto.year,
      artistId: albumDto.artistId,
    };
    this.albums.push(user);
    return user;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const user: Album | undefined = this.albums.find(
      (item: Album): boolean => item.id === id,
    );
    return user;
  }

  remove(id: string): Album {
    const album: Album | undefined = this.albums.find(
      (item: Album): boolean => item.id === id,
    );
    if (album) {
      const index = this.albums.indexOf(album);
      this.albums.splice(index, 1);
    }
    return album;
  }

  update(id: string, newAlbumdDto: CreateAlbumDto): Album {
    const album: Album | undefined = this.albums.find(
      (item: Album): boolean => item.id === id,
    );

    if (album) {
      album.name = newAlbumdDto.name;
      album.year = newAlbumdDto.year;
      album.artistId = newAlbumdDto.artistId;
    }
    return album;
  }
}

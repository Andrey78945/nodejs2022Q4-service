import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Favorites, FavoritesResponce } from './models/favorites.entity';
import { FavoritesService } from './favorites.service';
import { isUUID } from 'class-validator';
import { Artist } from '../artists/models/artists.entity';
import { Album } from '../albums/models/albums.entity';
import { Track } from '../tracks/models/tracks.entity';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Controller('favs')
export class FavoritesController {
  constructor(
    private favoritesService: FavoritesService,
    private artistsService: ArtistsService,
    private albumsService: AlbumsService,
    private tracksService: TracksService,
  ) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<FavoritesResponce> {
    const favs: Favorites = this.favoritesService.findAll();
    const artists: Artist[] = favs.artists.map(
      (id: string): Artist => this.artistsService.findOne(id),
    );
    const albums: Album[] = favs.albums.map(
      (id: string): Album => this.albumsService.findOne(id),
    );
    const tracks: Track[] = favs.tracks.map(
      (id: string): Track => this.tracksService.findOne(id),
    );
    return {
      artists,
      albums,
      tracks,
    };
  }

  @Post(':type/:id')
  @HttpCode(201)
  async create(@Param() params): Promise<void> {
    const itemType = params.type;
    const itemId = params.id;
    if (!isUUID(itemId)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    if (itemType === 'track') {
      const track = this.tracksService.findOne(itemId);
      if (!track) {
        throw new HttpException(
          'Track does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    if (itemType === 'artist') {
      const artist = this.artistsService.findOne(itemId);
      if (!artist) {
        throw new HttpException(
          'Artist does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    if (itemType === 'album') {
      const album = this.albumsService.findOne(itemId);
      if (!album) {
        throw new HttpException(
          'Album does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    this.favoritesService.add(itemId, itemType);
  }

  @Delete(':type/:id')
  @HttpCode(204)
  async remove(@Param() params): Promise<void> {
    const itemType = params.type;
    const itemId = params.id;
    if (!isUUID(itemId)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }

    if (!this.favoritesService.isFavorite(itemId, itemType)) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (itemType === 'track') {
      const track = this.tracksService.findOne(itemId);
      if (!track) {
        throw new HttpException(
          'Track does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    if (itemType === 'artist') {
      const artist = this.artistsService.findOne(itemId);
      if (!artist) {
        throw new HttpException(
          'Artist does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    if (itemType === 'album') {
      const album = this.albumsService.findOne(itemId);

      if (!album) {
        throw new HttpException(
          'Album does not exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    this.favoritesService.remove(itemId, itemType);
  }
}

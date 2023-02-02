import {
  Body,
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

  // @Post(':id')
  // @HttpCode(201)
  // async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
  //   //  console.log(createAlbumDto.name, 'type', typeof createAlbumDto.name);
  //   if (
  //     createTrackDto.name === undefined ||
  //     createTrackDto.name === null ||
  //     createTrackDto.name?.length === 0 ||
  //     createTrackDto.duration === undefined ||
  //     createTrackDto.duration < 0 ||
  //     createTrackDto.artistId === undefined ||
  //     createTrackDto.albumId === undefined
  //   ) {
  //     throw new HttpException(
  //       'You need to fill all parametres',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const album = this.tracksService.create(createTrackDto);
  //   return album;
  // }

  // @Delete(':id')
  // @HttpCode(204)
  // async remove(@Param('id') id: string): Promise<Track> {
  //   if (!isUUID(id)) {
  //     throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
  //   }
  //   const track = this.tracksService.remove(id);
  //   if (!track) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  //   return track;
  // }
}

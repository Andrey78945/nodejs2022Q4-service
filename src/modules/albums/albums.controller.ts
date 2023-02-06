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
  Put,
} from '@nestjs/common';
import { Album, CreateAlbumDto } from './models/albums.entity';
import { AlbumsService } from './albums.service';
import { isUUID } from 'class-validator';
import { ArtistsService } from '../artists/artists.service';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Controller('album')
export class AlbumsController {
  constructor(
    private albumsService: AlbumsService,
    private artistsServise: ArtistsService,
    private trackService: TracksService,
    private favoritesService: FavoritesService,
  ) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Album[]> {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param() params): Promise<Album> {
    if (!isUUID(params.id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const album = this.albumsService.findOne(params.id);
    if (!album) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return album;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (
      createAlbumDto.name === undefined ||
      createAlbumDto.name?.length === 0 ||
      createAlbumDto.year === undefined ||
      createAlbumDto.year < 0 ||
      createAlbumDto.artistId === undefined
    ) {
      throw new HttpException(
        'You need to fill all parametres',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = this.albumsService.create(createAlbumDto);
    return album;
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateAlbumdDto: CreateAlbumDto,
  ): Promise<Album> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }

    let album = this.albumsService.findOne(id);
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    const user = this.artistsServise.findOne(updateAlbumdDto.artistId);
    if (!user)
      throw new HttpException('Request is wrong', HttpStatus.BAD_REQUEST);

    try {
      album = this.albumsService.update(id, updateAlbumdDto);
    } catch {
      throw new HttpException('Request is wrong', HttpStatus.BAD_REQUEST);
    }

    return album;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<Album> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const album = this.albumsService.remove(id);

    if (!album) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const tracks = this.trackService.findAll();
    tracks.map((track) => {
      if (track.albumId === id) {
        this.trackService.update(track.id, {
          albumId: null,
          name: track.name,
          artistId: track.artistId,
          duration: track.duration,
        });
      }
    });
    const favs = this.favoritesService.findAll();
    if (favs) {
      favs.albums = favs.albums.filter((id) => id !== album.id);
    }
    return album;
  }
}

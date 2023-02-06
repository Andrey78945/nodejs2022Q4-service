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
import { Artist, CreateArtistDto } from './models/artists.entity';
import { ArtistsService } from './artists.service';
import { isUUID } from 'class-validator';
import { TracksService } from '../tracks/tracks.service';
import { FavoritesService } from '../favorites/favorites.service';

@Controller('artist')
export class ArtistsController {
  constructor(
    private artistsService: ArtistsService,
    private trackService: TracksService,
    private favoritesService: FavoritesService,
  ) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Artist[]> {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param() params): Promise<Artist> {
    if (!isUUID(params.id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const artist = this.artistsService.findOne(params.id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    if (
      createArtistDto.name === undefined ||
      createArtistDto.name?.length === 0 ||
      createArtistDto.grammy === undefined
    ) {
      throw new HttpException(
        'You need to fill both name and grammy',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.artistsService.create(createArtistDto);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }

    if (
      updateArtistDto.name === undefined ||
      typeof updateArtistDto.name === 'number' ||
      updateArtistDto.grammy === undefined
    ) {
      throw new HttpException(
        'You need to fill both name and grammy',
        HttpStatus.BAD_REQUEST,
      );
    }
    let artist = this.artistsService.findOne(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    try {
      artist = this.artistsService.update(id, updateArtistDto);
    } catch {
      throw new HttpException('Something is wrong', HttpStatus.FORBIDDEN);
    }

    return artist;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<Artist> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const artist = this.artistsService.remove(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    const tracks = this.trackService.findAll();
    tracks.map((track) => {
      if (track.artistId === id) {
        this.trackService.update(track.id, {
          artistId: null,
          name: track.name,
          albumId: track.albumId,
          duration: track.duration,
        });
      }
    });
    const favs = this.favoritesService.findAll();
    if (favs) {
      favs.artists = favs.artists.filter((id) => id !== artist.id);
    }
    return artist;
  }
}

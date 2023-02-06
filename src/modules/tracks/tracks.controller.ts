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
import { Track, CreateTrackDto } from './models/tracks.entity';
import { TracksService } from './tracks.service';
import { isUUID } from 'class-validator';
import { ArtistsService } from '../artists/artists.service';
import { FavoritesService } from '../favorites/favorites.service';

@Controller('track')
export class TracksController {
  constructor(
    private tracksService: TracksService,
    private artistsService: ArtistsService,
    private favoritesService: FavoritesService,
  ) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param() params): Promise<Track> {
    if (!isUUID(params.id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const track = this.tracksService.findOne(params.id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    return track;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    if (
      createTrackDto.name === undefined ||
      createTrackDto.name === null ||
      createTrackDto.name?.length === 0 ||
      createTrackDto.duration === undefined ||
      createTrackDto.duration < 0 ||
      createTrackDto.artistId === undefined ||
      createTrackDto.albumId === undefined
    ) {
      throw new HttpException(
        'You need to fill all parametres',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = this.tracksService.create(createTrackDto);
    return album;
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() updateTrackDto: CreateTrackDto,
  ): Promise<Track> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }

    let track = this.tracksService.findOne(id);
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    if (updateTrackDto.artistId) {
      const artist = this.artistsService.findOne(updateTrackDto.artistId);
      if (!artist)
        throw new HttpException('Request is wrong', HttpStatus.BAD_REQUEST);
    }

    // const albom = this.albumsService.findOne(updateTrackDto.albumId);
    // if (!albom)
    //   throw new HttpException('Request is wrong', HttpStatus.BAD_REQUEST);

    try {
      track = this.tracksService.update(id, updateTrackDto);
    } catch {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
    }

    return track;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<Track> {
    if (!isUUID(id)) {
      throw new HttpException('ID is not UUID', HttpStatus.BAD_REQUEST);
    }
    const track = this.tracksService.remove(id);
    if (!track) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const favs = this.favoritesService.findAll();
    if (favs) {
      favs.tracks = favs.tracks.filter((id) => id !== track.id);
    }
    return track;
  }
}

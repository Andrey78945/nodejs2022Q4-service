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

@Controller('track')
export class TracksController {
  constructor(private tracksService: TracksService) {}

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
    //  console.log(createAlbumDto.name, 'type', typeof createAlbumDto.name);
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
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

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
    return track;
  }
}

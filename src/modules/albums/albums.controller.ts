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

@Controller('album')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

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
    console.log(createAlbumDto.name, 'type', typeof createAlbumDto.name);
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

    try {
      album = this.albumsService.update(id, updateAlbumdDto);
    } catch {
      throw new HttpException('Old password is wrong', HttpStatus.FORBIDDEN);
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
    return album;
  }
}

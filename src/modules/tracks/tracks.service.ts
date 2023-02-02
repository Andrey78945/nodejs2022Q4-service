import { Injectable } from '@nestjs/common';
import { Track, CreateTrackDto } from './models/tracks.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  create(trackDto: CreateTrackDto): Track {
    const track = {
      id: uuidv4(),
      name: trackDto.name,
      artistId: trackDto.artistId,
      albumId: trackDto.albumId,
      duration: trackDto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const user: Track | undefined = this.tracks.find(
      (item: Track): boolean => item.id === id,
    );
    return user;
  }

  remove(id: string): Track {
    const track: Track | undefined = this.tracks.find(
      (item: Track): boolean => item.id === id,
    );
    if (track) {
      const index = this.tracks.indexOf(track);
      this.tracks.splice(index, 1);
    }
    return track;
  }

  update(id: string, newTrackDto: CreateTrackDto): Track {
    const track: Track | undefined = this.tracks.find(
      (item: Track): boolean => item.id === id,
    );

    if (track) {
      track.name = newTrackDto.name;
      track.artistId = newTrackDto.artistId;
      track.albumId = newTrackDto.albumId;
      track.duration = newTrackDto.duration;
    }
    return track;
  }
}

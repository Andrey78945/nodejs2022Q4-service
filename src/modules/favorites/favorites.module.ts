import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesModule],
  imports: [ArtistsModule, AlbumsModule, TracksModule],
})
export class FavoritesModule {}

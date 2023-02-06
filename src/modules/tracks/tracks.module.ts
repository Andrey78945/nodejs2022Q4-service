import { Module, forwardRef } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { ArtistsModule } from '../artists/artists.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
  imports: [forwardRef(() => ArtistsModule), forwardRef(() => FavoritesModule)],
})
export class TracksModule {}

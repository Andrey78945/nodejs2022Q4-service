import { Module, forwardRef } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
  imports: [forwardRef(() => ArtistsModule)],
})
export class TracksModule {}

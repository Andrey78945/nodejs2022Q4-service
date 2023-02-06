export class Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export type CreateArtistDto = Omit<Artist, 'id'>;

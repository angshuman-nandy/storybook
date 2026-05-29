export interface Story {
  id: string;
  title: string;
  tagline: string;
  thumbnail: string;
  url: string;
  accent: string;
  added?: string; // "YYYY-MM-DD"
}

export interface Manifest {
  version: number;
  stories: Story[];
}

export enum Type {
  AVAILABLE,
  COMING_SOON,
}

export interface movieData {
  id: string;
  title: string;
  description: string;
  chips: string[];
  times: string[];
  imageUrl: {
    url: string;
    alt: string;
  };
  releaseDate: string;
  duration: number;
  rating: string;
  language: string;
  doubled: boolean;
  coming: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artist: Artist;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  image: string;
  price?: number;
  category: ArtCategory;
  featured?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  biography: string;
  birthYear?: number;
  nationality: string;
  website?: string;
  instagram?: string;
  artworks?: Artwork[];
}

export interface Exhibition {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  artworks: string[]; // artwork IDs
  featured: boolean;
}

export type ArtCategory = 
  | 'painting' 
  | 'sculpture' 
  | 'photography' 
  | 'digital' 
  | 'mixed-media' 
  | 'drawing';

export type ArtStyle = 
  | 'abstract' 
  | 'contemporary' 
  | 'classical' 
  | 'impressionist' 
  | 'modern' 
  | 'street-art';

export interface FilterOptions {
  category?: ArtCategory;
  style?: ArtStyle;
  artist?: string;
  priceRange?: [number, number];
  year?: [number, number];
}
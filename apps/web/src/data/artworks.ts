import { Artwork, Artist } from '@/types/gallery';
import artwork1 from '@/assets/artwork-1.jpg';
import artwork2 from '@/assets/artwork-2.jpg';
import artwork3 from '@/assets/artwork-3.jpg';
import artwork4 from '@/assets/artwork-4.jpg';
import artwork5 from '@/assets/artwork-5.jpg';
import artwork6 from '@/assets/artwork-6.jpg';

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Marina Volkov',
    biography: 'Contemporary abstract artist known for bold expressionist works that explore themes of emotion and human connection.',
    birthYear: 1978,
    nationality: 'Russian-American',
    website: 'https://marinavolkov.art',
    instagram: '@marina.volkov.art'
  },
  {
    id: '2',
    name: 'James Chen',
    biography: 'Minimalist sculptor working primarily with marble and steel, creating pieces that explore the intersection of nature and industry.',
    birthYear: 1985,
    nationality: 'Canadian',
    website: 'https://jameschen.studio'
  },
  {
    id: '3',
    name: 'Isabella Romano',
    biography: 'Classical portrait painter trained in Florence, bringing renaissance techniques to contemporary subjects.',
    birthYear: 1975,
    nationality: 'Italian',
    instagram: '@isabella.romano.art'
  },
  {
    id: '4',
    name: 'Alex Kim',
    biography: 'Digital artist and new media pioneer, exploring the boundaries between virtual and physical art experiences.',
    birthYear: 1990,
    nationality: 'Korean-American',
    website: 'https://alexkim.digital'
  },
  {
    id: '5',
    name: 'Emma Thompson',
    biography: 'Landscape artist working in impressionist style, capturing the fleeting moments of natural light and atmosphere.',
    birthYear: 1982,
    nationality: 'British'
  },
  {
    id: '6',
    name: 'Carlos Rivera',
    biography: 'Street artist turned gallery exhibitor, bringing urban culture and social commentary to fine art spaces.',
    birthYear: 1988,
    nationality: 'Mexican-American',
    instagram: '@carlos.rivera.art'
  }
];

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Crimson Confluence',
    artist: artists[0],
    year: 2024,
    medium: 'Oil and acrylic on canvas',
    dimensions: '120 × 150 cm',
    description: 'A powerful abstract expressionist work exploring the intersection of passion and tranquility through bold burgundy and gold brushstrokes.',
    image: artwork1,
    price: 15000,
    category: 'painting',
    featured: true
  },
  {
    id: '2',
    title: 'Equilibrium',
    artist: artists[1],
    year: 2023,
    medium: 'White marble and steel',
    dimensions: '180 × 90 × 45 cm',
    description: 'A minimalist sculpture that captures the delicate balance between natural stone and industrial materials.',
    image: artwork2,
    price: 25000,
    category: 'sculpture',
    featured: true
  },
  {
    id: '3',
    title: 'Portrait of a Dreamer',
    artist: artists[2],
    year: 2024,
    medium: 'Oil on canvas',
    dimensions: '80 × 100 cm',
    description: 'A classical portrait painted in renaissance tradition, capturing the subject\'s inner contemplation and grace.',
    image: artwork3,
    price: 12000,
    category: 'painting'
  },
  {
    id: '4',
    title: 'Digital Synthesis',
    artist: artists[3],
    year: 2024,
    medium: 'Digital art, LED display',
    dimensions: '100 × 80 cm',
    description: 'An innovative digital artwork that merges geometric patterns with vibrant colors, questioning the nature of contemporary art.',
    image: artwork4,
    price: 8000,
    category: 'digital',
    featured: true
  },
  {
    id: '5',
    title: 'Morning Mist',
    artist: artists[4],
    year: 2023,
    medium: 'Oil on canvas',
    dimensions: '90 × 120 cm',
    description: 'An impressionist landscape capturing the ethereal quality of morning light filtering through mist.',
    image: artwork5,
    price: 9500,
    category: 'painting'
  },
  {
    id: '6',
    title: 'Urban Pulse',
    artist: artists[5],
    year: 2024,
    medium: 'Acrylic and mixed media on canvas',
    dimensions: '150 × 120 cm',
    description: 'A vibrant street art piece that brings urban energy and social commentary into the gallery space.',
    image: artwork6,
    price: 7500,
    category: 'mixed-media'
  }
];

export const featuredArtworks = artworks.filter(artwork => artwork.featured);
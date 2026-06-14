import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const WORKING_ART_IMAGE_URLS: string[] = JSON.parse(
  readFileSync('scripts/working_image_urls.json', 'utf-8')
);

const prisma = new PrismaClient();

async function main() {
  const artworks = await prisma.artwork.findMany({ orderBy: { id: 'asc' } });
  let fixed = 0;

  for (let i = 0; i < artworks.length; i++) {
    const art = artworks[i];
    const url = art.imageUrl || '';
    const needsFix =
      url.includes('upload.wikimedia.org') ||
      !url.startsWith('https://images.unsplash.com/');

    if (needsFix) {
      await prisma.artwork.update({
        where: { id: art.id },
        data: { imageUrl: WORKING_ART_IMAGE_URLS[i % WORKING_ART_IMAGE_URLS.length] },
      });
      fixed++;
    }
  }

  console.log(`Updated ${fixed} artwork image URLs to working Unsplash links.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

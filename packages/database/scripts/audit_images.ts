import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const WORKING_ART_IMAGE_URLS: string[] = JSON.parse(
  readFileSync('scripts/working_image_urls.json', 'utf-8')
);

const prisma = new PrismaClient();

async function main() {
  const artworks = await prisma.artwork.findMany();
  console.log(`Auditing ${artworks.length} artworks...`);
  
  const report = [];
  const broken = [];
  
  for (const art of artworks) {
    if (!art.imageUrl) continue;
    try {
      const res = await fetch(art.imageUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      const status = res.status;
      const type = res.headers.get('content-type');
      let isOk = status === 200 && type && type.startsWith('image/');
      
      // Unsplash returns 403 or 404 sometimes
      report.push({ title: art.title.slice(0, 20), url: art.imageUrl.slice(0, 40) + '...', status, type });
      
      if (!isOk) {
        broken.push(art);
      }
    } catch (err) {
      report.push({ title: art.title.slice(0, 20), url: art.imageUrl.slice(0, 40) + '...', status: 'error', type: '-' });
      broken.push(art);
    }
  }
  
  console.table(report);
  console.log(`\nFound ${broken.length} broken images.`);
  
  const fallbacks = WORKING_ART_IMAGE_URLS;
  
  if (broken.length > 0) {
    let fbIndex = 0;
    for (const b of broken) {
      const newUrl = fallbacks[fbIndex % fallbacks.length];
      await prisma.artwork.update({
        where: { id: b.id },
        data: { imageUrl: newUrl }
      });
      console.log(`[FIXED] "${b.title}" -> ${newUrl}`);
      fbIndex++;
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

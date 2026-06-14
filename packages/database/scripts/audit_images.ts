import { PrismaClient } from '@prisma/client';

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
  
  const fallbacks = [
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Stonehenge%2C_2007_07_30.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/9/96/Golden_Gate_Bridge%2C_SF_%28cropped%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5c/Mont_Saint-Michel_and_Saint_Jude.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/4/45/Aurora_Borealis_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/66/Monet%2C_Claudine_2.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/34/Hubble_Deep_Field_1b.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Starry_Night_Over_the_Rhone.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5f/The_Scream.jpg'
  ];
  
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

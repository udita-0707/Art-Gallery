import { Router, Request, Response } from 'express';
import { PrismaClient } from '@spectrum/database';
import asyncHandler from 'express-async-handler';
import { openai } from '../lib/openai';
import { requireAuth } from '../middleware/auth';


const router = Router();
const prisma = new PrismaClient();

// AI Semantic Search Endpoint
router.post('/search', asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  // 1. Generate embedding for the search query
  const embeddingResp = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  
  const embedding = embeddingResp.data[0].embedding;
  const embeddingVector = `[${embedding.join(',')}]`;

  // 2. Perform vector similarity search in Postgres
  // This uses pgvector's cosine distance operator (<=>)
  const artworks = await prisma.$queryRaw`
    SELECT id, title, description, "imageUrl", price, "isModerated", 
           1 - (embedding <=> ${embeddingVector}::vector) as similarity
    FROM "Artwork"
    WHERE "isModerated" = true
    ORDER BY embedding <=> ${embeddingVector}::vector
    LIMIT 10;
  `;

  res.json(artworks);
}));

// Get all artworks
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const artworks = await prisma.artwork.findMany({
    include: {
      artist: {
        include: { user: true }
      },
      category: true,
      tags: true
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(artworks);
}));

// Get all categories
router.get('/categories', asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
}));

// Get a single artwork by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const artwork = await prisma.artwork.findUnique({
    where: { id: req.params.id },
    include: {
      artist: {
        include: { user: true }
      },
      category: true,
      tags: true
    }
  });

  if (!artwork) {
    res.status(404).json({ error: 'Artwork not found' });
    return;
  }

  res.json(artwork);
}));

// Upload and Process new Artwork
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { title, description, price, imageUrl, artistId, categoryId } = req.body;

  let isFlagged = false;
  let aiTags = ['fine-art', 'contemporary'];
  let embedding = Array(1536).fill(0);

  try {
    // 1. Moderation Check
    const moderation = await openai.moderations.create({
      input: description,
    });
    isFlagged = moderation.results[0].flagged;
  } catch (error) {
    console.warn('OpenAI moderation failed, falling back to auto-approval:', error);
  }

  if (isFlagged) {
    res.status(400).json({ error: 'Content violates moderation policy.' });
    return;
  }

  try {
    // 2. AI Auto-Tagging
    const aiTagsResp = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Extract 3-5 descriptive tags for an artwork with the following title and description. Return comma separated.' },
        { role: 'user', content: `Title: ${title}\nDescription: ${description}` }
      ]
    });
    const tagsString = aiTagsResp.choices[0].message.content || '';
    aiTags = tagsString.split(',').map(t => t.trim());
  } catch (error) {
    console.warn('OpenAI auto-tagging failed, using default tags:', error);
  }

  try {
    // 3. Generate Embedding for the Artwork
    const combinedText = `${title}. ${description}. Tags: ${aiTags.join(', ')}`;
    const embeddingResp = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: combinedText,
    });
    embedding = embeddingResp.data[0].embedding;
  } catch (error) {
    console.warn('OpenAI embedding generation failed, using fallback vector:', error);
  }

  // 4. Save to Database using Prisma (Raw query to handle vector)
  const embeddingVector = `[${embedding.join(',')}]`;

  // We perform queryRaw to return array of returned rows. 
  // Under Prisma 5, queryRaw returns an array of objects e.g. [ { id: '...' } ]
  const returnedRows: any = await prisma.$queryRaw`
    INSERT INTO "Artwork" (id, "artistId", title, description, price, "imageUrl", "categoryId", "aiTags", "isModerated", embedding)
    VALUES (
      gen_random_uuid(), 
      ${artistId}, 
      ${title}, 
      ${description}, 
      ${Number(price)}, 
      ${imageUrl}, 
      ${categoryId}, 
      ${aiTags}, 
      true,
      ${embeddingVector}::vector
    )
    RETURNING id;
  `;

  const createdId = returnedRows?.[0]?.id;

  res.json({ success: true, artworkId: createdId, aiTags });
}));

// Update an artwork (Auth required)
router.put('/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { title, description, price, imageUrl, categoryId } = req.body;

  const existing = await prisma.artwork.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Artwork not found' });
    return;
  }

  const updated = await prisma.artwork.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(imageUrl && { imageUrl }),
      ...(categoryId && { categoryId }),
    },
    include: {
      artist: { include: { user: true } },
      category: true,
      tags: true,
    },
  });

  res.json(updated);
}));

// Delete an artwork (Auth required)
router.delete('/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.artwork.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Artwork not found' });
    return;
  }

  await prisma.artwork.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

export default router;


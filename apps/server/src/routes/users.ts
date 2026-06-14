import { Router, Request, Response } from 'express';
import { PrismaClient } from '@spectrum/database';
import asyncHandler from 'express-async-handler';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all artists (Public)
router.get('/artists', asyncHandler(async (req: Request, res: Response) => {
  const artists = await prisma.artistProfile.findMany({
    include: {
      user: true,
      artworks: true
    }
  });
  res.json(artists);
}));

// Get current user favorites (Protected)
router.get('/favorites', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const auth = (req as any).auth;
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: auth.userId }
  });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: auth.userId, artworkIds: [] }
    });
  }
  res.json(wishlist.artworkIds);
}));

// Toggle a favorite (Protected)
router.post('/favorites', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { artworkId } = req.body;
  if (!artworkId) {
    res.status(400).json({ error: 'Artwork ID is required' });
    return;
  }
  
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: auth.userId }
  });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: auth.userId, artworkIds: [] }
    });
  }

  let updatedIds = [...wishlist.artworkIds];
  if (updatedIds.includes(artworkId)) {
    updatedIds = updatedIds.filter(id => id !== artworkId);
  } else {
    updatedIds.push(artworkId);
  }

  await prisma.wishlist.update({
    where: { userId: auth.userId },
    data: { artworkIds: updatedIds }
  });

  res.json(updatedIds);
}));

// Get current user profile (Protected)
router.get('/me', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const auth = (req as any).auth;
  
  if (!auth?.userId) {
     res.status(401).json({ error: 'Unauthorized' });
     return;
  }

  let user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { profile: true }
  });

  // Automatically create a user record in our DB if they logged in via Clerk for the first time
  if (!user) {
    // In a real app we might fetch user email via Clerk API, or rely on a webhook.
    // For now we just create a placeholder with their Clerk ID.
    user = await prisma.user.create({
      data: {
        id: auth.userId,
        email: `${auth.userId}@placeholder.com`, // Placeholder
      },
      include: { profile: true }
    });
  }

  res.json(user);
}));

export default router;

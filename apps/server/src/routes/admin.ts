import { Router, Request, Response } from 'express';
import { PrismaClient } from '@spectrum/database';
import asyncHandler from 'express-async-handler';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ── GET admin stats (Auth required) ─────────────────────────────────────────
router.get('/stats', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const [artworksCount, artistsCount, exhibitionsCount, usersCount, pendingModerationCount] = await Promise.all([
    prisma.artwork.count(),
    prisma.artistProfile.count(),
    prisma.exhibition.count(),
    prisma.user.count(),
    prisma.artwork.count({ where: { isModerated: false } }),
  ]);

  res.json({
    artworksCount,
    artistsCount,
    exhibitionsCount,
    usersCount,
    pendingModerationCount,
  });
}));

// ── PATCH moderate artwork (Auth required) ────────────────────────────────────
router.patch('/artworks/:id/moderate', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const artwork = await prisma.artwork.findUnique({ where: { id: req.params.id } });
  if (!artwork) {
    res.status(404).json({ error: 'Artwork not found' });
    return;
  }

  const updated = await prisma.artwork.update({
    where: { id: req.params.id },
    data: { isModerated: !artwork.isModerated },
    include: { artist: { include: { user: true } }, category: true },
  });

  res.json(updated);
}));

// ── DELETE artist profile (Auth required) ─────────────────────────────────────
router.delete('/artists/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const profile = await prisma.artistProfile.findUnique({ where: { id: req.params.id } });
  if (!profile) {
    res.status(404).json({ error: 'Artist profile not found' });
    return;
  }

  // Delete associated artworks first
  await prisma.artwork.deleteMany({ where: { artistId: req.params.id } });
  await prisma.artistProfile.delete({ where: { id: req.params.id } });

  res.json({ success: true });
}));

// ── PATCH verify/unverify artist (Auth required) ──────────────────────────────
router.patch('/artists/:id/verify', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const profile = await prisma.artistProfile.findUnique({ where: { id: req.params.id } });
  if (!profile) {
    res.status(404).json({ error: 'Artist profile not found' });
    return;
  }

  const updated = await prisma.artistProfile.update({
    where: { id: req.params.id },
    data: { isVerified: !profile.isVerified },
    include: { user: true, artworks: true },
  });

  res.json(updated);
}));

// ── PATCH update artist bio (Auth required) ───────────────────────────────────
router.patch('/artists/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { bio } = req.body;
  const profile = await prisma.artistProfile.findUnique({ where: { id: req.params.id } });
  if (!profile) {
    res.status(404).json({ error: 'Artist profile not found' });
    return;
  }

  const updated = await prisma.artistProfile.update({
    where: { id: req.params.id },
    data: { ...(bio !== undefined && { bio }) },
    include: { user: true, artworks: true },
  });

  res.json(updated);
}));

export default router;

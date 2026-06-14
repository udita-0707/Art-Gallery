import { Router, Request, Response } from 'express';
import { PrismaClient } from '@spectrum/database';
import asyncHandler from 'express-async-handler';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ── GET all exhibitions (Public) ────────────────────────────────────────────
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { startDate: 'desc' },
  });
  res.json(exhibitions);
}));

// ── GET single exhibition by ID (Public) ────────────────────────────────────
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const exhibition = await prisma.exhibition.findUnique({
    where: { id: req.params.id },
  });
  if (!exhibition) {
    res.status(404).json({ error: 'Exhibition not found' });
    return;
  }
  res.json(exhibition);
}));

// ── POST create exhibition (Auth required) ──────────────────────────────────
router.post('/', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, location, status, featured, curator, artworkIds } = req.body;

  if (!title || !description || !startDate || !endDate || !location) {
    res.status(400).json({ error: 'title, description, startDate, endDate, and location are required' });
    return;
  }

  const exhibition = await prisma.exhibition.create({
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      status: status || 'UPCOMING',
      featured: featured || false,
      curator: curator || null,
      artworkIds: artworkIds || [],
    },
  });

  res.status(201).json(exhibition);
}));

// ── PUT update exhibition (Auth required) ────────────────────────────────────
router.put('/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, location, status, featured, curator, artworkIds } = req.body;

  const existing = await prisma.exhibition.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Exhibition not found' });
    return;
  }

  const updated = await prisma.exhibition.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(location && { location }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(curator !== undefined && { curator }),
      ...(artworkIds && { artworkIds }),
    },
  });

  res.json(updated);
}));

// ── DELETE exhibition (Auth required) ────────────────────────────────────────
router.delete('/:id', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.exhibition.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: 'Exhibition not found' });
    return;
  }

  await prisma.exhibition.delete({ where: { id: req.params.id } });
  res.json({ success: true });
}));

export default router;

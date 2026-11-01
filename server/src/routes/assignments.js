import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
});

// List all assignments (public browse)
router.get('/', async (req, res) => {
  try {
    const { subject, search, page = 1, limit = 12 } = req.query;
    const where = {};
    if (subject && subject !== 'all') where.subject = subject;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [assignments, total] = await Promise.all([
      req.prisma.assignment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          reviews: { select: { id: true, designRating: true, functionalityRating: true, codeQualityRating: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      req.prisma.assignment.count({ where }),
    ]);

    res.json({ assignments, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error('List assignments error:', err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get single assignment
router.get('/:id', async (req, res) => {
  try {
    const assignment = await req.prisma.assignment.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, avatar: true, bio: true } },
        reviews: {
          include: { reviewer: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    console.error('Get assignment error:', err);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Create assignment (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const data = assignmentSchema.parse(req.body);
    const assignment = await req.prisma.assignment.create({
      data: {
        ...data,
        githubUrl: data.githubUrl || null,
        userId: req.user.id,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    await req.prisma.activity.create({
      data: {
        type: 'assignment_submitted',
        message: `Submitted "${assignment.title}"`,
        userId: req.user.id,
      },
    });

    res.status(201).json(assignment);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Create assignment error:', err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get assignments by current user
router.get('/user/me', authenticate, async (req, res) => {
  try {
    const assignments = await req.prisma.assignment.findMany({
      where: { userId: req.user.id },
      include: {
        reviews: { select: { id: true, designRating: true, functionalityRating: true, codeQualityRating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(assignments);
  } catch (err) {
    console.error('Get user assignments error:', err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Delete assignment (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const assignment = await req.prisma.assignment.findUnique({ where: { id: req.params.id } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    if (assignment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await req.prisma.assignment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error('Delete assignment error:', err);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

// Get distinct subjects
router.get('/meta/subjects', async (req, res) => {
  try {
    const subjects = await req.prisma.assignment.findMany({
      select: { subject: true },
      distinct: ['subject'],
      orderBy: { subject: 'asc' },
    });
    res.json(subjects.map((s) => s.subject));
  } catch (err) {
    console.error('Get subjects error:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

export default router;

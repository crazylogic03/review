import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';

const router = Router();

const reviewSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  designRating: z.number().min(1).max(5),
  functionalityRating: z.number().min(1).max(5),
  codeQualityRating: z.number().min(1).max(5),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const data = reviewSchema.parse(req.body);

    // Can't review own assignment
    const assignment = await req.prisma.assignment.findUnique({ where: { id: data.assignmentId } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    if (assignment.userId === req.user.id) {
      return res.status(400).json({ error: 'You cannot review your own assignment' });
    }

    // Check for existing review
    const existing = await req.prisma.review.findUnique({
      where: { assignmentId_reviewerId: { assignmentId: data.assignmentId, reviewerId: req.user.id } },
    });
    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this assignment' });
    }

    const review = await req.prisma.review.create({
      data: {
        designRating: data.designRating,
        functionalityRating: data.functionalityRating,
        codeQualityRating: data.codeQualityRating,
        feedback: data.feedback,
        assignmentId: data.assignmentId,
        reviewerId: req.user.id,
      },
      include: { reviewer: { select: { id: true, name: true, avatar: true } } },
    });

    await req.prisma.activity.create({
      data: {
        type: 'review_submitted',
        message: `Reviewed "${assignment.title}"`,
        userId: req.user.id,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// Get reviews by current user
router.get('/user/me', authenticate, async (req, res) => {
  try {
    const reviews = await req.prisma.review.findMany({
      where: { reviewerId: req.user.id },
      include: {
        assignment: { select: { id: true, title: true, subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    console.error('Get user reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews received on current user's assignments
router.get('/received', authenticate, async (req, res) => {
  try {
    const reviews = await req.prisma.review.findMany({
      where: { assignment: { userId: req.user.id } },
      include: {
        assignment: { select: { id: true, title: true, subject: true } },
        reviewer: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    console.error('Get received reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;

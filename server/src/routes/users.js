import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true, name: true, email: true, bio: true, avatar: true, role: true, createdAt: true,
        assignments: {
          include: {
            reviews: { select: { id: true, designRating: true, functionalityRating: true, codeQualityRating: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { assignments: true, reviews: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update own profile
router.patch('/me', authenticate, async (req, res) => {
  try {
    const { name, bio, phone } = req.body;
    const user = await req.prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name }), ...(bio !== undefined && { bio }), ...(phone !== undefined && { phone }) },
      select: { id: true, name: true, email: true, phone: true, bio: true, avatar: true, role: true },
    });
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get dashboard stats for current user
router.get('/me/stats', authenticate, async (req, res) => {
  try {
    const [assignmentCount, pendingReviews, feedbackReceived, recentActivity] = await Promise.all([
      req.prisma.assignment.count({ where: { userId: req.user.id } }),
      req.prisma.assignment.count({
        where: { NOT: { userId: req.user.id }, reviews: { none: { reviewerId: req.user.id } } },
      }),
      req.prisma.review.count({ where: { assignment: { userId: req.user.id } } }),
      req.prisma.activity.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);
    res.json({ assignmentCount, pendingReviews, feedbackReceived, recentActivity });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;

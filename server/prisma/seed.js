import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.review.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const hashedPassword = await argon2.hash('demo123456');

  const admin = await prisma.user.create({
    data: {
      email: 'admin@peerreview.demo',
      password: hashedPassword,
      name: 'Dr. Sarah Chen',
      phone: '+1-555-0100',
      role: 'ADMIN',
      bio: 'Computer Science Professor & Platform Administrator',
      avatar: null,
    },
  });

  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alex@peerreview.demo',
        password: hashedPassword,
        name: 'Alex Rivera',
        phone: '+1-555-0101',
        role: 'STUDENT',
        bio: 'Full-stack developer passionate about clean code and modern UI design.',
        avatar: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'priya@peerreview.demo',
        password: hashedPassword,
        name: 'Priya Sharma',
        role: 'STUDENT',
        bio: 'Data science enthusiast exploring machine learning and visualization.',
        avatar: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jordan@peerreview.demo',
        password: hashedPassword,
        name: 'Jordan Williams',
        phone: '+1-555-0103',
        role: 'STUDENT',
        bio: 'Backend engineer with a love for scalable systems and databases.',
        avatar: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'mei@peerreview.demo',
        password: hashedPassword,
        name: 'Mei Zhang',
        role: 'STUDENT',
        bio: 'UX designer turned developer. Bridging design and code.',
        avatar: null,
      },
    }),
    prisma.user.create({
      data: {
        email: 'omar@peerreview.demo',
        password: hashedPassword,
        name: 'Omar Hassan',
        phone: '+1-555-0105',
        role: 'STUDENT',
        bio: 'Mobile and web developer focusing on accessibility and performance.',
        avatar: null,
      },
    }),
  ]);

  // Create assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'E-Commerce Dashboard with Real-Time Analytics',
        subject: 'Web Development',
        description:
          'Built a responsive e-commerce admin dashboard featuring real-time sales analytics, inventory management, and order tracking. Uses React with Chart.js for data visualization and a Node.js backend with WebSocket for live updates.',
        githubUrl: 'https://github.com/demo/ecommerce-dashboard',
        status: 'submitted',
        userId: students[0].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Sentiment Analysis API with NLP',
        subject: 'Machine Learning',
        description:
          'Developed a REST API that performs sentiment analysis on text inputs using a fine-tuned BERT model. Includes batch processing, confidence scores, and a simple web interface for testing. Deployed on a containerized environment.',
        githubUrl: 'https://github.com/demo/sentiment-api',
        status: 'submitted',
        userId: students[1].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Distributed Task Queue System',
        subject: 'Systems Design',
        description:
          'Implemented a distributed task queue inspired by Celery. Features include task prioritization, retry logic with exponential backoff, dead-letter queues, and a monitoring dashboard. Built with Go and Redis.',
        githubUrl: 'https://github.com/demo/task-queue',
        status: 'submitted',
        userId: students[2].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Accessible Design System Component Library',
        subject: 'UI/UX Design',
        description:
          'Created a comprehensive design system with 30+ accessible React components following WCAG 2.1 AA guidelines. Includes theming, dark mode, RTL support, and Storybook documentation with interaction testing.',
        githubUrl: 'https://github.com/demo/design-system',
        status: 'submitted',
        userId: students[3].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Progressive Web App for Fitness Tracking',
        subject: 'Mobile Development',
        description:
          'Built a PWA fitness tracker with offline-first architecture using service workers and IndexedDB. Features workout logging, progress charts, social sharing, and push notifications. Achieves 98+ Lighthouse score.',
        githubUrl: 'https://github.com/demo/fitness-pwa',
        status: 'submitted',
        userId: students[4].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'RESTful Blog Platform with CMS',
        subject: 'Web Development',
        description:
          'Full-featured blog platform with a custom CMS, markdown editor, image optimization pipeline, SEO management, and role-based access control. Built with Next.js and PostgreSQL.',
        githubUrl: 'https://github.com/demo/blog-cms',
        status: 'submitted',
        userId: students[0].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Image Classification with Transfer Learning',
        subject: 'Machine Learning',
        description:
          'Trained a convolutional neural network for multi-class image classification using transfer learning from ResNet50. Includes data augmentation, model evaluation metrics, and a Gradio web demo.',
        githubUrl: 'https://github.com/demo/image-classifier',
        status: 'submitted',
        userId: students[1].id,
      },
    }),
  ]);

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        designRating: 5,
        functionalityRating: 4,
        codeQualityRating: 5,
        feedback:
          'Excellent dashboard design with intuitive navigation. The real-time analytics are impressive. Consider adding more granular date filters for the charts. Code is very clean and well-organized.',
        assignmentId: assignments[0].id,
        reviewerId: students[1].id,
      },
    }),
    prisma.review.create({
      data: {
        designRating: 4,
        functionalityRating: 5,
        codeQualityRating: 4,
        feedback:
          'The API is well-documented and the sentiment analysis accuracy is remarkable. Great use of BERT fine-tuning. The batch processing endpoint is a nice touch. Suggest adding rate limiting.',
        assignmentId: assignments[1].id,
        reviewerId: students[2].id,
      },
    }),
    prisma.review.create({
      data: {
        designRating: 3,
        functionalityRating: 5,
        codeQualityRating: 5,
        feedback:
          'Outstanding systems design. The retry logic and dead-letter queue implementation are production-ready. The monitoring dashboard could use more polish visually, but the functionality is top-notch.',
        assignmentId: assignments[2].id,
        reviewerId: students[0].id,
      },
    }),
    prisma.review.create({
      data: {
        designRating: 5,
        functionalityRating: 5,
        codeQualityRating: 5,
        feedback:
          'This design system is incredibly comprehensive. The accessibility features are thorough and the Storybook docs make it easy to use. Perfect dark mode implementation. Would love to see animation utilities added.',
        assignmentId: assignments[3].id,
        reviewerId: students[4].id,
      },
    }),
    prisma.review.create({
      data: {
        designRating: 5,
        functionalityRating: 4,
        codeQualityRating: 4,
        feedback:
          'Beautiful PWA with smooth offline experience. The service worker caching strategy is well thought out. The workout logging is intuitive. Consider adding data export functionality.',
        assignmentId: assignments[4].id,
        reviewerId: students[3].id,
      },
    }),
    prisma.review.create({
      data: {
        designRating: 4,
        functionalityRating: 4,
        codeQualityRating: 5,
        feedback:
          'Solid e-commerce dashboard. The WebSocket integration for live updates works flawlessly. Great separation of concerns in the codebase. Charts could benefit from more interactivity.',
        assignmentId: assignments[0].id,
        reviewerId: students[3].id,
      },
    }),
    prisma.review.create({
      data: {
        designRating: 4,
        functionalityRating: 5,
        codeQualityRating: 4,
        feedback:
          'The CMS is feature-rich and the markdown editor works beautifully. SEO tools are a great addition. Image optimization pipeline is clever. Code could use more inline comments.',
        assignmentId: assignments[5].id,
        reviewerId: students[2].id,
      },
    }),
  ]);

  // Create activities
  const now = new Date();
  const activities = [];
  
  for (let i = 0; i < students.length; i++) {
    activities.push(
      prisma.activity.create({
        data: {
          type: 'assignment_submitted',
          message: `Submitted "${assignments[i].title}"`,
          userId: students[i].id,
          createdAt: new Date(now.getTime() - (7 - i) * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  for (let i = 0; i < reviews.length; i++) {
    const reviewerIndex = [1, 2, 0, 4, 3, 3, 2][i];
    activities.push(
      prisma.activity.create({
        data: {
          type: 'review_submitted',
          message: `Reviewed "${assignments[Math.min(i, assignments.length - 1)].title}"`,
          userId: students[reviewerIndex].id,
          createdAt: new Date(now.getTime() - (5 - i) * 24 * 60 * 60 * 1000),
        },
      })
    );
  }

  await Promise.all(activities);

  console.log('✅ Seed data created successfully!');
  console.log(`   - ${1} admin user`);
  console.log(`   - ${students.length} student users`);
  console.log(`   - ${assignments.length} assignments`);
  console.log(`   - ${reviews.length} reviews`);
  console.log(`\n📧 Demo Credentials:`);
  console.log(`   Admin:   admin@peerreview.demo / demo123456`);
  console.log(`   Student: alex@peerreview.demo  / demo123456`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

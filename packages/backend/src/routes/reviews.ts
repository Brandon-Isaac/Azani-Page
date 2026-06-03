import { Router } from 'express';

export const reviewsRouter = Router();

reviewsRouter.post('/', (req, res) => {
  const { name, email, role, rating, reviewText } = req.body as {
    name?: string;
    email?: string;
    role?: string;
    rating?: string;
    reviewText?: string;
  };

  if (!name || !email || !role || !rating || !reviewText) {
    res.status(400).json({ message: 'All review fields are required' });
    return;
  }

  console.log('Review submission:', { name, email, role, rating });
  res.json({
    success: true,
    message: `Thank you, ${name}! Your review has been submitted. We appreciate your feedback and will review it shortly.`,
  });
});

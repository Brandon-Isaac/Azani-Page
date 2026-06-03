import { Router } from 'express';

export const contactRouter = Router();

contactRouter.post('/', (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message) {
    res.status(400).json({ message: 'name, email, and message are required' });
    return;
  }

  console.log('Contact submission:', { name, email, message: message.slice(0, 80) });
  res.json({ success: true, message: 'Thank you for your message! We will get back to you soon.' });
});

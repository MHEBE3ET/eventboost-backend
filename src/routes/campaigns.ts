// src/routes/campaigns.ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Campaign from '../models/campaign';

const router = express.Router();

// Get all campaigns
router.get('/', async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Error fetching campaigns' });
  }
});

// Create new campaign
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Campaign name is required'),
    body('targetAudience').notEmpty().withMessage('Target audience is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, targetAudience, status } = req.body;
      const campaign = await Campaign.create({
        name,
        targetAudience,
        status: status || 'active',
        userId: 1 // Hardcoded for now
      });

      res.status(201).json(campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Error creating campaign' });
    }
  }
);

export default router;
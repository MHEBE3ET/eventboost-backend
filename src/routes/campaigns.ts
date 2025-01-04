// src/routes/campaigns.ts
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import Campaign from '../models/campaign';

const router = express.Router();

// Get all campaigns for the logged-in user
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll({
      where: { userId: req.user.id },
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
  auth,
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
        userId: req.user.id,
      });

      res.status(201).json(campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Error creating campaign' });
    }
  }
);

// Update campaign
router.put(
  '/:id',
  auth,
  [
    body('name').optional().notEmpty().withMessage('Campaign name cannot be empty'),
    body('status').optional().isIn(['active', 'paused', 'completed']).withMessage('Invalid status'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const campaign = await Campaign.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const { name, status, clicks, conversions } = req.body;
      
      if (name) campaign.name = name;
      if (status) campaign.status = status;
      if (typeof clicks !== 'undefined') campaign.clicks = clicks;
      if (typeof conversions !== 'undefined') campaign.conversions = conversions;

      await campaign.save();
      res.json(campaign);
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).json({ error: 'Error updating campaign' });
    }
  }
);

// Delete campaign
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await campaign.destroy();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Error deleting campaign' });
  }
});

export default router;
import {Request, Response, NextFunction} from 'express'
import Subscription from '../models/subscription.model';
import { workflowClient } from '../config/upstash';

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    await workflowClient.trigger( {
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })
    
    res.status(201).json({ success: true, data: {subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
} 

export const getUserSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account') as any;
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions})
  } catch (error) {
     next(error) 
  }
}
import dayjs from 'dayjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/upstash');

import Subscription from "../models/subscription.model";

const REMINDERS: number[] = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
   const { subscriptionId } = isContext.requestPayload;
   const subscription = await fetchSubscription(context, subscriptionId);  

   if(!subscription || subscription.status !== 'active') return;

   const renewalDate = dayjs(subscription.renewalDate);

   if(renewalDate.isBefore(dayjs())) {
     console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`)
     return;
   }

   for (const daysBefore of REMINDERS) {
      const reminderDate = renewalDate.subtract(daysBefore, 'day');

      if(reminderDate.isAfter(dayjs())) {
         await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate)
      }

      if(dayjs().isSame(reminderDate, 'day')) {
         await triggerReminder(context, `Reminder ${daysBefore} days before reminder`, subscription);
      }

   }
});

const fetchSubscription = async (context, subscriprionId) => {
   return await context.run('get subscription', async () => {
      return Subscription.findById(subscriprionId).populate('user', 'name email');
   })
}

const sleepUntilReminder = async (context, label, date) => {
   console.log(`Sleeping until ${label} reminder at ${date}`);   
   await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label) => {
   return await context.run(label,  async () => {
      console.log(`Triggering ${label} reminder`);

      await sendReminderEmail({
        to: subscription.user.email,
        type: label,
        subscription,
     })
   })
}
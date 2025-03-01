import { createRequire } from 'module';
import dayjs from 'dayjs';
import Subscription from '../Models/Subscription.model.js';
import { sendreminderEmail } from '../Utils/Send-email.js';
const require = createRequire(import.meta.url);
const REMINDERS = [7, 5, 2, 1]; // reminder dates
const { serve } = require('@upstash/workflow/express');

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);
    if (!subscription || subscription.status !== 'active') {
        return;
    }
    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Subscription ${subscriptionId} has expired`);
        return;
    }
    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `reminder-${daysBefore} days before`, reminderDate);
        }
        if(dayjs().isSame(reminderDate,'day')){
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription); // Pass the subscription object

        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', "name email");
    });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        await sendreminderEmail({
            to: subscription.user.email, // Access the user email from the subscription object
            type: label,
            subscription: subscription,
        });
    });
};

export default sendReminders;
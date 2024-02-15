import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import { exec } from 'child_process';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
});

async function main() {
    await agent.login({ 
        identifier: process.env.BLUESKY_USERNAME!,
        password: process.env.BLUESKY_PASSWORD!
    });;

    const postContent = "Webhook Test";
    console.log('postContent:', postContent); // Add this line for debugging

    await agent.post({
        text: postContent
    });

    const ntfyMessage = `Just Posted:\n${postContent}`;
    console.log('ntfyMessage:', ntfyMessage); // Add this line for debugging

    exec(`curl -L https://ntfy.cornouiller.xyz/gitpush -d "${ntfyMessage}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`Notification sent: ${stdout}`);
    });
}

main();


// Run this on a cron job
const scheduleExpressionMinute = '* * * * *'; // Run once every minute for testing
const scheduleExpression = '*/30 * * * *'; // Run once every minute in prod

const job = new CronJob(scheduleExpressionMinute, main); // change to scheduleExpressionMinute for testing
job.start();
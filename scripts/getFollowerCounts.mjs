import { Scraper } from "agent-twitter-client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function getFollowerCounts() {
    try {
        // Create a new instance of the Scraper
        const scraper = new Scraper();

        // Read CSV file
        const data = fs.readFileSync('twitter_1.csv', 'utf-8');
        const lines = data.split('\n');

        // Login using environment variables
        await scraper.login(
            process.env.TWITTER_USERNAME,
            process.env.TWITTER_PASSWORD
        );

        // Check if login was successful
        if (await scraper.isLoggedIn()) {
            console.log("Logged in successfully!");

            // Process each line
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                const index = parts[0];
                const handle = parts[1];
                const existingCount = parts[2];

                // Skip if already has follower count
                if (existingCount) {
                    console.log(`Skipping ${handle}: already processed`);
                    continue;
                }

                try {
                    console.log(`Processing ${handle}...`);
                    const profile = await scraper.getProfile(handle);

                    // Update the line with follower count
                    lines[i] = `${index},${handle},${profile.followersCount}`;

                    // Write the entire file after each update
                    fs.writeFileSync('twitter_1.csv', lines.join('\n'));

                    console.log(`Updated ${handle}: ${profile.followersCount} followers`);

                    // Delay between requests
                    await new Promise(resolve => setTimeout(resolve, 300));

                } catch (error) {
                    console.error(`Error processing ${handle}:`, error);
                    lines[i] = `${index},${handle},ERROR`;
                    fs.writeFileSync('twitter_1.csv', lines.join('\n'));
                }
            }
        }
    } catch (error) {
        console.error("Main error:", error);
    }
}

// Run the script
getFollowerCounts()
    .then(() => console.log('Done!'))
    .catch(error => console.error('Fatal error:', error));
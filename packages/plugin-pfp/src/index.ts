import { Action, HandlerCallback, IAgentRuntime, Memory, Plugin, State } from "@ai16z/eliza";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "node:crypto";
import { elizaLogger } from "@ai16z/eliza";

import { exec as execCallback } from "child_process";
import { promisify } from "util";

const exec = promisify(execCallback);

const generatePfpAction: Action = {
    name: "GENERATE_IMAGE",
    similes: ["CHANGE_PROFILE_PICTURE", "UPDATE_PROFILE_PHOTO", "MAKE_CHRISTMAS_PFP"],
    description: "Generates a holiday-themed profile picture",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: Record<string, never>,
        callback: HandlerCallback
    ) => {
        try {
            // Get user's account info from the database
            const userAccount = await runtime.databaseAdapter.getAccountById(message.userId);
            if (!userAccount) {
                throw new Error("Could not find account for the user");
            }

            const username = userAccount.username;
            elizaLogger.info("Generating profile picture for user:", username);

            // Path to your Python script
            const pythonScript = "/Users/dan/poof/DiscordIlluminator/venv3.10/bin/python";
            const scriptArgs = [
                "selenium_service.py", 
                "--username", username,
                // "--chat_id", "67512999-64a0-8001-baa4-55574b1ead36",
            ];
            const scriptCwd = "/Users/dan/poof/DiscordIlluminator/xmasPfpAi/";

            elizaLogger.info("Generating profile picture...");
            
            // Execute the Python script
            elizaLogger.log("Running Python script with args:", scriptArgs);
            const { stdout, stderr } = await exec(`${pythonScript} ${scriptArgs.join(" ")}`, {
                cwd: scriptCwd
            });

            // Path to the generated image
            const originalImagePath = path.join("/Users/dan/poof/DiscordIlluminator/xmasPfpAi/pfps", `pfp-${username.toLowerCase()}.jpg`);
            const generatedImagePath = path.join("/Users/dan/poof/DiscordIlluminator/xmasPfpAi/pfps", `pfp-${username.toLowerCase()}-new.png`);

            if (stderr) {
                elizaLogger.error("Python script stderr:", stderr);
            }

            elizaLogger.log("Python script stdout:", stdout);


            // Check if the file exists
            try {
                await fs.access(generatedImagePath);
                elizaLogger.info("Generated image exists at:", generatedImagePath);

                // Send the image with the file path
                callback({
                    text: "Yo Ho Ho! 🏴‍☠️🎄✨ #pp5k",
                    attachments: [
                        {
                            id: randomUUID(),
                            url: generatedImagePath,  // Pass the file path instead of URL
                            title: "Holiday Profile Picture",
                            source: "profilePictureGeneration",
                            description: "A festive holiday-themed profile picture.",
                            text: "Enjoy your new holiday look!",
                        },
                        {
                            id: randomUUID(),
                            url: originalImagePath,  // Pass the file path instead of URL
                            title: "Original Profile Picture",
                            source: "profilePicture",
                            description: "",
                            text: "",
                        },
                    ],
                });

                return {
                    success: true,
                    message: "Profile picture generated successfully!"
                };
            } catch (error) {
                elizaLogger.error("Error accessing generated image:", error);
                throw new Error("Generated image not found");
            }
        } catch (error) {
            elizaLogger.error("Error in handler:", error);
            throw error;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Can you make me a holiday profile picture?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll generate a festive holiday-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I'd like a Christmas profile picture" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a Christmas-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "I don't like that one, can you try again?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a Christmas-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Those look pretty sweet, can I have one?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a Christmas-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Do you do Chanukah or other holiday themed profile pictures?" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a Christmas-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Yo I want one!" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll create a Christmas-themed profile picture for you!",
                    action: "GENERATE_PROFILE_PICTURE",
                },
            },
        ],
    ],
};

export const pfpUpdatePlugin: Plugin = {
    name: "pfpUpdate",
    description: "Plugin for generating holiday-themed profile pictures",
    actions: [generatePfpAction]
};

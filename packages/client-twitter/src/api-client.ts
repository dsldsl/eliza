import { TwitterApi } from 'twitter-api-v2';
import { elizaLogger } from '@ai16z/eliza';
import { Tweet } from 'agent-twitter-client';

export class TwitterApiClient {
    private client: TwitterApi;

    constructor(bearerToken: string) {
        // Create app-only client with bearer token
        this.client = new TwitterApi(bearerToken);
    }

    async fetchMentions(userId: string, sinceId?: string): Promise<Tweet[]> {
        try {
            const mentions = await this.client.v2.userMentionTimeline(userId, {
                since_id: sinceId,
                max_results: 40,
                expansions: ['author_id', 'in_reply_to_user_id', 'referenced_tweets.id'],
                'tweet.fields': ['created_at', 'conversation_id', 'text', 'entities'],
                'user.fields': ['name', 'username'],
            });

            // Convert Twitter API v2 format to our Tweet format
            const ret = mentions.tweets.map(mention => ({
                id: mention.id,
                name: mentions.includes?.users?.find(u => u.id === mention.author_id)?.name || '',
                username: mentions.includes?.users?.find(u => u.id === mention.author_id)?.username || '',
                text: mention.text,
                inReplyToStatusId: mention.referenced_tweets?.find(t => t.type === 'replied_to')?.id,
                timestamp: new Date(mention.created_at!).getTime() / 1000, // Convert to seconds
                userId: mention.author_id!,
                conversationId: mention.conversation_id!,
                hashtags: mention.entities?.hashtags?.map(h => h.tag) || [],
                mentions: mention.entities?.mentions?.map(m => ({
                    id: m.id,
                    username: m.username,
                    name: m.username // We don't have the name in entities
                })) || [],
                thread: [], // This will be populated later by the conversation thread builder
                permanentUrl: `https://twitter.com/${mentions.includes?.users?.find(u => u.id === mention.author_id)?.username}/status/${mention.id}`,
                photos:[],
                urls:[],
                videos:[],
            }));
            elizaLogger.info("found Twitter mentions:", JSON.stringify(ret, null, 2))
            return ret;
        } catch (error) {
            elizaLogger.error('Error fetching mentions:', error);
            return [];
        }
    }

    // Add more methods as needed, such as fetching conversation threads, etc.
}

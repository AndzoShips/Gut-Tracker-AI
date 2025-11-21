import { Whop } from "@whop/sdk";

const whopWebhookSecret = process.env.WHOP_WEBHOOK_SECRET || "";

export const whopsdk = new Whop({
	appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
	apiKey: process.env.WHOP_API_KEY,
	webhookKey: whopWebhookSecret
		? Buffer.from(whopWebhookSecret).toString("base64")
		: undefined,
});

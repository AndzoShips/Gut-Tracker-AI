import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;
	
	try {
		// Ensure the user is logged in on whop.
		const { userId } = await whopsdk.verifyUserToken(await headers());
		
		// Redirect to dashboard - this is the main entry point for your app
		redirect("/dashboard");
	} catch (error) {
		// If authentication fails, redirect to onboarding/login
		redirect("/onboarding");
	}
}

function JsonViewer({ data }: { data: any }) {
	return (
		<pre className="text-2 border border-gray-a4 rounded-lg p-4 bg-gray-a2 max-h-72 overflow-y-auto">
			<code className="text-gray-10">{JSON.stringify(data, null, 2)}</code>
		</pre>
	);
}

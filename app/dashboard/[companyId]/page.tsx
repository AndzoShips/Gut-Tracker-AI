import { redirect } from "next/navigation";

export default async function CompanyDashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// Redirect to main dashboard - this route is not used in your app
	redirect("/dashboard");
}

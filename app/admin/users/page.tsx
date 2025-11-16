import { Button } from "@whop/react/components";
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import Link from "next/link";

export default async function AdminUsersPage() {
  // Verify user is authenticated through Whop
  let userId: string;
  try {
    const authResult = await whopsdk.verifyUserToken(await headers());
    userId = authResult.userId;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-a1">
        <div className="text-center">
          <h1 className="text-6 font-bold text-gray-12 mb-4">Authentication Required</h1>
          <p className="text-3 text-gray-10 mb-6">Please log in through Whop to view this page.</p>
          <Link href="/">
            <Button variant="classic" size="4">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get current user info
  const currentUser = await whopsdk.users.retrieve(userId);

  return (
    <div className="min-h-screen bg-gray-a1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-8 font-bold text-gray-12 mb-2">User Management</h1>
          <p className="text-3 text-gray-10">
            View users through your Whop dashboard. All users who access your app through Whop will appear there.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-gray-a4">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-6 font-bold text-gray-12 mb-2">Whop User Management</h2>
            <p className="text-3 text-gray-10 mb-6">
              All users are managed through Whop's dashboard. Visit your Whop app dashboard to view and manage users.
            </p>
            
            <div className="space-y-4">
              <p className="text-3 text-gray-10">
                <strong>Current User:</strong> {currentUser.name || `@${currentUser.username}` || userId}
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link href="https://whop.com/apps" target="_blank">
                  <Button variant="classic" size="4" className="bg-secondary">
                    Open Whop Dashboard
                  </Button>
                </Link>
                <Link href="/analyze">
                  <Button variant="ghost" size="4">
                    Go to Meal Analysis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


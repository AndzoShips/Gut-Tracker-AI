import { Button } from "@whop/react/components";
import Link from "next/link";

/**
 * Login page - Whop handles authentication automatically
 * Users will be redirected here if not authenticated
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-a1 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-gray-a4 shadow-lg text-center">
        <div className="mb-8">
          <h1 className="text-8 font-bold text-gray-12 mb-2">
            Welcome to Gutly
          </h1>
          <p className="text-3 text-gray-10">
            Please log in through Whop to access meal analysis
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-3 text-gray-10">
            Authentication is handled automatically by Whop. If you're not logged in,
            you'll be redirected to Whop's login page.
          </p>
          
              <Link href="/dashboard">
                <Button
                  variant="classic"
                  size="4"
                  className="w-full bg-secondary hover:bg-green-600"
                >
                  Go to Dashboard
                </Button>
              </Link>
        </div>
      </div>
    </div>
  );
}


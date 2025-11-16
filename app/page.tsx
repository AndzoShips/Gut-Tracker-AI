"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding is completed
    const completed = localStorage.getItem("onboarding_completed");
    if (completed === "true") {
      // Redirect to dashboard if onboarding is done
      router.push("/dashboard");
    } else {
      // Redirect to onboarding if not completed
      router.push("/onboarding");
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </main>
  );
}

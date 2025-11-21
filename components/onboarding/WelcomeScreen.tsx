"use client";

import { Button } from "@whop/frosted-ui";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      {/* Progress Indicator */}
      <div className="flex gap-2 mb-12">
        <div className="w-8 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
        <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
        <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
        <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
        <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
      </div>

      {/* Content */}
      <div className="space-y-6 mb-12">
        <h1 className="text-6xl font-bold leading-tight text-gray-900 dark:text-gray-100">
          Welcome
        </h1>
        <h2 className="text-4xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Your Gut is Your Second Brain.
        </h2>
        <p className="text-base leading-relaxed max-w-sm mx-auto text-gray-600 dark:text-gray-400">
          What you eat shapes how you think, feel, and perform. Let's discover how your meals affect your mood, focus, and overall well-being.
        </p>
      </div>

      {/* Button */}
      <Button
        onClick={onNext}
        variant="solid"
        size="4"
        className="w-full max-w-xs"
      >
        Let's Begin
      </Button>
    </div>
  );
}

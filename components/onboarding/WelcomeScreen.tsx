"use client";

interface WelcomeScreenProps {
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      {/* Progress Indicator */}
      <div className="flex gap-2 mb-12">
        <div className="w-8 h-2 rounded-full bg-secondary"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>

      {/* Content */}
      <div className="space-y-6 mb-12">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Welcome
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 leading-tight">
          Your Gut is Your Second Brain.
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
          What you eat shapes how you think, feel, and perform. Let's discover how your meals affect your mood, focus, and overall well-being.
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onNext}
        className="w-full max-w-xs bg-secondary hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        Let's Begin
      </button>
    </div>
  );
}


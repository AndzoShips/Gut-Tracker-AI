"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WelcomeScreen from "@/components/onboarding/WelcomeScreen";
import GoalScreen from "@/components/onboarding/GoalScreen";
import FeelingScreen from "@/components/onboarding/FeelingScreen";
import CommitmentScreen from "@/components/onboarding/CommitmentScreen";
import SummaryScreen from "@/components/onboarding/SummaryScreen";

export type OnboardingData = {
  userGoal?: string;
  userFeeling?: string;
  commitmentLevel?: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  // Check if user has already completed onboarding
  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (completed === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("onboarding_data");
    if (saved) {
      try {
        setOnboardingData(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading onboarding data:", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(onboardingData).length > 0) {
      localStorage.setItem("onboarding_data", JSON.stringify(onboardingData));
    }
  }, [onboardingData]);

  const handleNext = (data?: Partial<OnboardingData>) => {
    if (data) {
      setOnboardingData((prev) => ({ ...prev, ...data }));
    }
    
    if (currentScreen < 5) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentScreen === 1 && (
          <WelcomeScreen onNext={() => handleNext()} />
        )}
        {currentScreen === 2 && (
          <GoalScreen
            selectedGoal={onboardingData.userGoal}
            onNext={(goal) => handleNext({ userGoal: goal })}
            onBack={handleBack}
          />
        )}
        {currentScreen === 3 && (
          <FeelingScreen
            selectedFeeling={onboardingData.userFeeling}
            onNext={(feeling) => handleNext({ userFeeling: feeling })}
            onBack={handleBack}
          />
        )}
        {currentScreen === 4 && (
          <CommitmentScreen
            selectedCommitment={onboardingData.commitmentLevel}
            onNext={(commitment) => handleNext({ commitmentLevel: commitment })}
            onBack={handleBack}
          />
        )}
        {currentScreen === 5 && (
          <SummaryScreen
            data={onboardingData}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}


"use client";

import { IconButton } from "@whop/frosted-ui";

interface HomeHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function HomeHeader({ selectedDate, onDateChange }: HomeHeaderProps) {

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={handlePreviousDay}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous day"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex flex-col items-center flex-1 px-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {selectedDate.toDateString() === new Date().toDateString() ? "Today" : formatDate(selectedDate)}
        </h2>
        {selectedDate.toDateString() === new Date().toDateString() && (
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{formatDate(selectedDate)}</p>
        )}
      </div>

      <button
        onClick={handleNextDay}
        disabled={isToday}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next day"
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}


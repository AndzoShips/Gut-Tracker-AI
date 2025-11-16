"use client";

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
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Previous day"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedDate.toDateString() === new Date().toDateString() ? "Today" : formatDate(selectedDate)}
        </h1>
        {selectedDate.toDateString() === new Date().toDateString() && (
          <p className="text-sm text-gray-500 mt-1">{formatDate(selectedDate)}</p>
        )}
      </div>

      <button
        onClick={handleNextDay}
        disabled={isToday}
        className={`p-2 rounded-full transition-colors ${
          isToday
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
        aria-label="Next day"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}


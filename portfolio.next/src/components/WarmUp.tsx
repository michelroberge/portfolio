"use client";
import { useEffect } from "react";

export default function WarmUp({ onComplete }: { onComplete: () => void }) {

  useEffect(() => {
    const checkWarmupStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/warmup-status`);
        const data = await response.json();

        if (data.warmupComplete) {
          onComplete(); // Notify parent to show the main app
        } else {
          setTimeout(checkWarmupStatus, 2000); // Retry in 2 seconds
        }
      } catch (error) {
        console.error("Failed to check warm-up status:", error);
        setTimeout(checkWarmupStatus, 5000); // Retry slower if error
      }
    };

    checkWarmupStatus();
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Warming Up...</h1>
        <p className="text-gray-400">Fetching AI context and preparing chat...</p>
        <div className="mt-6 flex items-center justify-center">
        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 text-center"></div>        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ADMIN_API } from "@/lib/constants";
import { AIConfig } from "@/models/AIConfig";

interface WarmUpProps {
  onComplete?: () => void;
}

export default function WarmUp({ onComplete }: WarmUpProps) {
  const [isWarmedUp, setIsWarmedUp] = useState(false);

  useEffect(() => {
    async function checkWarmupStatus() {
      try {
        const response = await fetch(ADMIN_API.ai.config, {
          credentials: "include",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to check warmup status");
        }

        const data: AIConfig = await response.json();
        setIsWarmedUp(data.isWarmedUp);

        if (data.isWarmedUp && onComplete) {
          onComplete();
        }
      } catch (err) {
        console.error("Failed to check warmup status:", err);
        setTimeout(checkWarmupStatus, 5000); // Retry in 5 seconds if error
      }
    }

    const interval = setInterval(checkWarmupStatus, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, [onComplete]);

  if (isWarmedUp) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 p-4 rounded-lg shadow-lg">
      <p className="text-yellow-800">
        Warming up AI models... This might take a few seconds.
      </p>
    </div>
  );
}

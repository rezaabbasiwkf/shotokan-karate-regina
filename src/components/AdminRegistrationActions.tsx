"use client";

import { useState } from "react";

export function AdminRegistrationActions({ id, paymentStatus }: { id: string; paymentStatus?: string }) {
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState("");

  const runAction = async (action: "confirm" | "resend") => {
    setIsWorking(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: id, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed.");
      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="flex min-w-52 flex-col gap-2">
      {paymentStatus === "payment-confirmation-pending" ? (
        <button type="button" onClick={() => runAction("confirm")} disabled={isWorking} className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">
          {isWorking ? "Updating..." : "Verify payment & email"}
        </button>
      ) : null}
      {paymentStatus === "completed" ? (
        <button type="button" onClick={() => runAction("resend")} disabled={isWorking} className="rounded-md border border-white/20 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">
          {isWorking ? "Sending..." : "Resend confirmation"}
        </button>
      ) : null}
      {message ? <p className="text-xs text-stone-300">{message}</p> : null}
    </div>
  );
}

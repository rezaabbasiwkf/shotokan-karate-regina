"use client";
import { useState } from "react";
import { portalFetch } from "@/lib/client/portal-fetch";
import { safelyReadJson } from "@/lib/client/safe-json";
export function AdminRegistrationActions({ id, paymentStatus, recordType = "enrollment" }: { id: string; paymentStatus?: string; recordType?: "enrollment" | "direct-registration" }) {
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  async function run(action: "confirm" | "resend") { setBusy(true); setMessage(""); try { const response = await portalFetch("/api/admin/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ registrationId: id, recordType, action }) }); const data = await safelyReadJson<{ message?: string }>(response); setMessage(data.message || "Update failed."); if (response.ok && action === "confirm") setTimeout(() => window.location.reload(), 700); } catch (error) { setMessage(error instanceof Error ? error.message : "Update failed."); } finally { setBusy(false); } }
  return <div className="flex min-w-52 flex-col gap-2">{paymentStatus === "Pending Verification" && <button onClick={() => run("confirm")} disabled={busy} className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{busy ? "Updating…" : "Verify Payment & Activate"}</button>}{paymentStatus === "Confirmed" && <button onClick={() => run("resend")} disabled={busy} className="rounded-md border border-white/20 px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{busy ? "Sending…" : "Resend Confirmation"}</button>}{message && <p className="text-xs text-stone-300">{message}</p>}</div>;
}

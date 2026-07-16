import Link from "next/link";
import { KnowledgeContentManager } from "@/components/KnowledgeContentManager";
import { requireAccount } from "@/lib/portal/auth";
import { readPortalDatabase } from "@/lib/portal/store";

export const dynamic = "force-dynamic";

export default async function AdminKnowledgeCenterPage() {
  await requireAccount({ verified: true, admin: true });
  const database = await readPortalDatabase();
  return <main className="min-h-screen bg-stone-950 px-4 py-16 text-white sm:px-6"><div className="mx-auto max-w-7xl"><header className="mb-8 rounded-3xl border border-white/10 bg-black/60 p-7"><p className="text-xs font-black uppercase tracking-[0.26em] text-red-300">Role-protected administration</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">Knowledge Center Content Manager</h1><p className="mt-3 max-w-3xl text-stone-300">Upload PDFs and images, create educational articles, preview drafts, publish reviewed content, reorder resources, and archive outdated editions.</p><div className="mt-5 flex flex-wrap gap-4 text-sm"><Link className="text-red-300" href="/admin">← Registration administration</Link><Link className="text-red-300" href="/karate-knowledge-center">View Knowledge Center ↗</Link></div></header><KnowledgeContentManager resources={database.knowledge_resources} articles={database.knowledge_articles} /></div></main>;
}

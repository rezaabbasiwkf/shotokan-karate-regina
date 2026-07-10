import { getRegistrations } from "@/lib/registration-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const registrations = await getRegistrations();

  return (
    <main className="min-h-screen bg-stone-950 px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl shadow-black/40">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Admin dashboard</p>
          <h1 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">Student registrations</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
            Review every submission received through the digital registration form.
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/50 p-8 text-sm text-stone-300">
            No registrations have been received yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/50">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/5 text-stone-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-stone-200">
                {registrations.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(entry.createdAt as string).toLocaleString()}</td>
                    <td className="px-4 py-3">{String(entry.fullName || "—")}</td>
                    <td className="px-4 py-3">{String(entry.emailAddress || "—")}</td>
                    <td className="px-4 py-3">{String(entry.phoneNumber || "—")}</td>
                    <td className="px-4 py-3">Received</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

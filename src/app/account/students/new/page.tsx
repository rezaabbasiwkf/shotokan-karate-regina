import { StudentForm } from "@/components/account/StudentForm";import { requireAccount } from "@/lib/portal/auth";
export default async function Page(){const account=await requireAccount({verified:true});return <div className="section-shell"><div className="mx-auto max-w-4xl"><StudentForm account={account}/></div></div>}

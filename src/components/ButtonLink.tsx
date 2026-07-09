type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: ButtonLinkProps) {
  const classes =
    variant === "primary"
      ? "bg-red-600 text-white shadow-lg shadow-red-950/40 hover:bg-red-500"
      : "border border-white/20 bg-white/8 text-white hover:border-red-300/60 hover:bg-white/12";

  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-bold uppercase tracking-[0.16em] transition ${classes}`}
      href={href}
    >
      {children}
    </a>
  );
}

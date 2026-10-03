type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  children,
}: SectionHeadingProps) {
  return (
    <div className="section-heading mx-auto mb-10 max-w-3xl text-center">
      <p className="section-heading__eyebrow mb-3 text-xs font-bold uppercase tracking-[0.28em] text-red-300">
        {eyebrow}
      </p>
      <h2 className="section-heading__title text-balance text-3xl font-black uppercase text-white sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="section-heading__description mt-4 text-base leading-7 text-stone-300 sm:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}

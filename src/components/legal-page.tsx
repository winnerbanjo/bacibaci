type LegalSection = {
  title: string;
  paragraphs: string[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="section-space">
      <div className="shell max-w-4xl px-6 md:px-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title mt-3 text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-600">{intro}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4 border-t border-[var(--color-line)] pt-6">
              <h2 className="display-title text-2xl sm:text-3xl">{section.title}</h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="max-w-3xl text-[15px] leading-relaxed text-neutral-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const columns = ["UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20", "UK 22"];

const rows = [
  { label: "Bust", values: ["34", "36", "38", "41", "43", "46", "49", "52"] },
  { label: "Waist", values: ["26", "28", "30", "33", "36", "39", "42", "45"] },
  { label: "Hips", values: ["38", "40", "44", "45", "48", "51", "54", "57"] },
];

export function SizeGuide({
  title = "Baci Baci size guide",
  description = "Use the chart below to match your closest UK size before placing an essentials order.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="panel overflow-hidden p-6 sm:p-8">
      <div className="max-w-xl">
        <p className="eyebrow">size guide</p>
        <h2 className="display-title mt-3 text-3xl sm:text-4xl">{title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{description}</p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-xs uppercase tracking-[0.2em] text-black/55">
              <th className="min-w-28 py-4 pr-6 font-medium">Fit</th>
              {columns.map((column) => (
                <th key={column} className="min-w-24 py-4 pr-6 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[var(--color-line)] last:border-b-0">
                <th className="py-4 pr-6 text-base font-medium uppercase tracking-[0.14em]">
                  {row.label}
                </th>
                {row.values.map((value) => (
                  <td key={`${row.label}-${value}`} className="py-4 pr-6 text-base text-neutral-600">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

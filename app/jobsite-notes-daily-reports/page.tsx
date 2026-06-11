const price = "$49/month";

const sampleReports = [
  {
    project: "Maple Street Kitchen Remodel",
    status: "Needs supervisor review",
    buyer: "Small residential contractor",
    notes:
      "Demo finished. Electrician roughed in island outlets. Cabinet delivery delayed again. Client asked whether flooring can start Friday. Need plumber back for sink line.",
    weather: "Light rain, 58F, muddy driveway access after lunch",
    crew: "4 crew: lead carpenter, apprentice, electrician, demo helper",
    progress: ["Kitchen demo complete", "Island outlet rough-in started", "Subfloor patch documented"],
    blockers: ["Cabinet delivery delay", "Plumber return needed before sink install"],
    materials: ["Cabinets pending", "Sink line materials to confirm"],
    nextSteps: ["Confirm cabinet delivery date", "Schedule plumber", "Answer flooring timing question"],
  },
  {
    project: "Oak Ridge Landscaping Install",
    status: "Blocked",
    buyer: "Landscaping crew owner",
    notes:
      "Crew graded east side and installed 18 yards mulch. Irrigation zone 3 not holding pressure. Need 12 more edging stakes and one pallet sod.",
    weather: "Sunny, 77F, high wind after 2pm",
    crew: "5 crew: foreman, 3 installers, irrigation tech",
    progress: ["East side graded", "18 yards mulch installed", "Shrub move approved"],
    blockers: ["Irrigation zone 3 pressure issue", "Missing edging stakes and sod"],
    materials: ["12 edging stakes", "1 pallet sod", "Irrigation parts after pressure test"],
    nextSteps: ["Pressure-test zone 3", "Order missing materials", "Confirm access before truck arrival"],
  },
  {
    project: "Northside Retail Maintenance",
    status: "Client-ready",
    buyer: "Field service maintenance team",
    notes:
      "Replaced two ceiling tiles, checked restroom leak, no active drip. HVAC filter changed. Manager says back door sticks in humidity. Need quote for hinge replacement.",
    weather: "Humid, 83F, no rain during visit",
    crew: "2 techs on site for 3.5 hours",
    progress: ["Ceiling tiles replaced", "Restroom leak checked", "HVAC filter changed"],
    blockers: ["Back door hinge quote requested"],
    materials: ["Replacement hinges for quote", "No leak materials required"],
    nextSteps: ["Send hinge replacement quote", "Attach leak-area photos", "Close maintenance checklist"],
  },
];

const featured = sampleReports[0];

function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <p className="mt-2 text-sm leading-6 text-slate-100">{value}</p>
    </div>
  );
}

function OutputBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ReportCard({ report }: { report: (typeof sampleReports)[number] }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-950">{report.project}</h3>
          <p className="mt-1 text-sm text-slate-500">{report.buyer}</p>
        </div>
        <span
          className={[
            "rounded-full px-3 py-1 text-xs font-black",
            report.status === "Blocked"
              ? "bg-rose-100 text-rose-800"
              : report.status === "Needs supervisor review"
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800",
          ].join(" ")}
        >
          {report.status}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{report.notes}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <OutputBlock title="Progress" items={report.progress} />
        <OutputBlock title="Next actions" items={report.nextSteps} />
      </div>
    </article>
  );
}

export default function JobsiteNotesDailyReportsPage() {
  return (
    <main className="min-h-screen bg-[#eef2ec] text-slate-950">
      <section className="border-b border-white/10 bg-[#172019] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
          <div>
            <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-100">
              Bilion showcase product
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Jobsite Notes to Daily Reports AI Workflow
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Turn messy site notes, weather updates, crew counts, and blocker notes into client-ready daily reports,
              materials lists, and next-step summaries for contractors.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <FieldCard
                label="Buyer"
                value="Small contractors and field service teams who already collect messy updates."
              />
              <FieldCard
                label="Pain"
                value="Daily updates live in chats, notebooks, and memory, making reporting slow and inconsistent."
              />
              <FieldCard label="Offer" value={price} />
            </div>
          </div>

          <aside className="rounded-lg border border-emerald-300/20 bg-[#243326] p-5 shadow-2xl shadow-black/20">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-emerald-100">Source signal</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Construction teams are using AI to turn scattered field notes, photos, and chat updates into standard
              reports for clients and managers.
            </p>
            <div className="mt-5 rounded-lg bg-emerald-200 p-4 text-slate-950">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-900">Commercial angle</div>
              <p className="mt-2 text-sm font-semibold leading-6">
                A workflow layer between raw jobsite inputs and clean operational outputs people can act on.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Paste/import workflow</h2>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Messy jobsite notes</div>
              <p className="mt-3 text-sm leading-6 text-slate-800">{featured.notes}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Weather</div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{featured.weather}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Crew count</div>
                <p className="mt-2 text-sm font-semibold text-slate-900">{featured.crew}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white">
                Generate report
              </button>
              <button className="rounded-lg border border-slate-950 bg-white px-4 py-3 text-sm font-black text-slate-950">
                Save record
              </button>
              <button className="rounded-lg border border-emerald-700 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">
                Copy/export
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">48h validation asset</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>1. Find 10 contractors who already write daily reports manually.</li>
              <li>2. Ask for one anonymized jobsite update and run it through this prototype.</li>
              <li>3. Measure whether the generated output is strong enough to justify {price}.</li>
            </ol>
            <div className="mt-4 rounded-lg bg-slate-950 p-4 text-white">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-200">Outreach copy</div>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                I built a prototype that turns messy jobsite notes into a client-ready daily report. Send one anonymized
                update and I will show you the finished report. If it saves reporting time, the workflow is {price}.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Structured output preview
                </h2>
                <p className="mt-2 text-xl font-black text-slate-950">{featured.project}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                {featured.status}
              </span>
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-2">
              <OutputBlock title="Progress" items={featured.progress} />
              <OutputBlock title="Blockers" items={featured.blockers} />
              <OutputBlock title="Materials" items={featured.materials} />
              <OutputBlock title="Next steps" items={featured.nextSteps} />
            </div>
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-black uppercase tracking-[0.14em] text-emerald-800">
                Client-ready report
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-900">
                {featured.project}: Kitchen demo is complete, electrical rough-in has started, and subfloor patching is
                documented. Current status needs supervisor review because cabinet delivery and plumber scheduling may
                affect the next milestone.
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Saved examples</h2>
            <div className="mt-4 grid gap-3">
              {sampleReports.map((report) => (
                <ReportCard key={report.project} report={report} />
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

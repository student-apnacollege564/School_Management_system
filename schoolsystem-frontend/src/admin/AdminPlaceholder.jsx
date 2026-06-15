export function AdminPlaceholder({ title, bullets }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-slate-600">This module page is ready; next step is wiring full backend logic.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <h3 className="text-lg font-bold text-slate-900">Planned features</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {(bullets ?? []).map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}


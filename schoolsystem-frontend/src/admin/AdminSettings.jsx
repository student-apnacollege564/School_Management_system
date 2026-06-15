import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'adminSettings'

function Card({ title, children, description }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-slate-600">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  )
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-4">
      <div>
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5" />
    </label>
  )
}

const defaultSettings = {
  schoolProfile: {
    name: 'School Management System',
    logoUrl: '',
    phone: '+91 98765 43210',
    email: 'support@schoolsystem.com',
    address: 'Delhi',
  },
  academic: {
    classes: ['8th', '9th', '10th', '11th', '12th'],
    sections: ['A', 'B', 'C'],
    subjects: ['Mathematics', 'Science', 'English', 'Computer', 'History'],
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
  },
  security: {
    otpRequired: true,
    sessionTimeoutMinutes: 30,
  },
}

export function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings)
  const [status, setStatus] = useState('')
  const [activeTab, setActiveTab] = useState('school')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object') {
        setSettings((old) => ({
          ...old,
          ...parsed,
        }))
      }
    } catch {
      // ignore corrupt localStorage
    }
  }, [])

  const tabs = useMemo(
    () => [
      { id: 'school', label: 'School Profile' },
      { id: 'academic', label: 'Academic' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'security', label: 'Security' },
    ],
    [],
  )

  const save = () => {
    setStatus('')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setStatus('Settings saved.')
  }

  const reset = () => {
    if (!confirm('Reset settings to default?')) return
    setSettings(defaultSettings)
    localStorage.removeItem(STORAGE_KEY)
    setStatus('Reset complete.')
  }

  return (
    <div className="space-y-6">
      <Card
        title="Settings"
        description="Manage school profile, academic setup (classes/sections/subjects), notifications, and security options."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeTab === t.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300">
              Reset
            </button>
            <button onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
        {status && <p className="mt-3 text-sm font-semibold text-emerald-700">{status}</p>}
      </Card>

      {activeTab === 'school' && (
        <Card title="School Profile Settings">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="School/College Name"
              value={settings.schoolProfile.name}
              onChange={(v) => setSettings((s) => ({ ...s, schoolProfile: { ...s.schoolProfile, name: v } }))}
              placeholder="Enter school name"
            />
            <TextField
              label="Logo URL"
              value={settings.schoolProfile.logoUrl}
              onChange={(v) => setSettings((s) => ({ ...s, schoolProfile: { ...s.schoolProfile, logoUrl: v } }))}
              placeholder="https://..."
            />
            <TextField
              label="Phone"
              value={settings.schoolProfile.phone}
              onChange={(v) => setSettings((s) => ({ ...s, schoolProfile: { ...s.schoolProfile, phone: v } }))}
              placeholder="+91 ..."
            />
            <TextField
              label="Email"
              type="email"
              value={settings.schoolProfile.email}
              onChange={(v) => setSettings((s) => ({ ...s, schoolProfile: { ...s.schoolProfile, email: v } }))}
              placeholder="support@..."
            />
            <div className="md:col-span-2">
              <label className="block">
                <div className="text-sm font-semibold text-slate-700">Address</div>
                <textarea
                  value={settings.schoolProfile.address}
                  onChange={(e) => setSettings((s) => ({ ...s, schoolProfile: { ...s.schoolProfile, address: e.target.value } }))}
                  placeholder="School address"
                  className="mt-1 h-24 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'academic' && (
        <Card title="Academic Settings" description="Maintain master lists used across classes/subjects/sections.">
          <div className="grid gap-6 lg:grid-cols-3">
            <ListEditor
              title="Classes"
              items={settings.academic.classes}
              onChange={(items) => setSettings((s) => ({ ...s, academic: { ...s.academic, classes: items } }))}
              placeholder="e.g., 10th"
            />
            <ListEditor
              title="Sections"
              items={settings.academic.sections}
              onChange={(items) => setSettings((s) => ({ ...s, academic: { ...s.academic, sections: items } }))}
              placeholder="e.g., A"
            />
            <ListEditor
              title="Subjects"
              items={settings.academic.subjects}
              onChange={(items) => setSettings((s) => ({ ...s, academic: { ...s.academic, subjects: items } }))}
              placeholder="e.g., Physics"
            />
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card title="Notification Settings">
          <div className="grid gap-3 md:grid-cols-2">
            <Toggle
              label="Email notifications"
              checked={settings.notifications.emailEnabled}
              onChange={(v) => setSettings((s) => ({ ...s, notifications: { ...s.notifications, emailEnabled: v } }))}
              hint="Send login/notice alerts by email."
            />
            <Toggle
              label="SMS notifications"
              checked={settings.notifications.smsEnabled}
              onChange={(v) => setSettings((s) => ({ ...s, notifications: { ...s.notifications, smsEnabled: v } }))}
              hint="Send alerts by SMS (requires SMS gateway setup)."
            />
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title="System Configuration & Security Settings">
          <div className="grid gap-4 md:grid-cols-2">
            <Toggle
              label="Require OTP at login"
              checked={settings.security.otpRequired}
              onChange={(v) => setSettings((s) => ({ ...s, security: { ...s.security, otpRequired: v } }))}
              hint="If disabled, users will skip the OTP screen."
            />
            <TextField
              label="Session timeout (minutes)"
              type="number"
              value={String(settings.security.sessionTimeoutMinutes)}
              onChange={(v) =>
                setSettings((s) => ({
                  ...s,
                  security: { ...s.security, sessionTimeoutMinutes: Math.max(1, Number(v || 1)) },
                }))
              }
              placeholder="30"
            />
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Note: OTP and session timeout are stored in browser settings for now. If you want these enforced server-side,
            I can wire them into the backend.
          </div>
        </Card>
      )}
    </div>
  )
}

function ListEditor({ title, items, onChange, placeholder }) {
  const [value, setValue] = useState('')

  const add = (e) => {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    if (items.some((x) => x.toLowerCase() === v.toLowerCase())) return
    onChange([...items, v])
    setValue('')
  }

  const remove = (item) => onChange(items.filter((x) => x !== item))

  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="text-sm font-bold text-slate-900">{title}</div>
      <form onSubmit={add} className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700">
          Add
        </button>
      </form>
      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500">No items.</div>
        ) : (
          items.map((item) => (
            <div key={item} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span className="font-medium text-slate-800">{item}</span>
              <button onClick={() => remove(item)} className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


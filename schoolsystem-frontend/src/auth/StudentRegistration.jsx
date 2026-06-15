import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const emptyForm = {
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  grade: '',
  section: '',
  age: '',
  contact: '',
  address: '',
}

export function StudentRegistration() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    fetch('http://localhost:8080/api/auth/register/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username.trim(),
        password: form.password,
        name: form.name.trim(),
        grade: form.grade.trim(),
        section: form.section.trim(),
        contact: form.contact.trim(),
        address: form.address.trim(),
        age: Number(form.age) || 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message ?? 'Registration failed')
          return
        }
        setSuccess(data.message ?? 'Registration successful')
        setTimeout(() => navigate('/login/student'), 2000)
      })
      .catch(() => setError('Cannot connect to server. Please start backend.'))
      .finally(() => setLoading(false))
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2">
      <img
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
        alt="Student registration"
        className="h-72 w-full rounded-lg object-cover"
      />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-3xl font-semibold text-slate-800">New Student Registration</h2>
        <p className="mt-2 text-slate-600">Create your student account to access the portal.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
              value={form.confirmPassword}
              onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Class / Grade (e.g., 10th)"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
              value={form.grade}
              onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Section (e.g., A)"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
              value={form.section}
              onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="number"
              placeholder="Age"
              min={0}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Contact number"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
            />
          </div>
          <textarea
            placeholder="Address"
            className="h-20 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login/student" className="font-medium text-blue-700 hover:underline">
            Back to student login
          </Link>
        </p>
      </div>
    </section>
  )
}

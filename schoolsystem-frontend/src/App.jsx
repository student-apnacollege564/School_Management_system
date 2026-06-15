import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { StudentRegistration } from './auth/StudentRegistration.jsx'
import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from './admin/AdminLayout.jsx'
import { AdminOverview } from './admin/AdminOverview.jsx'
import { AdminStudents } from './admin/AdminStudents.jsx'
import { AdminTeachers } from './admin/AdminTeachers.jsx'
import { AdminParents } from './admin/AdminParents.jsx'
import { AdminPlaceholder } from './admin/AdminPlaceholder.jsx'
import { AdminTimetable } from './admin/AdminTimetable.jsx'
import {
  AdminAttendancePage,
  AdminNoticesPage,
  AdminReportsPage,
  AdminSupportPage,
  AdminUsersPage,
} from './admin/AdminOperations.jsx'
import { AdminSettings } from './admin/AdminSettings.jsx'
import { StudentLayout } from './student/StudentLayout.jsx'
import {
  StudentAssignmentsPage,
  StudentAttendancePage,
  StudentDownloadResultPage,
  StudentNoticesPage,
  StudentProfilePage,
  StudentResultsPage,
  StudentTimetablePage,
  StudentUpdateProfilePage,
} from './student/StudentPages.jsx'
import { TeacherLayout } from './teacher/TeacherLayout.jsx'
import {
  TeacherAssignedClassesPage,
  TeacherAssignmentsPage,
  TeacherAttendancePage,
  TeacherAttendancePercentPage,
  TeacherExamPercentPage,
  TeacherMarksPage,
  TeacherNoticesPage,
  TeacherStudentListPage,
  TeacherTimetablePage,
} from './teacher/TeacherPages.jsx'
import { ParentLayout } from './parent/ParentLayout.jsx'
import {
  ParentChildAttendancePage,
  ParentChildProfilePage,
  ParentChildResultsPage,
  ParentNoticesPage,
  ParentTimetablePage,
} from './parent/ParentPages.jsx'

const sliderImages = [
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80',
]

const pageImages = {
  home:
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
  about:
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1000&q=80',
  contact:
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
  auth:
    'https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1000&q=80',
  security:
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1000&q=80',
  student:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  teacher:
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
  admin:
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
  parent:
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
  loginBuilding:
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
  loginCampus:
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
  contactCampus:
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
  contactOffice:
    'https://images.unsplash.com/photo-1498243691581-b145c3f44a8a?auto=format&fit=crop&w=1000&q=80',
}

const roles = ['student', 'teacher', 'admin', 'parent']
const courses = [
  'Mathematics Fundamentals',
  'Science Lab Program',
  'English Communication',
  'Computer Applications',
  'History and Civics',
  'Biology Advanced',
  'Physics Core',
  'Chemistry Basics',
]

function BannerSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent((old) => (old + 1) % sliderImages.length)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg">
      {sliderImages.map((img, index) => (
        <img
          key={img}
          src={img}
          alt="School banner"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/35">
        <div className="flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">School Management System</h1>
          <p className="mt-3 max-w-xl text-sm md:text-base">
            Smart platform for administration, student records, and teacher management.
          </p>
        </div>
      </div>
    </section>
  )
}

function PageCard({ title, content, image }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
      <img src={image} alt={title} className="h-64 w-full rounded-lg object-cover" />
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-semibold text-slate-800">{title}</h2>
        <p className="mt-4 text-slate-600">{content}</p>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <div className="space-y-8">
      <BannerSlider />
      <PageCard
        title="Welcome to School System"
        image={pageImages.home}
        content="Manage admissions, academics, attendance, and communication from one modern dashboard."
      />
    </div>
  )
}

function AboutPage() {
  return (
    <PageCard
      title="About Our Platform"
      image={pageImages.about}
      content="Built for schools to digitize daily operations with better transparency between administration, teachers, students, and parents."
    />
  )
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactCards = [
    {
      title: 'Main Campus',
      detail: 'Green Valley International School, Sector 12, New Delhi – 110001',
      icon: '🏫',
    },
    {
      title: 'Phone',
      detail: '+91 98765 43210 | +91 11 4567 8900',
      icon: '📞',
    },
    {
      title: 'Email',
      detail: 'support@schoolsystem.com | admissions@schoolsystem.com',
      icon: '✉️',
    },
    {
      title: 'Office Hours',
      detail: 'Mon – Fri: 8:00 AM – 5:00 PM | Sat: 9:00 AM – 1:00 PM',
      icon: '🕒',
    },
  ]

  return (
    <div className="space-y-8">
      <section className="relative h-72 overflow-hidden rounded-2xl shadow-xl md:h-96">
        <img
          src={pageImages.contactCampus}
          alt="School campus aerial view"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-slate-900/60 to-transparent">
          <div className="flex h-full flex-col justify-center px-8 md:px-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Get in Touch</p>
            <h2 className="mt-2 max-w-xl text-3xl font-bold text-white md:text-5xl">We Would Love to Hear From You</h2>
            <p className="mt-4 max-w-lg text-sm text-slate-100 md:text-base">
              Admissions, parent support, technical help, or campus visits — our team responds within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contactCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-3xl">{card.icon}</span>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow lg:col-span-3">
          <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>
          <p className="text-sm text-slate-600">Fill out the form and our support team will get back to you soon.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Your name"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Subject (Admissions / Support / Feedback)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            required
          />
          <textarea
            placeholder="Write your message here..."
            className="h-32 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            required
          />
          {submitted && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              Thank you! Your message has been received. We will contact you shortly.
            </p>
          )}
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Submit Message
          </button>
        </form>

        <div className="space-y-4 lg:col-span-2">
          <img
            src={pageImages.contactOffice}
            alt="School administration office"
            className="h-48 w-full rounded-2xl object-cover shadow"
          />
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white shadow">
            <h3 className="text-xl font-bold">Visit Our Campus</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              Guided campus tours are available every Saturday. See our classrooms, science labs, sports grounds, and
              digital learning centres in person.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
              <li>• Smart classrooms with digital boards</li>
              <li>• Library with 10,000+ books</li>
              <li>• Indoor & outdoor sports facilities</li>
              <li>• Safe transport for all zones</li>
            </ul>
            <a
              href="mailto:admissions@schoolsystem.com?subject=Campus%20Tour%20Request"
              className="mt-5 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50"
            >
              Book a Campus Tour
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServicesPage() {
  const [query, setQuery] = useState('')
  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <section className="mx-auto max-w-6xl space-y-6 rounded-xl bg-white p-6 shadow">
      <h2 className="text-3xl font-semibold text-slate-800">Our Services</h2>
      <p className="text-slate-600">
        Explore course services and quickly find programs using the search bar.
      </p>
      <input
        type="text"
        placeholder="Search course..."
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredCourses.map((course) => (
          <div key={course} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-700">
            {course}
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <p className="text-sm text-slate-500">No courses found for your search.</p>
        )}
      </div>
    </section>
  )
}

function RoleSelectorPage() {
  const roleDetails = {
    student: { label: 'Student Portal', desc: 'View marks, attendance & assignments', color: 'from-emerald-600 to-teal-700' },
    teacher: { label: 'Teacher Portal', desc: 'Manage classes, marks & attendance', color: 'from-blue-600 to-indigo-700' },
    admin: { label: 'Admin Portal', desc: 'Control users, reports & settings', color: 'from-violet-600 to-purple-700' },
    parent: { label: 'Parent Portal', desc: 'Track your child\'s progress', color: 'from-orange-500 to-amber-600' },
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={pageImages.loginBuilding}
          alt="Real school building"
          className="h-72 w-full object-cover md:h-[420px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-900/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Green Valley International School</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:text-5xl">Welcome to Your Digital Campus</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
            A modern school management portal built for students, teachers, parents, and administrators.
            Sign in below to access your dashboard securely.
          </p>
        </div>
        <img
          src={pageImages.loginCampus}
          alt="School campus"
          className="absolute bottom-4 right-4 hidden h-28 w-40 rounded-xl border-2 border-white/80 object-cover shadow-2xl md:block lg:h-36 lg:w-52"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
          <h3 className="text-2xl font-bold text-slate-900">Choose Your Login Portal</h3>
          <p className="mt-2 text-slate-600">
            Select your role to continue. Each portal is protected with password login and OTP verification.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <NavLink
                key={role}
                to={`/login/${role}`}
                className={`group rounded-xl bg-gradient-to-br ${roleDetails[role].color} p-5 text-white shadow transition hover:-translate-y-1 hover:shadow-xl`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{roleDetails[role].label}</p>
                <p className="mt-2 text-lg font-bold capitalize">{role} Login</p>
                <p className="mt-1 text-sm text-white/90">{roleDetails[role].desc}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-white/90 group-hover:underline">
                  Sign in →
                </span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-bold text-slate-900">New Student?</h3>
          <p className="mt-2 text-sm text-slate-600">Create your account and start using the student portal today.</p>
          <Link
            to="/register/student"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Register as Student
          </Link>
        </div>
      </section>
    </div>
  )
}

function RoleLoginPage({ setPendingRole }) {
  const { role } = useParams()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showForgotForm, setShowForgotForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const validRole = useMemo(() => roles.includes(role), [role])

  if (!validRole) {
    return <Navigate to="/login" replace />
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message ?? 'Login failed')
          return
        }
        setPendingRole({ role: data.role, fullName: data.fullName })
        navigate('/security')
      })
      .catch(() => setError('Cannot connect to server. Please start backend.'))
      .finally(() => setLoading(false))
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    fetch('http://localhost:8080/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, role, newPassword }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          setError(data.message ?? 'Password reset failed')
          return
        }
        setSuccess('Password updated in database. Please login with new password.')
        setShowForgotForm(false)
        setNewPassword('')
      })
      .catch(() => setError('Cannot connect to server. Please start backend.'))
      .finally(() => setLoading(false))
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-8 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2">
      <img src={pageImages[role]} alt={`${role} login`} className="h-72 w-full rounded-lg object-cover" />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-3xl font-semibold capitalize text-slate-800">{role} Login</h2>
        <p className="mt-2 text-slate-600">Secure sign in for {role} module access.</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
        <button
          className="mt-3 text-sm font-medium text-blue-700 hover:underline"
          onClick={() => setShowForgotForm((old) => !old)}
        >
          Forgot password?
        </button>
        {showForgotForm && (
          <form onSubmit={handleForgotPassword} className="mt-4 space-y-3 rounded-md border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-700">Reset Password</p>
            <input
              type="password"
              placeholder="New password"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-60"
            >
              Update Password
            </button>
          </form>
        )}
        {role === 'student' && (
          <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-slate-700">New to the school portal?</p>
            <Link
              to="/register/student"
              className="mt-2 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              New Student Registration
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function SecurityPage({ pendingRole, setActiveRole }) {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')

  if (!pendingRole) {
    return <Navigate to="/login" replace />
  }

  const verifyCode = (e) => {
    e.preventDefault()
    if (otp !== '123456') {
      return
    }
    setActiveRole(pendingRole)
    navigate(`/dashboard/${pendingRole.role}`)
  }

  return (
    <section className="mx-auto grid max-w-4xl gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
      <img src={pageImages.security} alt="Security verification" className="h-72 w-full rounded-lg object-cover" />
      <form onSubmit={verifyCode} className="space-y-4">
        <h2 className="text-3xl font-semibold text-slate-800">Security Authentication</h2>
        <p className="text-slate-600">
          Role: <span className="font-semibold capitalize">{pendingRole.role}</span>. Enter OTP <code>123456</code>.
        </p>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full rounded border border-slate-300 px-3 py-2"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button className="w-full rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
          Verify and Login
        </button>
      </form>
    </section>
  )
}

function DashboardPage({ activeRole }) {
  const { role } = useParams()
  const navigate = useNavigate()

  if (!activeRole || activeRole.role !== role) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />
  }
  if (role === 'student') {
    return <Navigate to="/dashboard/student" replace />
  }
  if (role === 'teacher') {
    return <Navigate to="/dashboard/teacher" replace />
  }
  if (role === 'parent') {
    return <Navigate to="/dashboard/parent" replace />
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
      <img src={pageImages[role]} alt={`${role} dashboard`} className="h-72 w-full rounded-lg object-cover" />
      <div className="flex flex-col justify-center">
        <h2 className="text-3xl font-semibold capitalize text-slate-800">{role} Dashboard</h2>
        <p className="mt-2 text-slate-500">Welcome, {activeRole.fullName}</p>
        <p className="mt-3 text-slate-600">
          You are authenticated. This dashboard is protected and accessible only to the {role} role.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-5 w-fit rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Back to Home
        </button>
      </div>
    </section>
  )
}

function Navbar() {
  const links = ['/', '/about', '/services', '/contact']

  return (
    <header className="sticky top-0 z-20 shadow">
      <div className="bg-blue-700 px-4 py-1 text-center text-xs font-medium text-white">
        Welcome to School Management Portal
      </div>
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 bg-slate-900/95 px-5 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">SchoolSystem</h1>
          <p className="text-xs text-slate-300">Smart School Administration</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {links.map((path) => {
            const label = path === '/' ? 'Home' : path.replace('/', '')
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded px-3 py-1.5 text-sm capitalize text-white ${
                    isActive ? 'bg-slate-700 ring-1 ring-slate-500' : 'bg-slate-700 hover:bg-slate-600'
                  }`
                }
              >
                {label}
              </NavLink>
            )
          })}
          <NavLink to="/login" className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600">
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-700 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:grid-cols-3">
        <div>
          <h3 className="text-base font-semibold text-white">SchoolSystem</h3>
          <p className="mt-2 text-sm text-slate-300">
            Professional platform for students, teachers, parents, and administrators.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-sm text-slate-300">
            <li>
              <NavLink className="hover:text-white hover:underline" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="hover:text-white hover:underline" to="/about">
                About
              </NavLink>
            </li>
            <li>
              <NavLink className="hover:text-white hover:underline" to="/services">
                Services
              </NavLink>
            </li>
            <li>
              <NavLink className="hover:text-white hover:underline" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Contact</h3>
          <p className="mt-2 text-sm text-slate-300">
            Email:{' '}
            <a className="hover:text-white hover:underline" href="mailto:support@schoolsystem.com">
              support@schoolsystem.com
            </a>
          </p>
          <p className="text-sm text-slate-300">
            Phone:{' '}
            <a className="hover:text-white hover:underline" href="tel:+919876543210">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700 px-4 py-3 text-center text-xs text-slate-400">
        Copyright {new Date().getFullYear()} School Management System. Powered by React, Spring Boot, and MySQL.
      </div>
    </footer>
  )
}

function App() {
  const [pendingRole, setPendingRole] = useState(null)
  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('activeRole')
      if (!saved) {
        return null
      }
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object' && parsed.role) {
        return parsed
      }
      return null
    } catch {
      localStorage.removeItem('activeRole')
      return null
    }
  })

  const handleSetActiveRole = (value) => {
    setActiveRole(value)
    localStorage.setItem('activeRole', JSON.stringify(value))
  }

  const handleLogout = () => {
    setPendingRole(null)
    setActiveRole(null)
    localStorage.removeItem('activeRole')
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<RoleSelectorPage />} />
            <Route path="/login/:role" element={<RoleLoginPage setPendingRole={setPendingRole} />} />
            <Route path="/register/student" element={<StudentRegistration />} />
            <Route
              path="/security"
              element={<SecurityPage pendingRole={pendingRole} setActiveRole={handleSetActiveRole} />}
            />
            <Route path="/dashboard/:role" element={<DashboardPage activeRole={activeRole} />} />
            <Route
              path="/dashboard/admin"
              element={
                activeRole?.role === 'admin' ? (
                  <AdminLayout activeRole={activeRole} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login/admin" replace />
                )
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="parents" element={<AdminParents />} />

              <Route
                path="timetable"
                element={<AdminTimetable />}
              />
              <Route
                path="attendance"
                element={<AdminAttendancePage />}
              />
              <Route
                path="notices"
                element={<AdminNoticesPage />}
              />
              <Route
                path="users"
                element={<AdminUsersPage />}
              />
              <Route
                path="reports"
                element={<AdminReportsPage />}
              />
              <Route
                path="support"
                element={<AdminSupportPage />}
              />
              <Route
                path="settings"
                element={<AdminSettings />}
              />
            </Route>
            <Route
              path="/dashboard/student"
              element={
                activeRole?.role === 'student' ? (
                  <StudentLayout activeRole={activeRole} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login/student" replace />
                )
              }
            >
              <Route index element={<StudentProfilePage activeRole={activeRole} />} />
              <Route path="timetable" element={<StudentTimetablePage />} />
              <Route path="attendance" element={<StudentAttendancePage />} />
              <Route path="results" element={<StudentResultsPage activeRole={activeRole} />} />
              <Route path="assignments" element={<StudentAssignmentsPage />} />
              <Route path="download-result" element={<StudentDownloadResultPage activeRole={activeRole} />} />
              <Route path="notices" element={<StudentNoticesPage />} />
              <Route path="update-profile" element={<StudentUpdateProfilePage activeRole={activeRole} />} />
            </Route>
            <Route
              path="/dashboard/teacher"
              element={
                activeRole?.role === 'teacher' ? (
                  <TeacherLayout activeRole={activeRole} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login/teacher" replace />
                )
              }
            >
              <Route index element={<TeacherAttendancePage />} />
              <Route path="marks" element={<TeacherMarksPage />} />
              <Route path="students" element={<TeacherStudentListPage />} />
              <Route path="assignments" element={<TeacherAssignmentsPage />} />
              <Route path="timetable" element={<TeacherTimetablePage />} />
              <Route path="classes" element={<TeacherAssignedClassesPage />} />
              <Route path="notices" element={<TeacherNoticesPage />} />
              <Route path="attendance-percent" element={<TeacherAttendancePercentPage />} />
              <Route path="exam-percent" element={<TeacherExamPercentPage />} />
            </Route>
            <Route
              path="/dashboard/parent"
              element={
                activeRole?.role === 'parent' ? (
                  <ParentLayout activeRole={activeRole} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login/parent" replace />
                )
              }
            >
              <Route index element={<ParentChildProfilePage activeRole={activeRole} />} />
              <Route path="attendance" element={<ParentChildAttendancePage />} />
              <Route path="results" element={<ParentChildResultsPage />} />
              <Route path="timetable" element={<ParentTimetablePage />} />
              <Route path="notices" element={<ParentNoticesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

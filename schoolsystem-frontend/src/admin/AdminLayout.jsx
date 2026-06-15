import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard/admin', label: 'Overview' },
  { to: '/dashboard/admin/students', label: 'Students' },
  { to: '/dashboard/admin/teachers', label: 'Teachers' },
  { to: '/dashboard/admin/parents', label: 'Parents' },
  { to: '/dashboard/admin/timetable', label: 'Timetable' },
  { to: '/dashboard/admin/attendance', label: 'Attendance & Academics' },
  { to: '/dashboard/admin/notices', label: 'Notices & Communication' },
  { to: '/dashboard/admin/users', label: 'User Management' },
  { to: '/dashboard/admin/reports', label: 'Reports & Analytics' },
  { to: '/dashboard/admin/support', label: 'Support' },
  { to: '/dashboard/admin/settings', label: 'Settings' },
]

export function AdminLayout({ activeRole, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-2xl bg-slate-900 p-5 text-slate-100 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-200">Admin Portal</div>
            <div className="mt-1 text-lg font-bold text-white">{activeRole?.fullName ?? 'Admin'}</div>
            <div className="text-xs uppercase tracking-wide text-slate-400">{activeRole?.role ?? 'admin'}</div>
          </div>
          <button
            className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            onClick={() => {
              onLogout?.()
              navigate('/login')
            }}
          >
            Logout
          </button>
        </div>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard/admin'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-slate-700 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}


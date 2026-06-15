import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard/parent', label: 'View Child Profile' },
  { to: '/dashboard/parent/attendance', label: 'View Child Attendance' },
  { to: '/dashboard/parent/results', label: 'View Marks & Results' },
  { to: '/dashboard/parent/timetable', label: 'View Timetable' },
  { to: '/dashboard/parent/notices', label: 'View Notice' },
]

export function ParentLayout({ activeRole, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl bg-emerald-900 p-5 text-emerald-50 shadow-lg">
        <div>
          <div className="text-sm font-semibold text-emerald-100">Parent Dashboard</div>
          <div className="mt-1 text-lg font-bold text-white">{activeRole?.fullName ?? 'Parent'}</div>
        </div>
        <button
          className="mt-4 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          onClick={() => {
            onLogout?.()
            navigate('/login/parent')
          }}
        >
          Logout
        </button>

        <nav className="mt-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard/parent'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-emerald-700 text-white' : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  )
}


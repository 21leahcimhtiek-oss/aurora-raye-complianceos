import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  const { data: frameworks } = await supabase
    .from('frameworks')
    .select('*')
    .eq('organization_id', profile?.organization_id)

  const { data: risks } = await supabase
    .from('risks')
    .select('id, status')
    .eq('organization_id', profile?.organization_id)

  const openRisks = risks?.filter((r) => r.status === 'open').length || 0
  const totalFrameworks = frameworks?.length || 0
  const avgScore = frameworks?.length
    ? Math.round(frameworks.reduce((sum, f) => sum + (f.compliance_score || 0), 0) / frameworks.length)
    : 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm">C</span>
            </div>
            <span className="font-semibold">Aurora Rayes ComplianceOS</span>
          </div>
          <p className="text-slate-400 text-xs mt-1 truncate">{profile?.organizations?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/dashboard', label: 'Dashboard', icon: '📊' },
            { href: '/dashboard/frameworks', label: 'Frameworks', icon: '🛡️' },
            { href: '/dashboard/controls', label: 'Controls', icon: '📋' },
            { href: '/dashboard/evidence', label: 'Evidence', icon: '🗂️' },
            { href: '/dashboard/risks', label: 'Risk Register', icon: '⚠️' },
            { href: '/dashboard/audits', label: 'Audits', icon: '🔍' },
            { href: '/dashboard/team', label: 'Team', icon: '👥' },
            { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        <main className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Overall Compliance', value: `${avgScore}%`, color: 'text-indigo-600', sub: 'across all frameworks' },
              { label: 'Active Frameworks', value: totalFrameworks, color: 'text-slate-900', sub: `of ${profile?.organizations?.max_frameworks || 1} allowed` },
              { label: 'Open Risks', value: openRisks, color: openRisks > 5 ? 'text-red-600' : 'text-amber-600', sub: 'require attention' },
              { label: 'Plan', value: profile?.organizations?.plan || 'trial', color: 'text-green-600', sub: 'current subscription' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-6">
                <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold capitalize ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Frameworks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Compliance Frameworks</h2>
              <Link href="/dashboard/frameworks/new" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                + Add Framework
              </Link>
            </div>
            {frameworks && frameworks.length > 0 ? (
              <div className="space-y-4">
                {frameworks.map((framework) => (
                  <div key={framework.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{framework.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{framework.status.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">{framework.compliance_score}%</p>
                        <p className="text-xs text-slate-400">compliant</p>
                      </div>
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 rounded-full h-2"
                          style={{ width: `${framework.compliance_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p className="text-4xl mb-3">🛡️</p>
                <p className="font-medium">No frameworks yet</p>
                <p className="text-sm mt-1">Add your first compliance framework to get started</p>
                <Link href="/dashboard/frameworks/new" className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-500 transition-colors">
                  Add Framework
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

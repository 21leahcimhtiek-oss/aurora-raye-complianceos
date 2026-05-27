import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-semibold text-lg">Aurora Rayes ComplianceOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-900/50 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-8 border border-indigo-700">
          <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
          SOC 2 · ISO 27001 · HIPAA · GDPR
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Compliance automation
          <br />
          <span className="text-indigo-400">without the $50k bill</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
          Aurora Rayes ComplianceOS helps engineering teams achieve SOC 2, ISO 27001, HIPAA, and GDPR compliance
          with AI-assisted evidence collection, automated control tracking, and real-time dashboards.
          Starting at $99/month.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
            Start 14-day free trial
          </Link>
          <Link href="#demo" className="border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
            Watch demo →
          </Link>
        </div>
        <p className="text-slate-500 text-sm mt-4">No credit card required · Cancel anytime</p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything you need for compliance</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          Replace spreadsheets and expensive consultants with a single, AI-powered compliance platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🛡️', title: 'Multi-Framework Support', desc: 'SOC 2, ISO 27001, HIPAA, GDPR — all in one place with pre-built control libraries.' },
            { icon: '🤖', title: 'AI Gap Analysis', desc: 'AI identifies missing controls and suggests evidence to collect to close compliance gaps.' },
            { icon: '📋', title: 'Evidence Collection', desc: 'Upload documents, link policies, and track evidence status per control with one click.' },
            { icon: '⚠️', title: 'Risk Register', desc: 'Identify, score, and track organizational risks with automated risk scoring matrix.' },
            { icon: '📊', title: 'Compliance Dashboard', desc: 'Real-time compliance score, control status, and progress tracking across frameworks.' },
            { icon: '🔍', title: 'Audit Management', desc: 'Plan internal audits, track findings, and manage remediation workflows end-to-end.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition-colors">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, transparent pricing</h2>
        <p className="text-slate-400 text-center mb-12">14-day free trial on all plans. No credit card required.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Starter',
              price: '$99',
              period: '/month',
              desc: 'For startups beginning their compliance journey',
              features: ['1 compliance framework', 'Up to 10 users', 'Evidence collection', 'Basic dashboard', 'Email support'],
              cta: 'Start free trial',
              highlight: false,
            },
            {
              name: 'Professional',
              price: '$299',
              period: '/month',
              desc: 'For teams pursuing multiple frameworks',
              features: ['3 compliance frameworks', 'Up to 50 users', 'AI gap analysis', 'Full audit reports', 'Risk register', 'API access', 'Priority support'],
              cta: 'Start free trial',
              highlight: true,
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: '',
              desc: 'For large organizations with complex needs',
              features: ['Unlimited frameworks', 'Unlimited users', 'SSO/SAML', 'Custom integrations', 'Dedicated support', 'SLA 99.99%', 'On-premise option'],
              cta: 'Contact sales',
              highlight: false,
            },
          ].map((plan) => (
            <div key={plan.name} className={`relative rounded-xl p-8 ${plan.highlight ? 'bg-indigo-600 border-2 border-indigo-400' : 'bg-slate-800/50 border border-slate-700'}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-300">{plan.period}</span>
              </div>
              <p className="text-slate-300 text-sm mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-200">
                    <span className="text-green-400 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-indigo-600 hover:bg-slate-100'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 <a href="https://aurorarayes.example" className="text-indigo-400 hover:text-indigo-300">Aurora Rayes LLC</a>. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="https://aurorarayes.example/complianceos" className="hover:text-white transition-colors">Aurora Rayes ecosystem</a>
              <a href="https://github.com/AURORA-RAYE/beginings" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

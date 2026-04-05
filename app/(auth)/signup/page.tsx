'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    orgName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function slugify(text: string) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError || !authData.user) {
      setError(authError?.message || 'Signup failed')
      setLoading(false)
      return
    }

    const slug = slugify(formData.orgName) + '-' + Date.now()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: formData.orgName, slug, plan: 'trial' })
      .select()
      .single()

    if (orgError || !org) {
      setError('Failed to create organization')
      setLoading(false)
      return
    }

    await supabase.from('profiles').insert({
      id: authData.user.id,
      organization_id: org.id,
      email: formData.email,
      full_name: formData.fullName,
      role: 'admin',
    })

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Start your free trial</h1>
          <p className="text-slate-400 mt-2">14 days free. No credit card required.</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Organization name</label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Work email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="jane@acme.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Min 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Creating account...' : 'Start free trial'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

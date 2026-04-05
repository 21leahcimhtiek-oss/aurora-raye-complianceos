import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeComplianceGaps } from '@/lib/openai'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { frameworkId } = await req.json()

  const { data: framework } = await supabase
    .from('frameworks')
    .select('*, controls(*)')
    .eq('id', frameworkId)
    .single()

  if (!framework) {
    return NextResponse.json({ error: 'Framework not found' }, { status: 404 })
  }

  const analysis = await analyzeComplianceGaps(
    framework.framework_type,
    framework.controls || []
  )

  return NextResponse.json({ analysis })
}

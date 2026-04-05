import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeComplianceGaps(
  frameworkType: string,
  controls: Array<{ control_id: string; title: string; status: string }>
): Promise<string> {
  const notStarted = controls.filter((c) => c.status === 'not_started')
  const inProgress = controls.filter((c) => c.status === 'in_progress')

  const prompt = `You are a compliance expert. Analyze the following ${frameworkType} compliance gaps and provide actionable recommendations.

Controls not started (${notStarted.length}):
${notStarted.slice(0, 10).map((c) => `- ${c.control_id}: ${c.title}`).join('\n')}

Controls in progress (${inProgress.length}):
${inProgress.slice(0, 10).map((c) => `- ${c.control_id}: ${c.title}`).join('\n')}

Provide:
1. Top 3 priority controls to address first
2. Quick wins (controls that can be implemented in < 1 week)
3. Common evidence types needed
Keep response concise and actionable.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
  })

  return response.choices[0].message.content || 'Unable to generate analysis.'
}

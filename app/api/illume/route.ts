import { NextResponse } from 'next/server'

const feedback = {
  Math: { explanation: 'You are noticing that fractions are pieces of a whole. The key next step is making those pieces the same size before adding.', nextPrompt: 'Try the chocolate bar analogy to light the next spot.' },
  Science: { explanation: 'You connected heat to movement. When water particles gain enough energy, they spread apart and escape as a gas.', nextPrompt: 'Imagine the particles as people at a concert to light the next spot.' },
  Reading: { explanation: 'You are looking for the story’s big message. Strong readers connect repeated details to one clear main idea.', nextPrompt: 'Look for the detail that keeps coming back to light the next spot.' },
} as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const topic = body.topic in feedback ? body.topic as keyof typeof feedback : 'Math'
  const copy = feedback[topic]
  return NextResponse.json({ masteryScore: 72, overallStatus: 'In Progress', topic, glowSpots: [], explanation: copy.explanation, nextPrompt: copy.nextPrompt })
}

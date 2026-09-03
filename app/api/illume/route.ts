import { NextResponse } from 'next/server'

const feedback = { Math: ['Fractions are pieces of a whole.', 'A common denominator makes every piece the same size.', 'Dividing both parts by the same factor keeps the value unchanged.'], Science: ['Heat gives particles more energy.', 'Faster particles spread farther apart.', 'Evaporation is when surface particles escape into the air.'], Reading: ['The main idea connects repeated details.', 'Key details support the bigger message.', 'Theme is the lasting message, while main idea is what the text is mostly about.'] } as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { topic?: string; questionIndex?: number }
  const topic = body.topic === 'Science' || body.topic === 'Reading' ? body.topic : 'Math'
  const questionIndex = Math.min(Math.max(Number(body.questionIndex) || 0, 0), 2)
  return NextResponse.json({ masteryScore: Math.round(((questionIndex + 1) / 3) * 100), overallStatus: questionIndex === 2 ? 'Fundamentals clear' : 'In Progress', topic, questionIndex, explanation: feedback[topic][questionIndex], nextStep: questionIndex === 2 ? 'Diagnostic complete' : 'Ask the next follow-up on the same topic.' })
}

import { NextResponse } from 'next/server'

type Topic = 'Math' | 'Science' | 'Reading'

type Step = { id: number; name: string; explanation: string; keywords: string[] }

const STEPS: Record<Topic, Step[]> = {
  Math: [
    { id: 1, name: 'Identify the fractions', explanation: 'A fraction names equal parts of one whole: the numerator counts parts and the denominator names the total equal parts.', keywords: ['fraction', 'numerator', 'denominator', 'part', 'whole'] },
    { id: 2, name: 'Find a common denominator', explanation: 'Fractions need equally sized parts before they can be added. Find a common denominator and rename each fraction.', keywords: ['common denominator', 'same denominator', 'lcd', 'least common', 'rename'] },
    { id: 3, name: 'Add and simplify', explanation: 'Add the numerators, keep the denominator, and simplify by dividing the numerator and denominator by the same factor.', keywords: ['add', 'numerator', 'simplify', 'divide', 'same factor', 'reduce'] },
  ],
  Science: [
    { id: 1, name: 'Energy of particles', explanation: 'Heating gives particles more kinetic energy, so they move faster.', keywords: ['heat', 'energy', 'particle', 'move', 'faster'] },
    { id: 2, name: 'State changes', explanation: 'As particles gain energy they spread farther apart, helping liquid become gas.', keywords: ['spread', 'apart', 'liquid', 'gas', 'state'] },
    { id: 3, name: 'Evaporation', explanation: 'Evaporation happens when energetic particles at a liquid surface escape into the air.', keywords: ['evaporation', 'surface', 'escape', 'air', 'gas'] },
  ],
  Reading: [
    { id: 1, name: 'Find key details', explanation: 'Key details are the important pieces of evidence that repeat or support the text.', keywords: ['detail', 'evidence', 'important', 'repeat', 'support'] },
    { id: 2, name: 'State the main idea', explanation: 'The main idea tells what the text is mostly about and connects its important details.', keywords: ['main idea', 'mostly about', 'summary', 'connect'] },
    { id: 3, name: 'Explain the theme', explanation: 'A theme is the lasting lesson or message readers can take from the text.', keywords: ['theme', 'lesson', 'message', 'learn'] },
  ],
}

function evaluate(answer: string, steps: Step[]) {
  const normalized = answer.toLowerCase()
  return steps.map((step) => step.keywords.some((keyword) => normalized.includes(keyword)))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { topic?: Topic; answer?: string; followUpStep?: number }
  const topic: Topic = body.topic === 'Science' || body.topic === 'Reading' ? body.topic : 'Math'
  const steps = STEPS[topic]
  const stepsCorrect = evaluate(body.answer || '', steps)
  const missing = steps.filter((_, index) => !stepsCorrect[index])
  const followUpSteps = missing.slice(0, 2)
  const allCorrect = missing.length === 0

  return NextResponse.json({
    topic,
    steps: steps.map(({ id, name, explanation }) => ({ id, name, explanation })),
    stepsCorrect,
    missingSteps: missing.map((step) => step.id),
    explanations: steps.map((step) => step.explanation),
    allCorrect,
    followUpsNeeded: !allCorrect,
    followUpQuestions: followUpSteps.map((step) => ({ step: step.id, question: `Let&apos;s focus on ${step.name.toLowerCase()}. How would you explain that step in your own words?`, placeholder: `I think ${step.name.toLowerCase()} means...` })),
    feedback: allCorrect ? 'Excellent understanding. You followed all three fundamental steps in your first answer, so no follow-up questions are needed.' : `You have part of the idea. Let&apos;s strengthen ${followUpSteps.map((step) => step.name.toLowerCase()).join(' and ')} with a focused follow-up.`,
  })
}

'use client'

import Link from 'next/link'
import { ArrowLeft, Check, ChevronRight, Lightbulb, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Bud, Header } from '@/components/illume-dashboard'

type TopicKey = 'Math' | 'Science' | 'Reading'
type Step = { id: number; name: string; explanation: string }
type FollowUp = { step: number; question: string; placeholder: string }
type Evaluation = { steps: Step[]; stepsCorrect: boolean[]; explanations: string[]; allCorrect: boolean; followUpsNeeded: boolean; followUpQuestions: FollowUp[]; feedback: string }

const QUESTIONS: Record<TopicKey, { prompt: string; placeholder: string }> = {
  Math: { prompt: 'How would you add 1/2 + 1/4? Explain every step, not just the answer.', placeholder: 'First I would identify..., then I would...' },
  Science: { prompt: 'Why does water change from a liquid into a gas? Explain what happens at the particle level.', placeholder: 'When water gets warmer, its particles...' },
  Reading: { prompt: 'How do you find the main idea and theme of a story? Explain how details help you.', placeholder: 'I look for details that..., then I...' },
}

export default function Diagnose() {
  const [topic, setTopic] = useState<TopicKey>('Math')
  const [answer, setAnswer] = useState('')
  const [stage, setStage] = useState<'form' | 'loading' | 'results' | 'celebrate'>('form')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [followUpIndex, setFollowUpIndex] = useState(0)
  const [completed, setCompleted] = useState<number[]>([])

  function changeTopic(value: TopicKey) { setTopic(value); setAnswer(''); setEvaluation(null); setFollowUps([]); setFollowUpIndex(0); setCompleted([]); setStage('form') }

  async function submit() {
    setStage('loading')
    const response = await fetch('/api/illume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, answer, followUpStep: followUps[followUpIndex]?.step }) })
    const data = await response.json() as Evaluation
    setEvaluation(data)
    setAnswer('')
    if (data.allCorrect && followUps.length === 0) setStage('celebrate')
    else if (followUps.length === 0) { setFollowUps(data.followUpQuestions); setStage('results') }
    else {
      const current = followUps[followUpIndex]?.step
      const currentCorrect = current ? data.stepsCorrect[current - 1] : false
      if (current && !currentCorrect) {
        setFollowUps((items) => items.map((item, index) => index === followUpIndex ? { ...item, question: `Let&apos;s try Step ${item.step} once more. Can you explain ${item.question.replace("Let&apos;s focus on ", '').replace(". How would you explain that step in your own words?", '')} using a concrete example?` } : item))
        setStage('form')
      } else {
        setCompleted((items) => current ? [...items, current] : items)
        if (followUpIndex + 1 >= followUps.length) setStage('celebrate')
        else { setFollowUpIndex((index) => index + 1); setStage('form') }
      }
    }
  }

  const isFollowUp = followUps.length > 0 && stage === 'form'
  const currentFollowUp = followUps[followUpIndex]
  const prompt = isFollowUp && currentFollowUp ? currentFollowUp.question.replace('&apos;', "'") : QUESTIONS[topic].prompt
  const placeholder = isFollowUp && currentFollowUp ? currentFollowUp.placeholder : QUESTIONS[topic].placeholder

  return <div className="light-flow"><Header /><div className="container-shell py-10 md:py-16">
    {stage === 'form' && <div className="mx-auto max-w-2xl"><Link href="/" className="inline-flex items-center gap-2 text-sm text-muted"><ArrowLeft size={16} /> Dashboard</Link><div className="mt-10"><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo">{isFollowUp ? `Targeted follow-up ${followUpIndex + 1} of ${followUps.length}` : 'Fundamentals diagnostic'}</p><h1 className="font-heading mt-3 text-5xl leading-tight">Show me how you think.</h1><p className="mt-4 text-lg leading-8 text-muted">{isFollowUp ? 'This question targets one step that was missing from your first answer.' : 'Explain your thinking. We will check three fundamental steps at once.'}</p></div><div className="mt-10 space-y-6"><label className="block"><span className="text-sm font-semibold">Topic</span><select value={topic} onChange={(event) => changeTopic(event.target.value as TopicKey)} className="focus-ring mt-2 w-full rounded-2xl border border-indigo/20 bg-white p-4 text-ink"><option>Math</option><option>Science</option><option>Reading</option></select></label><div className="rounded-3xl bg-indigo p-6 text-white"><p className="text-sm text-white/70">{isFollowUp ? `Step ${currentFollowUp?.step} follow-up` : 'Diagnostic question'}</p><p className="font-heading mt-3 text-2xl">{prompt}</p></div><label className="block"><span className="text-sm font-semibold">Your explanation</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={placeholder} className="focus-ring mt-2 min-h-40 w-full resize-y rounded-2xl border border-indigo/20 bg-white p-4 text-ink" /></label><button onClick={submit} disabled={!answer.trim()} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50">Check my understanding <ChevronRight size={18} /></button></div></div>}
    {stage === 'loading' && <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center"><Bud mood="thinking" /><h2 className="font-heading mt-8 text-4xl">Bud is checking each step...</h2><p className="mt-3 text-muted">We are looking for the ideas underneath your answer.</p></div>}
    {stage === 'results' && evaluation && <div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo">{topic} step check</p><h1 className="font-heading mt-3 text-5xl">Let&apos;s strengthen the gaps.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{evaluation.feedback.replace('&apos;', "'")}</p></div><Bud mood="happy" /></div><div className="mt-10 grid gap-4 md:grid-cols-3">{evaluation.steps.map((step, index) => <div key={step.id} className={`${evaluation.stepsCorrect[index] ? 'glow-card' : 'dim-card'} text-left`}><div className="flex items-center justify-between"><span className="text-sm font-semibold">{evaluation.stepsCorrect[index] ? 'Understood' : 'Needs practice'}</span>{evaluation.stepsCorrect[index] ? <Check size={18} /> : <Lightbulb size={18} />}</div><h3 className="font-heading mt-8 text-2xl">Step {step.id}: {step.name}</h3><p className="mt-2 text-sm leading-6 opacity-75">{evaluation.explanations[index]}</p></div>)}</div><button onClick={() => { setFollowUpIndex(0); setStage('form') }} className="button-primary mt-8 w-full md:w-auto">Answer the targeted follow-ups <ChevronRight size={18} /></button></div>}
    {stage === 'celebrate' && <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center"><Bud mood="celebrating" size="lg" /><p className="mt-8 text-sm font-semibold uppercase tracking-[.2em] text-indigo">Fundamentals clear</p><h1 className="font-heading mt-3 text-5xl">Your constellation is glowing.</h1><p className="mt-4 text-lg leading-8 text-muted">Excellent work. You demonstrated all three steps for this {topic.toLowerCase()} concept, so no more follow-up questions are needed.</p><Link href="/" className="button-primary mt-8">Back to dashboard <Sparkles size={16} /></Link></div>}
  </div></div>
}

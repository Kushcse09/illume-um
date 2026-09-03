'use client'

import Link from 'next/link'
import { ArrowLeft, Check, ChevronRight, Lightbulb, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Bud, Header } from '@/components/illume-dashboard'

type TopicKey = 'Math' | 'Science' | 'Reading'
type Spot = { id: number; name: string; why: string; lesson: string; lit: boolean }
type TopicConfig = { question: string; placeholder: string; concepts: Spot[]; response: string; prompt: string }

const TOPICS: Record<TopicKey, TopicConfig> = {
  Math: { question: 'How would you explain adding two fractions with different denominators to a friend?', placeholder: 'I think you start by...', response: 'You are noticing that fractions are pieces of a whole. The key next step is making those pieces the same size before adding.', prompt: 'Try the chocolate bar analogy to light the next spot.', concepts: [
    { id: 1, name: 'Equivalent fractions', why: 'You can compare pieces, but the connection between numerator and denominator is still fuzzy.', lesson: 'Equivalent fractions name the same amount using different-sized pieces.', lit: false },
    { id: 2, name: 'Common denominators', why: 'You started the right way, then mixed the sizes of the pieces.', lesson: 'Before adding slices, make sure every slice is cut to the same size.', lit: false },
    { id: 3, name: 'Simplifying', why: 'Your final answer is correct, but the last step can be made clearer.', lesson: 'Simplifying describes the same amount with the fewest, biggest pieces.', lit: true },
  ] },
  Science: { question: 'How would you explain why water changes from a liquid into a gas?', placeholder: 'When water gets warmer...', response: 'You connected heat to movement. When water particles gain enough energy, they spread apart and escape as a gas.', prompt: 'Imagine the particles as people at a concert to light the next spot.', concepts: [
    { id: 1, name: 'Particle energy', why: 'You noticed heat matters, but the invisible particle movement is still forming.', lesson: 'Heat gives particles more energy, so they move faster.', lit: false },
    { id: 2, name: 'States of matter', why: 'The difference between a liquid and a gas could be sharper.', lesson: 'Liquids stay close together; gases spread out to fill their space.', lit: false },
    { id: 3, name: 'Evaporation', why: 'You have the big idea and can now connect it to the process name.', lesson: 'Evaporation is when energetic surface particles leave a liquid.', lit: true },
  ] },
  Reading: { question: 'How would you explain the main idea of a story to a friend?', placeholder: 'The story is mostly about...', response: 'You are looking for the story’s big message. Strong readers connect repeated details to one clear main idea.', prompt: 'Look for the detail that keeps coming back to light the next spot.', concepts: [
    { id: 1, name: 'Key details', why: 'You found an interesting detail, but not every detail carries equal weight.', lesson: 'Key details support the bigger message of a text.', lit: false },
    { id: 2, name: 'Theme', why: 'The lesson of the story is close, but needs a little more evidence.', lesson: 'Theme is the message an author wants readers to carry with them.', lit: false },
    { id: 3, name: 'Main idea', why: 'You can summarize what happened and are ready to name what matters most.', lesson: 'The main idea is the most important point the author wants you to understand.', lit: true },
  ] },
}

export default function Diagnose() {
  const [stage, setStage] = useState<'form' | 'loading' | 'results' | 'celebrate'>('form')
  const [topic, setTopic] = useState<TopicKey>('Math')
  const [answer, setAnswer] = useState('')
  const [spots, setSpots] = useState(TOPICS.Math.concepts)
  const [selected, setSelected] = useState<Spot | null>(null)
  const config = TOPICS[topic]
  const lit = spots.filter((spot) => spot.lit).length

  function changeTopic(value: TopicKey) { setTopic(value); setAnswer(''); setSpots(TOPICS[value].concepts); setSelected(null); setStage('form') }
  async function submit() { setStage('loading'); await fetch('/api/illume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic, answer }) }); setTimeout(() => setStage('results'), 700) }
  function light(id: number) { setSpots((current) => current.map((spot) => spot.id === id ? { ...spot, lit: true } : spot)); setSelected(null); if (lit + 1 === spots.length) setTimeout(() => setStage('celebrate'), 350) }

  return <div className="light-flow"><Header /><div className="container-shell py-10 md:py-16">
    {stage === 'form' && <div className="mx-auto max-w-2xl"><Link href="/" className="inline-flex items-center gap-2 text-sm text-muted"><ArrowLeft size={16} /> Dashboard</Link><div className="mt-10"><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo">Diagnostic 01</p><h1 className="font-heading mt-3 text-5xl leading-tight">Show me how you think.</h1><p className="mt-4 text-lg leading-8 text-muted">There are no trick questions here. Explain it in your own words, and we&apos;ll find the exact idea to work on.</p></div><div className="mt-10 space-y-6"><label className="block"><span className="text-sm font-semibold">Topic</span><select value={topic} onChange={(event) => changeTopic(event.target.value as TopicKey)} className="focus-ring mt-2 w-full rounded-2xl border border-indigo/20 bg-white p-4 text-ink"><option>Math</option><option>Science</option><option>Reading</option></select></label><div className="rounded-3xl bg-indigo p-6 text-white"><p className="text-sm text-white/70">Your question</p><p className="font-heading mt-3 text-2xl">{config.question}</p></div><label className="block"><span className="text-sm font-semibold">Your explanation</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={config.placeholder} className="focus-ring mt-2 min-h-40 w-full resize-y rounded-2xl border border-indigo/20 bg-white p-4 text-ink" /></label><button onClick={submit} disabled={!answer.trim()} className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-50">Find my glow spots <ChevronRight size={18} /></button></div></div>}
    {stage === 'loading' && <div className="mx-auto flex max-w-xl flex-col items-center py-20 text-center"><Bud mood="thinking" /><h2 className="font-heading mt-8 text-4xl">Bud is listening closely...</h2><p className="mt-3 text-muted">Looking for the ideas behind your answer.</p></div>}
    {(stage === 'results' || stage === 'celebrate') && <div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-indigo">{topic} diagnostic</p><h1 className="font-heading mt-3 text-5xl">Your learning constellation.</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{config.response}</p></div><Bud mood={stage === 'celebrate' ? 'celebrate' : 'happy'} /></div><div className="mt-10 grid gap-4 md:grid-cols-3">{spots.map((spot) => <button key={spot.id} onClick={() => !spot.lit && setSelected(spot)} className={`text-left ${spot.lit ? 'glow-card' : 'dim-card'}`}><div className="flex items-center justify-between"><span className="text-sm font-semibold">{spot.lit ? 'Lit up' : 'Ready to explore'}</span>{spot.lit ? <Check size={18} /> : <Lightbulb size={18} />}</div><h3 className="font-heading mt-8 text-2xl">{spot.name}</h3><p className="mt-2 text-sm leading-6 opacity-75">{spot.why}</p></button>)}</div>{selected && <div className="mt-6 rounded-3xl border border-indigo/20 bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[.16em] text-indigo">A tiny lesson</p><h2 className="font-heading mt-2 text-2xl">{selected.name}</h2><p className="mt-3 leading-7 text-muted">{selected.lesson}</p><button onClick={() => light(selected.id)} className="button-primary mt-5">I get it <Sparkles size={16} /></button></div>}<div className="mt-8 rounded-3xl bg-navy p-6 text-white"><p className="text-sm text-white/70">Next step</p><p className="mt-2 text-lg">{config.prompt}</p></div></div>}
  </div></div>
}

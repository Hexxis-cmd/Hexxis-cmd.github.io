import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'hexxis-sound-enabled'

function noiseBuffer(context, seconds = 2) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1
  return buffer
}

function tone(context, destination, frequency, duration, volume = 0.025, type = 'sine', delay = 0) {
  const start = context.currentTime + delay
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain).connect(destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)
}

function createEngine() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  const context = new AudioContext()
  const master = context.createGain()
  master.gain.value = 0.72
  master.connect(context.destination)
  return { context, master, cleanups: [] }
}

function stopAmbience(engine) {
  engine?.cleanups.splice(0).forEach((cleanup) => cleanup())
}

function addWind(engine, { low = 90, high = 760, volume = 0.045, rumble = false } = {}) {
  const { context, master } = engine
  const source = context.createBufferSource()
  const filter = context.createBiquadFilter()
  const gain = context.createGain()
  const lfo = context.createOscillator()
  const lfoGain = context.createGain()
  source.buffer = noiseBuffer(context, 4)
  source.loop = true
  filter.type = 'bandpass'
  filter.frequency.value = (low + high) / 2
  filter.Q.value = 0.55
  gain.gain.value = volume
  lfo.frequency.value = 0.075
  lfoGain.gain.value = volume * 0.32
  lfo.connect(lfoGain).connect(gain.gain)
  source.connect(filter).connect(gain).connect(master)
  source.start()
  lfo.start()

  let rumbleOscillator
  if (rumble) {
    rumbleOscillator = context.createOscillator()
    const rumbleGain = context.createGain()
    rumbleOscillator.type = 'sine'
    rumbleOscillator.frequency.value = 43
    rumbleGain.gain.value = 0.012
    rumbleOscillator.connect(rumbleGain).connect(master)
    rumbleOscillator.start()
  }

  engine.cleanups.push(() => {
    source.stop()
    lfo.stop()
    rumbleOscillator?.stop()
  })
}

function addMotif(engine, notes, interval = 7000, volume = 0.014, type = 'sine') {
  const play = () => notes.forEach((note, index) => tone(engine.context, engine.master, note, 0.65, volume, type, index * 0.42))
  const timer = window.setInterval(play, interval)
  play()
  engine.cleanups.push(() => clearInterval(timer))
}

function addFireplace(engine) {
  const { context, master } = engine
  addWind(engine, { low: 70, high: 330, volume: 0.022 })
  let timer
  const crackle = () => {
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    const now = context.currentTime
    source.buffer = noiseBuffer(context, 0.06)
    filter.type = 'bandpass'
    filter.frequency.value = 700 + Math.random() * 1800
    gain.gain.setValueAtTime(0.018 + Math.random() * 0.026, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055)
    source.connect(filter).connect(gain).connect(master)
    source.start(now)
    timer = window.setTimeout(crackle, 170 + Math.random() * 520)
  }
  crackle()
  engine.cleanups.push(() => clearTimeout(timer))
}

function addFireworks(engine) {
  const { context, master } = engine
  let timer
  let lastVariant = -1
  const burst = () => {
    let variant = Math.floor(Math.random() * 4)
    if (variant === lastVariant) variant = (variant + 1) % 4
    lastVariant = variant
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()
    const now = context.currentTime
    source.buffer = noiseBuffer(context, 0.8)
    filter.type = 'bandpass'
    filter.frequency.value = [160, 220, 310, 420][variant]
    filter.Q.value = 0.7
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.025)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75)
    source.connect(filter).connect(gain).connect(master)
    source.start(now)
    timer = window.setTimeout(burst, 4500 + Math.random() * 4000)
  }
  timer = window.setTimeout(burst, 1800)
  engine.cleanups.push(() => clearTimeout(timer))
}

function startAmbience(engine, themeId) {
  stopAmbience(engine)
  if (themeId === 'halloween') addWind(engine, { low: 55, high: 620, volume: 0.055, rumble: true })
  if (themeId === 'christmas' || themeId === 'kwanzaa') {
    addWind(engine, { low: 180, high: 1100, volume: 0.025 })
    addMotif(engine, [523.25, 659.25, 783.99, 659.25], 9200, 0.012, 'triangle')
  }
  if (themeId === 'new-year') {
    addWind(engine, { low: 130, high: 950, volume: 0.032, rumble: true })
    addMotif(engine, [392, 523.25, 659.25], 11000, 0.01, 'triangle')
  }
  if (themeId === 'thanksgiving') addFireplace(engine)
  if (themeId === 'st-patrick') addMotif(engine, [587.33, 659.25, 783.99, 880, 783.99], 9000, 0.012, 'sine')
  if (themeId === 'independence-day') addFireworks(engine)
}

function playClick(engine) {
  if (!engine || engine.context.state !== 'running') return
  const { context, master } = engine
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime
  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(185, now)
  oscillator.frequency.exponentialRampToValueAtTime(92, now + 0.075)
  gain.gain.setValueAtTime(0.035, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085)
  oscillator.connect(gain).connect(master)
  oscillator.start(now)
  oscillator.stop(now + 0.09)
}

function playChime(engine) {
  tone(engine.context, engine.master, 440, 0.32, 0.025, 'sine')
  tone(engine.context, engine.master, 659.25, 0.42, 0.018, 'triangle', 0.085)
}

function playPartyBlower(engine) {
  const { context, master } = engine
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(160, now)
  oscillator.frequency.exponentialRampToValueAtTime(560, now + 0.38)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.028, now + 0.035)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
  oscillator.connect(gain).connect(master)
  oscillator.start(now)
  oscillator.stop(now + 0.45)
}

export function useSoundscape(themeId) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const engineRef = useRef(null)
  const startedRef = useRef(false)
  const themeRef = useRef(themeId)

  const start = useCallback(async () => {
    if (!engineRef.current) engineRef.current = createEngine()
    const engine = engineRef.current
    if (!engine) return null
    if (engine.context.state !== 'running') await engine.context.resume()
    if (!startedRef.current) {
      startedRef.current = true
      startAmbience(engine, themeRef.current)
      if (themeRef.current === 'new-year') playPartyBlower(engine)
    }
    return engine
  }, [])

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabled(false)
      localStorage.setItem(STORAGE_KEY, 'false')
      stopAmbience(engineRef.current)
      await engineRef.current?.context.suspend()
      startedRef.current = false
      return
    }
    setEnabled(true)
    localStorage.setItem(STORAGE_KEY, 'true')
    const engine = await start()
    if (engine) playChime(engine)
  }, [enabled, start])

  useEffect(() => {
    if (!enabled) return undefined
    const interact = async (event) => {
      const engine = await start()
      if (event.target.closest?.('a, button, [role="button"]')) playClick(engine)
    }
    document.addEventListener('pointerdown', interact, true)
    document.addEventListener('keydown', interact, true)
    return () => {
      document.removeEventListener('pointerdown', interact, true)
      document.removeEventListener('keydown', interact, true)
    }
  }, [enabled, start])

  useEffect(() => {
    themeRef.current = themeId
    if (enabled && startedRef.current && engineRef.current) startAmbience(engineRef.current, themeId)
  }, [enabled, themeId])

  useEffect(() => () => {
    stopAmbience(engineRef.current)
    engineRef.current?.context.close()
  }, [])

  return { enabled, toggle }
}

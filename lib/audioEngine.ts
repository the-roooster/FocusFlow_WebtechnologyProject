/**
 * Procedural Audio Engine for FocusFlow
 *
 * Generates ambient sounds using the Web Audio API.
 * No external audio files — everything is synthesized for offline-first.
 *
 * White Noise = random samples
 * Rain = filtered noise bursts with resonance
 * Forest = layered sine waves with slow LFO modulation
 * Café = brown noise + subtle high-frequency chatter
 */

type SoundType = 'none' | 'white' | 'rain' | 'forest' | 'cafe'

class AudioEngine {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private sources: AudioNode[] = []
  private currentType: SoundType = 'none'
  private _volume = 0.5
  private fadeMs = 300

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioContext()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  get volume() {
    return this._volume
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v))
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(this._volume, this.getContext().currentTime, 0.05)
    }
  }

  play(type: SoundType) {
    if (type === 'none') {
      this.stop()
      return
    }
    // If same type is already playing, do nothing
    if (this.currentType === type && this.sources.length > 0) return

    this.stop()
    this.currentType = type

    const ctx = this.getContext()
    this.gainNode = ctx.createGain()
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime)
    this.gainNode.gain.linearRampToValueAtTime(this._volume, ctx.currentTime + this.fadeMs / 1000)
    this.gainNode.connect(ctx.destination)

    switch (type) {
      case 'white':
        this.playWhiteNoise(ctx)
        break
      case 'rain':
        this.playRain(ctx)
        break
      case 'forest':
        this.playForest(ctx)
        break
      case 'cafe':
        this.playCafe(ctx)
        break
    }
  }

  stop() {
    if (this.gainNode && this.ctx) {
      const now = this.ctx.currentTime
      this.gainNode.gain.setTargetAtTime(0, now, this.fadeMs / 3000)
    }
    // Clean up after fade
    setTimeout(() => {
      this.sources.forEach((s) => {
        try {
          if (s instanceof AudioBufferSourceNode) s.stop()
          if (s instanceof OscillatorNode) s.stop()
          s.disconnect()
        } catch {
          // Already stopped
        }
      })
      this.sources = []
      this.gainNode?.disconnect()
      this.gainNode = null
    }, this.fadeMs + 50)
    this.currentType = 'none'
  }

  /**
   * Play a gentle G-major chime (session completion sound).
   * Notes: G4 (392Hz), B4 (494Hz), D5 (587Hz)
   */
  playChime() {
    const ctx = this.getContext()
    const chimeGain = ctx.createGain()
    chimeGain.gain.setValueAtTime(0.3, ctx.currentTime)
    chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0)
    chimeGain.connect(ctx.destination)

    const freqs = [392, 494, 587] // G4, B4, D5
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      const delay = i * 0.12
      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0, ctx.currentTime)
      oscGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + delay + 0.05)
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 2.0)
      osc.connect(oscGain)
      oscGain.connect(chimeGain)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 2.5)
    })
  }

  isPlaying(): boolean {
    return this.currentType !== 'none' && this.sources.length > 0
  }

  getCurrentType(): SoundType {
    return this.currentType
  }

  // ── Procedural sound generators ──

  private playWhiteNoise(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Gentle low-pass to soften
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(6000, ctx.currentTime)
    filter.Q.setValueAtTime(0.5, ctx.currentTime)

    source.connect(filter)
    filter.connect(this.gainNode!)
    source.start()
    this.sources.push(source, filter)
  }

  private playRain(ctx: AudioContext) {
    // Base: heavy filtered noise
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Band-pass to simulate rain patter
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(3000, ctx.currentTime)
    bp.Q.setValueAtTime(0.8, ctx.currentTime)

    // Low rumble layer
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(400, ctx.currentTime)
    lp.Q.setValueAtTime(1, ctx.currentTime)

    const rumbleGain = ctx.createGain()
    rumbleGain.gain.setValueAtTime(0.4, ctx.currentTime)

    // LFO for rain variation
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.15, ctx.currentTime)
    const lfoGain = ctx.createGain()
    lfoGain.gain.setValueAtTime(800, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(bp.frequency)
    lfo.start()

    source.connect(bp)
    bp.connect(this.gainNode!)
    source.connect(lp)
    lp.connect(rumbleGain)
    rumbleGain.connect(this.gainNode!)

    source.start()
    this.sources.push(source, bp, lp, rumbleGain, lfo, lfoGain)
  }

  private playForest(ctx: AudioContext) {
    // Layered soft tones simulating wind + birds
    const windBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const windData = windBuffer.getChannelData(0)
    for (let i = 0; i < windData.length; i++) {
      windData[i] = Math.random() * 2 - 1
    }

    const wind = ctx.createBufferSource()
    wind.buffer = windBuffer
    wind.loop = true

    const windFilter = ctx.createBiquadFilter()
    windFilter.type = 'lowpass'
    windFilter.frequency.setValueAtTime(500, ctx.currentTime)
    windFilter.Q.setValueAtTime(2, ctx.currentTime)

    // Slow LFO on wind filter for breathing effect
    const windLfo = ctx.createOscillator()
    windLfo.type = 'sine'
    windLfo.frequency.setValueAtTime(0.08, ctx.currentTime)
    const windLfoGain = ctx.createGain()
    windLfoGain.gain.setValueAtTime(200, ctx.currentTime)
    windLfo.connect(windLfoGain)
    windLfoGain.connect(windFilter.frequency)
    windLfo.start()

    const windVol = ctx.createGain()
    windVol.gain.setValueAtTime(0.6, ctx.currentTime)

    wind.connect(windFilter)
    windFilter.connect(windVol)
    windVol.connect(this.gainNode!)
    wind.start()

    // Bird-like high sine chirps (subtle)
    const birdOsc = ctx.createOscillator()
    birdOsc.type = 'sine'
    birdOsc.frequency.setValueAtTime(2200, ctx.currentTime)
    const birdLfo = ctx.createOscillator()
    birdLfo.type = 'sine'
    birdLfo.frequency.setValueAtTime(5, ctx.currentTime)
    const birdLfoGain = ctx.createGain()
    birdLfoGain.gain.setValueAtTime(400, ctx.currentTime)
    birdLfo.connect(birdLfoGain)
    birdLfoGain.connect(birdOsc.frequency)
    const birdVol = ctx.createGain()
    birdVol.gain.setValueAtTime(0.05, ctx.currentTime)
    birdOsc.connect(birdVol)
    birdVol.connect(this.gainNode!)
    birdOsc.start()
    birdLfo.start()

    this.sources.push(wind, windFilter, windLfo, windLfoGain, windVol, birdOsc, birdLfo, birdLfoGain, birdVol)
  }

  private playCafe(ctx: AudioContext) {
    // Brown noise (warm, muffled)
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Warm low-pass
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(2000, ctx.currentTime)

    // Subtle chatter layer (high filtered noise, very quiet)
    const chatterBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const chatterData = chatterBuffer.getChannelData(0)
    for (let i = 0; i < chatterData.length; i++) {
      chatterData[i] = Math.random() * 2 - 1
    }
    const chatter = ctx.createBufferSource()
    chatter.buffer = chatterBuffer
    chatter.loop = true

    const chatterBp = ctx.createBiquadFilter()
    chatterBp.type = 'bandpass'
    chatterBp.frequency.setValueAtTime(1500, ctx.currentTime)
    chatterBp.Q.setValueAtTime(3, ctx.currentTime)

    const chatterVol = ctx.createGain()
    chatterVol.gain.setValueAtTime(0.08, ctx.currentTime)

    // LFO to modulate chatter presence
    const chatterLfo = ctx.createOscillator()
    chatterLfo.type = 'sine'
    chatterLfo.frequency.setValueAtTime(0.3, ctx.currentTime)
    const chatterLfoGain = ctx.createGain()
    chatterLfoGain.gain.setValueAtTime(0.05, ctx.currentTime)
    chatterLfo.connect(chatterLfoGain)
    chatterLfoGain.connect(chatterVol.gain)
    chatterLfo.start()

    source.connect(lp)
    lp.connect(this.gainNode!)
    chatter.connect(chatterBp)
    chatterBp.connect(chatterVol)
    chatterVol.connect(this.gainNode!)

    source.start()
    chatter.start()

    this.sources.push(source, lp, chatter, chatterBp, chatterVol, chatterLfo, chatterLfoGain)
  }
}

// Singleton
export const audioEngine = new AudioEngine()

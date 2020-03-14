// const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const audioCtx = new (window.AudioContext)()

export interface Oscillator {
  (arg0: string): void
  play: (frequency?: number) => void
  stop: (frequency?: number) => void
  volume: (volume: number) => void
}

/*
*   Create FX nodes
*/

// AnalyserNode
const analyser = audioCtx.createAnalyser()

// BiquadFilterNode
const biquadFilter = audioCtx.createBiquadFilter()
biquadFilter.type = 'lowshelf'
biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime)
biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime)

// ConvolverNode
const convolver = audioCtx.createConvolver()

// DelayNode
const delay = audioCtx.createDelay(5.0)
delay.delayTime.setValueAtTime(1, audioCtx.currentTime)

// DynamicsCompressorNode
const compressor = audioCtx.createDynamicsCompressor()
compressor.threshold.setValueAtTime(-50, audioCtx.currentTime)
compressor.knee.setValueAtTime(40, audioCtx.currentTime)
compressor.ratio.setValueAtTime(12, audioCtx.currentTime)
compressor.attack.setValueAtTime(0, audioCtx.currentTime)
compressor.release.setValueAtTime(0.25, audioCtx.currentTime)

// GainNode
const gainNode = audioCtx.createGain()
gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime) // Set default volume

// IIRFilterNode
const filterNumber = 2
const lowPassCoefs = [
  {
    frequency: 200,
    feedforward: [0.00020298, 0.0004059599, 0.00020298],
    feedback: [1.0126964558, -1.9991880801, 0.9873035442]
  },
  {
    frequency: 500,
    feedforward: [0.0012681742, 0.0025363483, 0.0012681742],
    feedback: [1.0317185917, -1.9949273033, 0.9682814083]
  },
  {
    frequency: 1000,
    feedforward: [0.0050662636, 0.0101325272, 0.0050662636],
    feedback: [1.0632762845, -1.9797349456, 0.9367237155]
  },
  {
    frequency: 5000,
    feedforward: [0.1215955842, 0.2431911684, 0.1215955842],
    feedback: [1.2912769759, -1.5136176632, 0.7087230241]
  }
]
const feedForward = lowPassCoefs[filterNumber].feedforward
const feedBack = lowPassCoefs[filterNumber].feedback
const iirfilter = audioCtx.createIIRFilter(feedForward, feedBack)

// WaveShaperNode
const distortion = audioCtx.createWaveShaper()
const makeDistortionCurve = (amount): Float32Array => {
  const k = typeof amount === 'number' ? amount : 50
  const nSamples = 44100
  const curve = new Float32Array(nSamples)
  const deg = Math.PI / 180
  let i = 0
  let x
  for (; i < nSamples; ++i) {
    x = i * 2 / nSamples - 1
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
  }
  return curve
}
distortion.curve = makeDistortionCurve(4000)
distortion.oversample = '4x'

export type Node =
  AnalyserNode |
  ConvolverNode |
  GainNode |
  BiquadFilterNode |
  DelayNode |
  DynamicsCompressorNode |
  IIRFilterNode |
  WaveShaperNode |
  AudioDestinationNode

export type ConnectNodes = (nodes: Node[]) => Node
export type DisconnectNodes = (nodes: Node[]) => void

// Allows us to connect the nodes by including them  in a n array
// Makes it easier to tinker with the effects
const connectNodes: ConnectNodes = (nodes) => {
  nodes.forEach((node, index) => {
    const nextNode = nodes[index + 1]
    if (nextNode !== undefined) {
      node.connect(nextNode)
    }
  })
  // Return first node
  return nodes[0]
}
// Just in case we want to disconnect the nodes so we can reconnect them in a different way later
const disconnectNodes: DisconnectNodes = (nodes) => {
  nodes.forEach((node, index) => {
    const nextNode = nodes[index + 1]
    if (nextNode !== undefined) {
      node.disconnect(nextNode)
    }
  })
}

// Chain FX Nodes
const effectsChain = connectNodes([
  analyser,
  distortion,
  biquadFilter,
  // delay,
  // convolver, // reverb
  iirfilter,
  compressor,
  gainNode,
  audioCtx.destination
])

const oscillatorNodes = {}

const synth: Oscillator = (myString) => {
  return {

  }
}

synth.play = (frequency = 440): void => {
  // PeriodicWave optional
  const real = new Float32Array(2)
  const imag = new Float32Array(2)
  real[0] = 0
  imag[0] = 0
  real[1] = 1
  imag[1] = 0
  const wave = audioCtx.createPeriodicWave(real, imag, { disableNormalization: true })

  const oscillatorNode = audioCtx.createOscillator()
  oscillatorNode.type = 'square'
  oscillatorNode.frequency.setValueAtTime(frequency, audioCtx.currentTime)
  oscillatorNode.setPeriodicWave(wave)
  oscillatorNode.connect(effectsChain)
  oscillatorNode.start()
  oscillatorNodes[frequency] = oscillatorNode
}

synth.stop = (frequency = 440): void => {
  if (Object.prototype.hasOwnProperty.call(oscillatorNodes, frequency)) {
    oscillatorNodes[frequency].stop(audioCtx.currentTime)
  }
}

synth.volume = (volume): void => {
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime)
}

export default synth

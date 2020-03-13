// const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const audioCtx = new (window.AudioContext)()

export interface Oscillator {
  (arg0: string): void
  play: (frequency?: number) => void
  stop: (frequency?: number) => void
}

// Create FX nodes
const gainNode = audioCtx.createGain()
// Set default volume
gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime)

// Chain FX Nodes
gainNode.connect(audioCtx.destination)

const oscillatorNodes = {}

const synth: Oscillator = (myString) => {
  return {

  }
}

synth.play = (frequency = 440): void => {
  const oscillatorNode = audioCtx.createOscillator()
  oscillatorNode.type = 'square'
  oscillatorNode.frequency.setValueAtTime(frequency, audioCtx.currentTime)
  oscillatorNode.connect(gainNode)
  oscillatorNode.start()
  oscillatorNodes[frequency] = oscillatorNode
}

synth.stop = (frequency = 440): void => {
  if (Object.prototype.hasOwnProperty.call(oscillatorNodes, frequency)) {
    oscillatorNodes[frequency].stop(audioCtx.currentTime)
  }
}

export default synth

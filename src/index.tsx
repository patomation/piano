import * as React from 'react'
import { render } from 'react-dom'
import { useState, FormEvent, ReactElement } from 'react'
import Piano from './components/Piano'
import './sass/main.scss'
import './images/icons/favicon.ico'
import synth from './synth'

// Disable Context Menu
// document.addEventListener('contextmenu', event => event.preventDefault())

if (module && module.hot) {
  module.hot.accept()
}

export type PlayNote = (frequency: number) => void
export type ReleaseNote = (frequency: number) => void

const playNote: PlayNote = (frequency) => {
  synth.play(frequency)
}
const releaseNote: ReleaseNote = (frequency): void => {
  synth.stop(frequency)
}

const App = (): ReactElement => {
  const [masterVolume, setMasterVolume] = useState(0.25)
  const [startOctive, setStartOctive] = useState(3)
  const [totalOctives, setTotalOctives] = useState(2)
  const [bass, setBass] = useState(0)
  const [middle, setMiddle] = useState(0)
  const [treble, setTreble] = useState(0)
  const [presence, setPresence] = useState(0)

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ width: '100%' }}>
        <label>Master Volume</label>
        <input type="range"
          min="0" max="1" step="0.05"
          value={masterVolume}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setMasterVolume(e.target.valueAsNumber)
          }}
        />
        <label>Start Octive</label>
        <input type="range"
          min="1" max="7" step="1"
          value={startOctive}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setStartOctive(e.target.valueAsNumber)
          }}
        />
        <label>Display Octives</label>
        <input type="range"
          min="1" max="7" step="1"
          value={totalOctives}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setTotalOctives(e.target.valueAsNumber)
          }}
        />
      </div>
      <div style={{ width: '100%' }}>
        <label>Bass</label>
        <input type="range"
          min="-40" max="40" step="1"
          value={bass}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setBass(e.target.valueAsNumber)
          }}/>
        <label>Middle</label>
        <input type="range"
          min="-40" max="40" step="1"
          value={middle}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setMiddle(e.target.valueAsNumber)
          }}/>
        <label>Treble</label>
        <input type="range"
          min="-40" max="40" step="1"
          value={treble}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setTreble(e.target.valueAsNumber)
          }}/>
        <label>Presence</label>
        <input type="range"
          min="-40" max="40" step="1"
          value={presence}
          onChange={ (e: FormEvent<HTMLInputElement>): void => {
            setPresence(e.target.valueAsNumber)
          }}/>
      </div>

      <Piano
        onDown={(frequency: number): void => {
          playNote(frequency)
        }}
        onUp={(frequency: number): void => {
          releaseNote(frequency)
        }}
        totalOctives={totalOctives}
        startOctive={startOctive}
      />
    </div>
  )
}

render(<App/>,
  document.getElementById('root')
)

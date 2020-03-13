import * as React from 'react'
import { useEffect, ReactElement } from 'react'
// import hotkey from '@patomation/hotkey/lib/index.esm.js'
import hotkey from '@patomation/hotkey'

export interface PianoProps {
  onDown: (arg0: number) => void
  onUp: (arg0?: number) => void
  startOctive?: number
  totalOctives?: number
}
export type GetFrequency = (arg0?: number, arg1?: number) => number
export interface PianoKey {
  note: string,
  frequency: number,
  kind: 'black' | 'white'
}
export type GeneratePiano = (arg0?: number, arg1?: number) => PianoKey[]

export const getFrequency: GetFrequency = (halfSteps = 0, fixedFrequency = 440) => {
  const twelthRootOfTwo = Math.pow(2, (1 / 12))
  return (fixedFrequency * Math.pow(twelthRootOfTwo, halfSteps))
}
const C1frequency: number = getFrequency(-45, 440) // C1 frequency based on A1 being 440 hz = 32.703195662574814

export const generatePiano: GeneratePiano = (startOctive = 1, totalOctives = 1) => {
  const notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
  ]
  const blackKeys = [1, 3, 6, 8, 10]
  const startIndex = 0 + ((startOctive - 1) * 12)
  const endIndex = startIndex + (12 * totalOctives)
  const array = []
  for (let i = startIndex; i < endIndex; i++) {
    const currentOctive = Math.floor(i / 12) + 1
    const step = i - ((currentOctive - 1) * 12)
    array.push({
      note: `${notes[step]}${currentOctive}`,
      frequency: getFrequency(i, C1frequency).toFixed(4),
      kind: blackKeys.includes(step) ? 'black' : 'white'
    })
  }
  return array
}

const hotkeyConfig = [
  'z', 's', 'x', 'd', 'c', 'v', 'g', 'b', 'h', 'n', 'j', 'm'
]

const Piano = ({
  onDown,
  onUp,
  totalOctives = 1,
  startOctive = 1
}: PianoProps): ReactElement => {
  // Piano Data
  const piano = generatePiano(startOctive, totalOctives)

  useEffect(() => {
    // assign hotkeys
    hotkeyConfig.forEach((key, index) => {
      hotkey(key)
        .down(() => {
          const { frequency } = piano[index]
          onDown(frequency)
        })
        .up(() => {
          onUp()
        })
    })
  }, [hotkey, piano])

  const width = 100 / (7 * totalOctives)
  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%'
    }}>
      {piano.map(({ note, frequency, kind }, index) =>
        <button
          key={note}
          style={{
            width: `${width}%`,
            display: 'flex',
            borderRadius: '0 0 8px 8px',
            border: 'none',
            alignItems: 'end',
            justifyContent: 'center',
            ...(kind === 'black'
              ? {
                background: '#000',
                color: '#fff',
                marginLeft: `${-(width / 2)}%`,
                marginRight: `${-(width / 2)}%`,
                height: '50%',
                zIndex: 100,
                position: 'relative',
                top: '0',
                border: '1px solid #fff'
              } : {
                background: '#fff',
                color: '#000',
                height: '100%',
                border: '1px solid #333'
              })
          }}
          onMouseDown={(): void => {
            onDown(frequency)
          }}
          onMouseUp={(): void => {
            onUp()
          }}
        >
          <div>
            <div>
              {hotkeyConfig[index]}
            </div>
            <div>
              {note}
            </div>
          </div>

        </button>
      )}
    </div>
  )
}

export default Piano

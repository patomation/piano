import * as React from 'react'
import { mount } from 'enzyme'
import Piano from './Piano'
jest.mock('xsound')

describe('<Piano />', () => {
  it('renders', () => {
    mount(<Piano onDown={(): void => { /* */ }} onUp={(): void => { /* */ }} />)
  })
})

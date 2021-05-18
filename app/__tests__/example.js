import React from 'react'
//import App from './App'
import PhotoBox from '../Components/Custom/PhotoBox'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(<PhotoBox />).toJSON()
  //const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})

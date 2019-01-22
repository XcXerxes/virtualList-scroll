import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'
import './index.css'
import {of, Rx} from 'rxjs'

const data =  Array.from({length: 50}).map((_, i) => i)
debugger
ReactDOM.render(<App propsData={of(data)}  />, document.getElementById('root'))

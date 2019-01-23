import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'
import './index.css'
import {of, Rx} from 'rxjs'

const data =  Array.from({length: 50}).map((_, i) => i)
ReactDOM.render(<App 
  data$={of(data)} options$={of({height: 60})}  
  style={{height: 400, border: '1px solid #f2f2f2'}}
  />, document.getElementById('root'))

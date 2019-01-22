import React from 'react'
import styles from './App.module.css'
import {BehaviorSubject, combineLatest, of} from 'rxjs'
import {map} from 'rxjs/operators'

export default class App extends React.PureComponent{
  containerHeight$ = new BehaviorSubject(400)
  options$ = of({height: 60})

  state = {
    data: []
  }

  componentDidMount() {
    const actualRows = combineLatest(this.containerHeight$, this.options$)
      .pipe(map(([ch, {height}]) => {
        return Math.ceil(ch / height)
      }))
    const dataInViewSlice$ = combineLatest(this.props.propsData, actualRows)
      .pipe(map(([data, actualRows]) => {
        debugger
        return data.slice(0, actualRows)
      }))
    console.log(this.props.propsData)

    dataInViewSlice$.subscribe((data, _) => {
      console.log(data)
      this.setState({data})
    })
  }
  render() {
    const {data} = this.state
    console.log()
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {data.map((data, key) => (
            <div key={key} className={styles.className} >
              {data}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

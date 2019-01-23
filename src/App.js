import React from "react"
import styles from "./App.module.css"
import { BehaviorSubject, combineLatest, of, fromEvent } from "rxjs"
import { map, startWith, filter, tap } from "rxjs/operators"

export default class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      scrollHeight: 0
    }
    this.virtualEle = React.createRef()
  }
  containerHeight$ = new BehaviorSubject(0)
  lastFirstIndex = -1

  componentDidMount() {
    const virtuaElm = this.virtualEle.current
    const { options$, data$ } = this.props
    const actualRows = combineLatest(this.containerHeight$, options$).pipe(
      map(([ch, { height }]) => {
        return Math.ceil(ch / height + 3)
      })
    )
    // 滚动事件流 监听
    const scrollEvent$ = fromEvent(virtuaElm, "scroll").pipe(
      startWith({ target: { scrollTop: 0 } })
    )
    const shouldUpdate$ = combineLatest(
      scrollEvent$.pipe(map(() => virtuaElm.scrollTop)),
      options$,
      actualRows
    ).pipe(
      // 计算当前列表中最顶部的索引
      map(([st, { height }, actualRows]) => {
        return [Math.floor(st / height), actualRows]
      }),
      filter(([currentIndex]) => currentIndex != this.lastFirstIndex),
      tap(([currentIndex]) => {
        console.log(currentIndex, this.lastFirstIndex)
        this.lastFirstIndex = currentIndex
      }),
      map(([firstIndex, actualRows]) => {
        const lastIndex =  firstIndex + actualRows - 1
        return [firstIndex, lastIndex]
      })
    )
    const dataInViewSlice$ = combineLatest(data$, options$, shouldUpdate$).pipe(
      map(([data, {height}, [firstIndex, lastIndex]]) => {
        return data.slice(firstIndex, lastIndex).map(item => ({
          origin: item,
          $pos: firstIndex * height,
          $index: firstIndex++
        }))
      })
    )
    const scrollHeight$ = combineLatest(data$, options$).pipe(
      map(([data, { height }]) => data.length * height)
    )
    this.containerHeight$.next(virtuaElm.clientHeight)
    dataInViewSlice$.subscribe((data, _) => {
      this.setState({ data })
    })
    scrollHeight$.subscribe((scrollHeight, _) => {
      this.setState({ scrollHeight })
    })
  }
  render() {
    const { style } = this.props
    const { data, scrollHeight } = this.state
    return (
      <div className={styles.wrapper} ref={this.virtualEle} style={style}>
        <div className={styles.container} style={{ height: scrollHeight }}>
          {data.map((data, i) => (
            <div
              key={i}
              className={styles.placeholder}
              style={{ top: `${data.$pos}px` }}
            >
              {data.origin}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

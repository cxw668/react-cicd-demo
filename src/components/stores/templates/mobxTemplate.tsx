import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"

class Timer {
  secondsPassed = 0

  constructor() {
    makeAutoObservable(this)
  }

  increaseTimer() {
    this.secondsPassed += 1
  }
}

const myTimer = new Timer()

// A function component wrapped with `observer` will react
// to any future change in an observable it used before.
const TimerView = observer(({ timer }: { timer: Timer }) => <span>Seconds passed: {timer.secondsPassed}</span>)

export function MobxTemplate() {

  useEffect(() => {
    const interval = setInterval(() => {
      myTimer.increaseTimer()
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <TimerView timer={myTimer} />
    </>
  )
}
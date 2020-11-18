import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  forOf,
  createTimeout
} from "./broadcasters"
import {  targetValue, mapSequence, hardCode} from "./operators"

let message = "Hi, my name is Zhen".split(" ")
let delayMessage = value => hardCode(value)(createTimeout(500))
let broadcaster = mapSequence(delayMessage)(forOf(message))

let App = () => {
  let onInput = useListener()
  let state = useBroadcaster(broadcaster)
  return (
    <div>
      <input type="text" onInput={onInput} />
      <br/>
      {state}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
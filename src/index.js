import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener
} from "./broadcasters"
import {  targetValue} from "./operators"

let App = () => {
  let onInput = useListener()
  let inputValueBroadcaster = targetValue(onInput)
  let state = useBroadcaster(inputValueBroadcaster)
  return (
    <div>
      <input type="text" onInput={onInput} />
      {state}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
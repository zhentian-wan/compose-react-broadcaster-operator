import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  forOf,
  createTimeout
} from "./broadcasters"
import {  hardCode, targetValue, waitFor, mapSequence, mapBroadcaster} from "./operators"
import {pipe} from "lodash/fp"

let App = () => {
  let onInput = useListener()
  let inputValue = targetValue(onInput)

  let messages = message => forOf(message.split(" "))
  let delayMessage = value => hardCode(value)(createTimeout(500))
  let messageSequence = msg => mapSequence(delayMessage)(messages(msg))

  let broadcaster = pipe(
    waitFor(500),
    mapBroadcaster(messageSequence)
  )(inputValue)
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
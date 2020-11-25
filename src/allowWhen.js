import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  forOf,
  createTimeout
} from "./broadcasters"
import {  hardCode, targetValue, allowWhen, filterByKey, mapSequence, mapBroadcaster} from "./operators"
import {pipe} from "lodash/fp"



let App = () => {
  let onInput = useListener()
  let onKeyPress = useListener()
  let inputValue = targetValue(onInput)
  let enter = filterByKey("Enter")(onKeyPress)

  let messages = message => forOf(message.split(" "))
  let delayMessage = value => hardCode(value)(createTimeout(500))
  let messageSequence = msg => mapSequence(delayMessage)(messages(msg))

  let broadcaster = pipe(
    allowWhen(enter),
    mapBroadcaster(messageSequence)
  )(inputValue)
  let state = useBroadcaster(broadcaster)

  return (
    <div>
      <input type="text" onInput={onInput} onKeyPress={onKeyPress} />
      <br/>
      {state}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
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


export let mapError = transform => broadcaster => listener => {
  return broadcaster((value) => {
    if (value instanceof Error) {
      listener(transform(value))
      return
    }
    listener(value)
  })
}

let getUrl = url => listener => {
  let controller = new AbortController()
  let signal = controller.signal
  fetch(url, {signal})
    .then((response) => {
        return response.json()
    })
    .then(listener)
    .catch(listener)

    return () => {
      controller.abort()
    }
}

let cancel = mapError(error => ({
  login: error.message
}))(getUrl("https://api.github.com/users/zhentian-wan"))
(console.log)
cancel()

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
  let profile = useBroadcaster(
    getUrl("https://api.github.com/users/zhentian-wan"),
    {login: ""}
  )

  return (
    <div>
      <input type="text" onInput={onInput} />
      <br/>
      {state}
      { profile.login}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
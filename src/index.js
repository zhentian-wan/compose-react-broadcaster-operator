import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  getUrl,
  useListener,
} from "./broadcasters"
import { map, filter, mapBroadcaster} from "./operators"
import {pipe} from "lodash/fp"
import { head } from "lodash"

let share = () => {
  let listeners = [];
  let cancel;

  return broadcaster => {
    if (!cancel) {
    // this block of code will run last
      cancel = broadcaster(value => {
        listeners.forEach(l => l(value))
      });
    }

    return listener => {
      // this block of code will run mult times
      listeners.push(listener);
      return () => {
        cancel()
      }
    }
  }
}

let getWord = pipe(
  mapBroadcaster(event => pipe(
    map(head)
  )(getUrl('https://random-word-api.herokuapp.com/word'))),
  share()
)

let App = () => {
  let onClick = useListener()
  let word = useBroadcaster(getWord(onClick))
  let anotherWord = useBroadcaster(getWord(onClick))
  return (
    <div>
      <button onClick={onClick}>Click</button>
      <p>{word}</p>
      <p>{anotherWord}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
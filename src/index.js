import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  getUrl,
} from "./broadcasters"
import { map, filter} from "./operators"
import {pipe} from "lodash/fp"
import { head } from "lodash"

let share = () => {
  let listeners = [];
  let cancel;
  return broadcaster => {
    // this block of code will run last
    cancel = broadcaster(value => {
      listeners.forEach(l => l(value))
    });
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
  map(head),
  share()
)(getUrl('https://random-word-api.herokuapp.com/word'))

let App = () => {

  let word = useBroadcaster(getWord)
  let anotherWord = useBroadcaster(getWord)
  let anotherWord2 = useBroadcaster(getWord)
  return (
    <div>
      <p>{word}</p>
      <p>{anotherWord}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
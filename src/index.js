import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  getUrl,
  useListener,
  combine,
} from "./broadcasters"
import { map, share, targetValue, filter} from "./operators"
import {pipe, every, isString} from "lodash/fp"
import { head  } from "lodash"

let getWord = pipe(
    map(head),
    share()
  )(getUrl('https://random-word-api.herokuapp.com/word'))

let gameLogic = pipe(
  filter(every(isString)),
  map(([guess, word]) => {
    return Array.from(word).map(c => guess.includes(c) ? c: "*").join("")
  })
)

let App = () => {
  let onInput = useListener();
  let gameBroadcaster = gameLogic(combine(targetValue(onInput), getWord))
  let word = useBroadcaster(getWord)
  let game = useBroadcaster(gameBroadcaster, "")
  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>
        {word}
      </p>
      <p>{game}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
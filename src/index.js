import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  getUrl,
  useListener,

} from "./broadcasters"
import { init, map, targetValue, filter, repeatIf, log, thenCombine} from "./operators"
import {pipe, every, isString} from "lodash/fp"
import { head  } from "lodash"

let repeatLogic = ([word, guess]) => Array.from(word).every(letter => guess.includes(letter))

let getWord = pipe(
    map(head)
  )(getUrl('https://random-word-api.herokuapp.com/word'))

let gameLogic = pipe(
  filter(every(isString)),
  log,
  repeatIf(repeatLogic)
)

let guessPipe = pipe(
  targetValue,
  init("")
)

let App = () => {

  let onInput = useListener();
  let guessBroadcaster = guessPipe(onInput)
  let gameBroadcaster = gameLogic(
    thenCombine(guessBroadcaster)(getWord)
  )

  let [word, guess] = useBroadcaster(gameBroadcaster, ["", ""])
  return (
    <div>
      <input type="text" onChange={onInput} value={guess}/>
      <p>
        {word}
      </p>
      <p>{Array.from(word).map(c => guess.includes(c) ? c: "*").join("")}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
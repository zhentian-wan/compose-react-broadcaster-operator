import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  getUrl,
  useListener,
  combine,
} from "./broadcasters"
import { map, share, targetValue} from "./operators"
import {pipe} from "lodash/fp"
import { head } from "lodash"



let getWord = pipe(
    map(head),
    share()
  )(getUrl('https://random-word-api.herokuapp.com/word'))


let App = () => {
  let onInput = useListener();
  let gameBroadcaster = combine(targetValue(onInput), getWord)
  let game = useBroadcaster(gameBroadcaster)
  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{JSON.stringify(game)}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
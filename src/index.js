import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  getUrl,
  useListener,
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
  let word = useBroadcaster(getWord)
  return (
    <div>
      <input type="text" onInput={onInput} />
      <p>{word}</p>
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
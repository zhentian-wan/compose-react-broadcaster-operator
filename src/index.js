import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
} from "./broadcasters"
import {  hardCode, targetValue, waitFor, ifElse, mapBroadcaster, map, filter} from "./operators"
import {pipe} from "lodash/fp"

//https://openlibrary.org/search.json?q=${name}

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

let App = () => {
  let onInput = useListener()
  let inputValue = targetValue(onInput)

  let inputToBooks = pipe(
    waitFor(150),
    ifElse(
      // condition
      name => name.length > 3,
      // if
      pipe(
        map(name => `https://openlibrary.org/search.json?q=${name}`),
        mapBroadcaster(getUrl),
        map(json => json.docs)
      ),
      // else
      map(() => [])
  ))(inputValue)
  let books = useBroadcaster(inputToBooks, [])

  return (
    <div>
      <input type="text" onInput={onInput} />
      {books.map(book => {
        return <div key={book.key}>
          <a href={`https://openlibrary.org${book.key}`}>{book.title}</a>
        </div>
      })}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
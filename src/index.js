import React from "react"
import { render } from "react-dom"

import {
  useBroadcaster,
  useListener,
  merge,
} from "./broadcasters"
import { ignoreError, targetValue, waitFor, mapBroadcasterCache, map, filter} from "./operators"
import {pipe} from "lodash/fp"

//https://openlibrary.org/search.json?q=${name}

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
    filter(name => name.length > 3),
    waitFor(150),
    pipe(
      map(name => `https://openlibrary.org/search.json?q=${name}`),
      mapBroadcasterCache(getUrl),
      ignoreError,
      map(json => json.docs)
    ))(inputValue)

  let inputToClearSearch = pipe(
    filter(name => name.length < 4),
    map(() => [{title: "hello"}])
  )(inputValue)

  let books = useBroadcaster(merge(
    inputToBooks,
    inputToClearSearch
  ), [])

  return (
    <div>
      <input type="text" onInput={onInput} />
      {books.map(book => {
        return <div key={book.title}>
          <a href={`https://openlibrary.org${book.key}`}>{book.title}</a>
        </div>
      })}
    </div>
  )
}

render(<App></App>, document.querySelector("#root"))
import React, {useContext, useEffect, useState} from 'react'

export const store = {
  state: {
    user: {name: 'frank', age: 18},
    group: {name: '前端组'}
  },
  setState(newState) {
    store.state = newState
    store.listeners.map(fn => fn(store.state))
  },
  listeners: [],
  subscribe(fn) {
    store.listeners.push(fn)
    return () => {
      const index = store.listeners.indexOf(fn)
      store.listeners.splice(index, 1)
    }
  }
}
const reducer = (state, {type, payload}) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state
  }
}

const changed = (oldState, newState) => {
  let changed = false
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      changed = true
    }
  }
  return changed
}
export const connect = (selector) => (Component) => {
  return (props) => {
    const {state, setState} = useContext(appContext)
    const [, update] = useState({})
    const data = selector ? selector(state) : {state}
    useEffect(() => store.subscribe(() => {
      const newData = selector ? selector(store.state) : {state: store.state}
      if (changed(data, newData)) {
        update({})
      }
    }), [selector])
    const dispatch = (action) => {
      setState(reducer(state, action))
    }
    return <Component {...props} {...data} dispatch={dispatch}/>
  }
}

export const appContext = React.createContext(null)

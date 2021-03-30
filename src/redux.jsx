import React, {useContext, useEffect, useState} from 'react'

const store = {
  state: undefined,
  reducer: undefined,
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

export const createStore = (reducer, initState) => {
  store.state = initState
  store.reducer = reducer
  return store
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

export const connect = (selector, dispatchSelector) => (Component) => {
  const Wrapper = (props) => {
    const dispatch = (action) => {
      setState(store.reducer(state, action))
    }
    const {state, setState} = useContext(appContext)

    const data = selector ? selector(state) : {state}
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : {dispatch}

    const [, update] = useState({})
    useEffect(() => store.subscribe(() => {
      const newData = selector ? selector(store.state) : {state: store.state}
      if (changed(data, newData)) {
        update({})
      }
    }), [selector])

    return <Component {...props} {...data} {...dispatchers}/>
  }
  return Wrapper
}

export const appContext = React.createContext(null)

export const Provider = ({store, children}) => {
  return (
    <appContext.Provider value={store}>
      {children}
    </appContext.Provider>
  )
}

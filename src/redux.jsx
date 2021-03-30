import React, {useContext, useEffect, useState} from 'react'
let state = undefined
let reducer = undefined
let listeners = []
const setState = (newState) => {
  state = newState
  listeners.map(fn => fn(state))
}
const store = {
  getState(){
    return state
  },
  dispatch: (action) => {
    setState(reducer(state, action))
  },
  subscribe(fn) {
    listeners.push(fn)
    return () => {
      const index = listeners.indexOf(fn)
      listeners.splice(index, 1)
    }
  }
}
let dispatch = store.dispatch

const prevDispatch = dispatch

dispatch = (action)=>{
  if(action instanceof Function){
    action(dispatch)
  } else{
    prevDispatch(action) // 对象 type payload
  }
}

const prevDispatch2 = dispatch

dispatch = (action) => {
  if(action.payload instanceof Promise){
    action.payload.then(data=> {
      dispatch({...action, payload: data})
    })
  }else{
    prevDispatch2(action)
  }
}


export const createStore = (_reducer, initState) => {
  state = initState
  reducer = _reducer
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

    const data = selector ? selector(state) : {state}
    const dispatchers = dispatchSelector ? dispatchSelector(dispatch) : {dispatch}

    const [, update] = useState({})
    useEffect(() => store.subscribe(() => {
      const newData = selector ? selector(state) : {state}
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

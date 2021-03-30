// 请从课程简介里下载本代码
import React from 'react'
import {Provider, createStore, connect} from './redux.jsx'
import {connectToUser} from './connecters/connectToUser'

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
const initState = {
  user: {name: 'frank', age: 18},
  group: {name: '前端组'}
}
const store = createStore(reducer, initState)

export const App = () => {
  return (
    <Provider store={store}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </Provider>
  )
}
const 大儿子 = () => {
  console.log('大儿子执行了 ' + Math.random())
  return <section>大儿子<User/></section>
}
const 二儿子 = () => {
  console.log('二儿子执行了 ' + Math.random())
  return <section>二儿子<UserModifier/></section>
}
const 幺儿子 = connect(state => {
  return {group: state.group}
})(({group}) => {
  console.log('幺儿子执行了 ' + Math.random())
  return <section>幺儿子
    <div>Group: {group.name}</div>
  </section>
})


const User = connectToUser(({user}) => {
  console.log('User执行了 ' + Math.random())
  return <div>User:{user.name}</div>
})

const ajax = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: {name: '3秒后的frank'}})
    }, 3000)
  })
}

const fetchUserPromise = () => {
  return ajax('/user').then(response => response.data)
}
const fetchUser = (dispatch) => {
  return ajax('/user').then(response => dispatch({type: 'updateUser', payload: response.data}))
}
const UserModifier = connect(null, null)(({state, dispatch}) => {
  console.log('UserModifier执行了 ' + Math.random())
  const onClick = (e) => {
    dispatch({type: 'updateUser', payload: fetchUserPromise()})
    // dispatch(fetchUser)
  }
  return <div>
    <div>User: {state.user.name}</div>
    <button onClick={onClick}>异步获取 user</button>
  </div>
})


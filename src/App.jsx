// 请从课程简介里下载本代码
import React, {useState, useContext} from 'react'

const appContext = React.createContext(null)
export const App = () => {
  const [appState, setAppState] = useState({
    user: {name: 'frank', age: 18}
  })
  const contextValue = {appState, setAppState}
  return (
    <appContext.Provider value={contextValue}>
      <大儿子/>
      <二儿子/>
      <幺儿子/>
    </appContext.Provider>
  )
}
const 大儿子 = () => <section>大儿子<User/></section>
const 二儿子 = () => <section>二儿子<UserModifier/></section>
const 幺儿子 = () => <section>幺儿子</section>
const User = () => {
  const contextValue = useContext(appContext)
  return <div>User:{contextValue.appState.user.name}</div>

}
const UserModifier = () => {
  const {appState, setAppState} = useContext(appContext)
  const onChange = (e) => {
    appState.user.name = e.target.value
    setAppState({...contextValue.appState})
  }
  return <div>
    <input value={contextValue.appState.user.name}
      onChange={onChange}/>
  </div>
}


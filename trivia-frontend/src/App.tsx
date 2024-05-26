import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'

import MainPage from './components/mainPage/mainPage'
import TicTacToe from './components/tic-tac-toe/board/ticTacToe'
import { userContext } from './components/trivia-utils/hooks/context'
// import TicTacToe from './components/tic-tac-toe/board/ticTacToe'


function App() {

  const [user, setUser] = useState<string>('')

  return (
    <>
      <userContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<MainPage setUser={setUser} />} />
          <Route path="tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </userContext.Provider>
    </>
  )
}

export default App

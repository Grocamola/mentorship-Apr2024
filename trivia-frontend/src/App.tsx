import { Route, Routes } from 'react-router-dom'
import './App.css'

import MainPage from './components/mainPage/mainPage'
import TicTacToe from './components/tic-tac-toe/board/ticTacToe'
import { UserProvider } from './components/trivia-utils/hooks/context'
// import TicTacToe from './components/tic-tac-toe/board/ticTacToe'


function App() {

  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="tic-tac-toe" element={<TicTacToe />} />
          <Route path="tic-tac-toe/:roomId" element={<TicTacToe />} />
        </Routes>
        </UserProvider>,
    </>
  )
}

export default App

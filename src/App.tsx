import { useState } from 'react'
import './App.css'

type CellState = 'hidden' | 'revealed' | 'flagged'

interface Cell {
  isMine: boolean
  adjacentMines: number
  state: CellState
}

const ROWS = 9
const COLS = 9
const MINES = 10

function createBoard(): Cell[][] {
  const board: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      adjacentMines: 0,
      state: 'hidden' as CellState,
    }))
  )

  let placed = 0
  while (placed < MINES) {
    const x = Math.floor(Math.random() * COLS)
    const y = Math.floor(Math.random() * ROWS)
    if (!board[y][x].isMine) {
      board[y][x].isMine = true
      placed++
    }
  }

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!board[y][x].isMine) {
        board[y][x].adjacentMines = countAdjacent(board, x, y)
      }
    }
  }

  return board
}

function countAdjacent(board: Cell[][], x: number, y: number): number {
  let count = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ny = y + dy
      const nx = x + dx
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && board[ny][nx].isMine) {
        count++
      }
    }
  }
  return count
}

function App() {
  const [board, setBoard] = useState<Cell[][]>(createBoard)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const reveal = (x: number, y: number) => {
    if (gameOver || won) return
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    const cell = newBoard[y][x]
    if (cell.state !== 'hidden') return

    if (cell.isMine) {
      // 全地雷を表示
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].state = 'revealed'
          }
        }
      }
      setGameOver(true)
      setBoard(newBoard)
      return
    }

    revealSafe(newBoard, x, y)
    checkWin(newBoard)
    setBoard(newBoard)
  }

  const revealSafe = (board: Cell[][], x: number, y: number) => {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return
    const cell = board[y][x]
    if (cell.state !== 'hidden' || cell.isMine) return
    cell.state = 'revealed'
    if (cell.adjacentMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          revealSafe(board, x + dx, y + dy)
        }
      }
    }
  }

  const flag = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault()
    if (gameOver || won) return
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    const cell = newBoard[y][x]
    if (cell.state === 'hidden') cell.state = 'flagged'
    else if (cell.state === 'flagged') cell.state = 'hidden'
    setBoard(newBoard)
  }

  const checkWin = (board: Cell[][]) => {
    const hiddenCount = board.flat().filter(c => c.state === 'hidden' || c.state === 'flagged').length
    if (hiddenCount === MINES) setWon(true)
  }

  const reset = () => {
    setBoard(createBoard())
    setGameOver(false)
    setWon(false)
  }

  return (
    <div className="game">
      <h1>💣 Minesweeper</h1>
      <button onClick={reset}>{gameOver ? '😵 Retry' : won ? '🎉 You Won!' : '🙂 Reset'}</button>
      <div className="board">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <button
              key={`${x}-${y}`}
              className={`cell ${cell.state}`}
              onClick={() => reveal(x, y)}
              onContextMenu={(e) => flag(e, x, y)}
            >
              {cell.state === 'revealed' && (cell.isMine ? '💣' : cell.adjacentMines || '')}
              {cell.state === 'flagged' && '🚩'}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default App


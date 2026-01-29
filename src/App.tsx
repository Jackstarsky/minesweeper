.game {
  text-align: center;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.board {
  display: grid;
  grid-template-columns: repeat(9, 40px);
  gap: 2px;
  justify-content: center;
  margin-top: 20px;
}

.cell {
  width: 40px;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  border: 2px outset #ccc;
  background: #c0c0c0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.cell.revealed {
  border: 1px solid #999;
  background: #e0e0e0;
}

.cell.flagged {
  background: #c0c0c0;
}

button {
  font-size: 16px;
  padding: 8px 16px;
  margin​​​​​​​​​​​​​​​​



const ROWS = 10, COLS = 10, MINES = 15;
let board, gameState, flagCount, timerVal, timerInterval;

function initGame() {
  clearInterval(timerInterval);
  timerVal = 0;
  flagCount = 0;
  gameState = 'idle';
  document.getElementById('mineCounter').textContent = MINES;
  document.getElementById('timerDisplay').textContent = '0';
  document.getElementById('gameMessage').textContent = '';
  document.getElementById('gameMessage').className = 'game-message';
  document.getElementById('resetBtn').textContent = '🙂';

  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, adjacent: 0 }))
  );
  renderBoard();
}

function placeMines(safeR, safeC) {
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].mine && !(r === safeR && c === safeC)) {
      board[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].mine) board[r][c].adjacent = countAdjacentMines(r, c);
    }
  }
}

function countAdjacentMines(r, c) {
  let count = 0;
  forNeighbors(r, c, (nr, nc) => { if (board[nr][nc].mine) count++; });
  return count;
}

function forNeighbors(r, c, fn) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) fn(nr, nc);
    }
  }
}

function reveal(r, c) {
  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;
  if (cell.adjacent === 0 && !cell.mine) {
    forNeighbors(r, c, (nr, nc) => reveal(nr, nc));
  }
}

function handleClick(r, c) {
  if (gameState === 'won' || gameState === 'lost') return;
  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;

  if (gameState === 'idle') {
    gameState = 'playing';
    placeMines(r, c);
    timerInterval = setInterval(() => {
      timerVal++;
      document.getElementById('timerDisplay').textContent = timerVal;
    }, 1000);
  }

  if (cell.mine) {
    cell.revealed = true;
    endGame(false);
  } else {
    reveal(r, c);
    if (checkWin()) endGame(true);
    else renderBoard();
  }
}

function handleRightClick(e, r, c) {
  e.preventDefault();
  if (gameState === 'won' || gameState === 'lost') return;
  const cell = board[r][c];
  if (cell.revealed) return;
  cell.flagged = !cell.flagged;
  flagCount += cell.flagged ? 1 : -1;
  document.getElementById('mineCounter').textContent = MINES - flagCount;
  renderBoard();
}

function checkWin() {
  return board.flat().every(c => c.revealed || c.mine);
}

function endGame(won) {
  clearInterval(timerInterval);
  gameState = won ? 'won' : 'lost';
  document.getElementById('resetBtn').textContent = won ? '😎' : '😵';
  const msg = document.getElementById('gameMessage');
  if (won) {
    msg.textContent = `You win! 🎉 Cleared in ${timerVal}s`;
    msg.className = 'game-message win';
  } else {
    msg.textContent = 'Boom! 💥 Better luck next time.';
    msg.className = 'game-message lose';
    board.flat().filter(c => c.mine).forEach(c => { c.revealed = true; });
  }
  renderBoard();
}

function renderBoard() {
  const boardEl = document.getElementById('gameBoard');
  boardEl.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      const el = document.createElement('div');

      if (cell.revealed) {
        if (cell.mine) {
          el.className = gameState === 'lost' && !cell.flagged ? 'cell mine-hit' : 'cell mine-shown';
          el.textContent = '💣';
        } else {
          el.className = 'cell revealed' + (cell.adjacent ? ` n${cell.adjacent}` : '');
          el.textContent = cell.adjacent || '';
        }
      } else if (cell.flagged) {
        el.className = 'cell flagged';
        el.textContent = '🚩';
      } else {
        el.className = 'cell hidden';
      }

      el.addEventListener('click', () => handleClick(r, c));
      el.addEventListener('contextmenu', e => handleRightClick(e, r, c));
      boardEl.appendChild(el);
    }
  }
}

function showGame() {
  document.getElementById('gameOverlay').classList.add('active');
  if (!board) initGame();
}

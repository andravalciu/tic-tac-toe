const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')

// butoane dificultate
const difficultyEasyButton = document.getElementById('difficultyEasy')
const difficultyMediumButton = document.getElementById('difficultyMedium')
const difficultyHardButton = document.getElementById('difficultyHard')
const difficultyBar = document.querySelector('.difficulty-select')


// butoanele pentru mod
const modeFriendButton = document.getElementById('modeFriend')
const modeAIButton = document.getElementById('modeAI')

// false = 2 jucători, true = vs AI
let isSinglePlayer = false

let difficulty = 'easy'

let circleTurn 

restartButton.addEventListener('click', startGame)

// schimbare mod joc
modeFriendButton.addEventListener('click', () => {
    isSinglePlayer = false
    updateModeUI()
    startGame()
})

modeAIButton.addEventListener('click', () => {
    isSinglePlayer = true
    updateModeUI()
    startGame()
})

// schimbare dificultate
difficultyEasyButton.addEventListener('click', () => {
    difficulty = 'easy'
    updateDifficultyUI()
})

difficultyMediumButton.addEventListener('click', () => {
    difficulty = 'medium'
    updateDifficultyUI()
})

difficultyHardButton.addEventListener('click', () => {
    difficulty = 'hard'
    updateDifficultyUI()
})


function updateModeUI() {
    if (isSinglePlayer) {
        modeAIButton.classList.add('active')
        modeFriendButton.classList.remove('active')
    } else {
        modeFriendButton.classList.add('active')
        modeAIButton.classList.remove('active')
    }
    updateDifficultyUI()
}

function updateDifficultyUI() {
    // activ / inactiv vizual
    if (!isSinglePlayer) {
        difficultyBar.classList.add('disabled')
        difficultyEasyButton.disabled = true
        difficultyMediumButton.disabled = true
        difficultyHardButton.disabled = true
    } else {
        difficultyBar.classList.remove('disabled')
        difficultyEasyButton.disabled = false
        difficultyMediumButton.disabled = false
        difficultyHardButton.disabled = false
    }

    // butonul selectat (stil)
    difficultyEasyButton.classList.remove('active')
    difficultyMediumButton.classList.remove('active')
    difficultyHardButton.classList.remove('active')

    if (difficulty === 'easy') {
        difficultyEasyButton.classList.add('active')
    } else if (difficulty === 'medium') {
        difficultyMediumButton.classList.add('active')
    } else if (difficulty === 'hard') {
        difficultyHardButton.classList.add('active')
    }
}


startGame()
updateModeUI()

function startGame(){
    circleTurn = false;
    cellElements.forEach(cell=>{
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, {once:true})
    })
    setBoardHoverClass()
    winningMessageElement.classList.remove('show')
}

function handleClick(e){
    const cell = e.target
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)

    if (checkWin(currentClass)) {
        endGame(false)
        return
    }

    if (isDraw()) {
        endGame(true)
        return
    }

    // Dacă e modul single-player, după mutarea lui X → mută AI
    if (isSinglePlayer && currentClass === X_CLASS) {
        swapTurns()
        setBoardHoverClass()
        setTimeout(makeAIMove, 400)
    } else {
        swapTurns()
        setBoardHoverClass()
    }
}

function makeAIMove() {
    const availableCells = getAvailableCells()
    if (availableCells.length === 0) return

    let aiCell

    if (difficulty === 'easy') {
        // Easy: random move
        aiCell = getRandomMove(availableCells)
    } else if (difficulty === 'medium') {
        // Medium: încearca sa castige sau sa blocheze, altfel random
        aiCell = getBestMoveMedium(availableCells)
    } else {
        // Hard: minimax (AI perfect)
        const bestIndex = getBestMoveMinimax()
        aiCell = bestIndex != null ? cellElements[bestIndex] : getRandomMove(availableCells)
    }

    // O (AI)
    placeMark(aiCell, CIRCLE_CLASS)

    if (checkWin(CIRCLE_CLASS)) {
        endGame(false)
        return
    }

    if (isDraw()) {
        endGame(true)
        return
    }

    // inapoi la jucatorul X
    swapTurns()
    setBoardHoverClass()
}

function getAvailableCells() {
    return [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) &&
               !cell.classList.contains(CIRCLE_CLASS)
    })
}

function getRandomMove(availableCells) {
    return availableCells[Math.floor(Math.random() * availableCells.length)]
}

// Medium: intai incearca sa castige, apoi sa blocheze, altfel random
function getBestMoveMedium(availableCells) {
    // incearca sa castige ca O (AI)
    for (const cell of availableCells) {
        cell.classList.add(CIRCLE_CLASS)
        const win = checkWin(CIRCLE_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        if (win) return cell
    }

    // incearca sa blocheze X
    for (const cell of availableCells) {
        cell.classList.add(X_CLASS)
        const win = checkWin(X_CLASS)
        cell.classList.remove(X_CLASS)
        if (win) return cell
    }

    //  altfel random
    return getRandomMove(availableCells)
}

function getBoardState() {
    return [...cellElements].map(cell => {
        if (cell.classList.contains(X_CLASS)) return 'X'
        if (cell.classList.contains(CIRCLE_CLASS)) return 'O'
        return null
    })
}

function evaluateBoard(board) {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (board[a] === 'O') return 10   // AI
            if (board[a] === 'X') return -10  // player
        }
    }
    return 0
}

function isMovesLeft(board) {
    return board.some(cell => cell === null)
}

function minimax(board, isMaximizing) {
    const score = evaluateBoard(board)

    if (score === 10 || score === -10) return score
    if (!isMovesLeft(board)) return 0

    if (isMaximizing) {
        // AI (O) încearcă să maximizeze scorul
        let best = -Infinity
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O'
                best = Math.max(best, minimax(board, false))
                board[i] = null
            }
        }
        return best
    } else {
        // Player (X) – minimizator
        let best = Infinity
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X'
                best = Math.min(best, minimax(board, true))
                board[i] = null
            }
        }
        return best
    }
}

function getBestMoveMinimax() {
    const board = getBoardState()
    let bestScore = -Infinity
    let bestMove = null

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O'
            const moveScore = minimax(board, false)
            board[i] = null

            if (moveScore > bestScore) {
                bestScore = moveScore
                bestMove = i
            }
        }
    }

    return bestMove
}


function endGame(draw) {
    if(draw){
        winningMessageTextElement.innerText = 'Draw!'
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's": "X's"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

function swapTurns(){
    circleTurn = !circleTurn
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)
    if (circleTurn){
        board.classList.add(CIRCLE_CLASS)
    } else {
        board.classList.add(X_CLASS)
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination =>{
        return combination.every(index =>{
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

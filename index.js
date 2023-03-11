const BOARD_SIZE = 9
let winner= ""
let winnerSolution = []

createBoard()

async function Game(){
    await initGame()
    if(winner === "") setDraw()
}

async function resetGame(){
    winner= ""
    winnerSolution = []
    for (let index = 1; index <= BOARD_SIZE; index++) {
        const positionElement = document.getElementById(`position_${index}`)
        positionElement.innerText = ""
        positionElement.className = "boardPosition"
    }
    const info = document.getElementById("info")
    info.innerHTML = ""
}

async function initGame(){

    resetGame()
    
    const whoStarted = whoShouldStart()

    makeMove(1, whoStarted)

    let lastPlayer = whoStarted

    while (areThereOptionsToMake() > 0) {
        const nextFieldMove = randomIntFromInterval(2,9)
        if(isEmptyPosition(nextFieldMove)){
            if(lastPlayer === "X"){
                makeMove(nextFieldMove, "O")
                lastPlayer = "O"
            } else {
                makeMove(nextFieldMove, "X")
                lastPlayer =  "X"
            }
        }
        if (areThereOptionsToMake() < 5) await checkWinner()
        if(winner != "") {
            setWinner()
            return 
        }
        await new Promise(r => setTimeout(r, 100));
    }
}

async function createBoard(){
    const board = document.getElementById("gameBoard")
    if(!board) document.createElement("div").id = "gameBoard"
    for (let index = 1; index <= BOARD_SIZE; index++) {
        const newElement = document.createElement('div')
        newElement.setAttribute('id', `position_${index}`)
        newElement.className = 'boardPosition'
        board.appendChild(newElement)
    }
}

function makeMove(positionNumber, value){
    if (!isEmptyPosition(positionNumber)) return false

    const positionElement = document.getElementById(`position_${positionNumber}`)
    positionElement.innerText = value
    if(value === "X") positionElement.classList.add("cross")
    else  positionElement.classList.add("circle")

    return true
}

function areThereOptionsToMake(){
    let optionsToMake = 0
    for (let index = 1; index <= BOARD_SIZE; index++) {
        const positionElement = document.getElementById(`position_${index}`)
        if (positionElement.innerText === "") optionsToMake += 1
    }
    return optionsToMake
}

function isEmptyPosition(positionNumber){
    const positionElement = document.getElementById(`position_${positionNumber}`)
    let canMakeMove = false;
    if (positionElement) canMakeMove = positionElement.innerText === ""
    return canMakeMove
}

function whoShouldStart(){
    //if the random number is an odd number, O player will start
    //if the random number is an even number, X player will start
    const headsTail = randomIntFromInterval(1,1000)
    if (headsTail === 0) return "X"
    else return "O"
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function checkWinner(){
    let choises = []
    const allPossibleSolutions = [
        [1,2,3], 
        [4,5,6], 
        [7,8,9], 
        [1,4,7], 
        [2,5,8], 
        [3,6,9], 
        [1,5,9], 
        [3,5,7]
    ]

    for (let index = 1; index <= BOARD_SIZE; index++) {
        const positionElement = document.getElementById(`position_${index}`)
        if (positionElement.innerHTML !== "") choises.push({ player: positionElement.innerText, index })
    }

    allPossibleSolutions.map(solution => {
        const isSectionFilled =  solution.map(number => !isEmptyPosition(number)).every(number => number)
        if(isSectionFilled){
            const row = solution.map(index => {
                return document.getElementById(`position_${index}`).innerText
            })

            if (row.every(item => item === "X")) {
                winner = "X"
                winnerSolution = solution
            }
            else if (row.every(item => item === "O")) {
                winner = "O"
                winnerSolution = solution
            }
        }
    })
}

function setWinner(){
    winnerSolution.forEach(index => {
        const element =  document.getElementById(`position_${index}`)
        element.classList.add("winner")
    })
    const infoDiv = document.getElementById("info")
    const infoContent = document.createElement('div')
    infoContent.innerHTML = `Player ${winner} WON!`
    infoContent.className = "info-win"
    infoDiv.appendChild(infoContent)
}

function setDraw(){
    const infoDiv = document.getElementById("info")
    const infoContent = document.createElement('div')
    infoContent.innerHTML = `It is a DRAW.`
    infoContent.className = "info-draw"
    infoDiv.appendChild(infoContent)
}

function startGame(){
    Game()
}
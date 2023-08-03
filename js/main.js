'use strict'


const MINE = '💣'
const FLAG = '🚩'
const HART = '❤️'
const gLevel = {
    SIZE: 8,
    MINES: 14,
    LIVES: 3
}
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


var id = 0
var gBoard = []
var gFirstClick = true
var gEmptyCellId = []
var gMinesCells = []
var gTimerIntervalId = null
var gAllBoard = []





function onInit() {

    onSetLv({ size: gLevel.SIZE, mines: gLevel.MINES })
}

function onSetLv(level) {
    clearInterval(gTimerIntervalId)
    if (isHintOn) return
    gGame.isOn = true
    gBoard = []
    id = 0
    gFirstClick = true
    gEmptyCellId = []
    gMinesCells = []
    gGame.markedCount = 0
    gGame.shownCount = 0
    gLevel.LIVES = 3
    gTimerIntervalId = null
    gIsManuallyCreate = false
    updateLives()
    
    resatBonus()
    
    
    gLevel.SIZE = level.size
    gLevel.MINES = level.mines
    document.querySelector('.main-remaining span').innerText = gLevel.MINES
    
    
    document.querySelector('.manually-create').style.backgroundColor = 'rgb(74, 219, 245)'
    document.querySelector('.timer span').innerText = '00.00'
    document.querySelector('.emoji').innerText = '😃'
    var elBox = document.querySelector('.box')
    document.querySelector('.features1').style.width = (gLevel.SIZE * 60 + 200) + 'px'
    elBox.style.width = (gLevel.SIZE * 60 + 200) + 'px'
    elBox.style.height = (gLevel.SIZE * 70 + 350) + 'px'

    renderBlankBoard()

}

function renderBlankBoard() {
    var strHTML = ''
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += `\n<tr>`
        for (var j = 0; j < gLevel.SIZE; j++) {
            strHTML += ` \n<td title="Seat: ${i}, ${j}" onmousedown="onCellClick(event, ${i}, ${j})"></td>`
        }
        strHTML += `\n</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function onCellClick(event, i, j) {

    if (!gGame.isOn) return
    const grid = document.querySelector('.board')
    grid.addEventListener("contextmenu", function (event) {
        event.preventDefault(); // Prevent the context menu from opening
    })

    if (event.button === 0) {
        clickLeft(i, j);
        const copyOfGBoard = JSON.parse(JSON.stringify(gBoard));
        gAllBoard.push(copyOfGBoard);

    } else if (event.button === 2) {
        clickRight(i, j);
    }
}

function clickRight(row, col) {
    if (gBoard.length === 0 || gBoard[row][col].isShow) return
    if (!gBoard[row][col].isFlag) {
        gBoard[row][col].isFlag = true
    } else {
        gBoard[row][col].isFlag = false
    }
    renderCell(row, col)
    const copyOfGBoard = JSON.parse(JSON.stringify(gBoard));
    gAllBoard.push(copyOfGBoard);
    checkGameOver()
}


function clickLeft(row, col) {
    if(gIsManuallyCreate){
        plantMinesPlyer(row, col)
        return
    } 
    if (gFirstClick) {
        gBoard = createBoard(row, col)
        const copyOfGBoard = JSON.parse(JSON.stringify(gBoard));
        gAllBoard.push(copyOfGBoard);
        gFirstClick = false
    }
    if (isHintOn) {
        revileNegs(row, col)
        return
    }
    
    if (isMegaHintOn) {
        
        if (!cell2 && cell1) {
            cell2 = { row, col }
            revileEra()
        }
        if (!cell1) cell1 = { row, col }
        return
    }
    
    if(!gTimerIntervalId) startTimer()
    if (!gBoard[row][col].isMine) {
        const countNegsMine = countNeighborsMine(row, col)
        gBoard[row][col].mineNegsCount = countNegsMine
        gBoard[row][col].isShow = true
        if (!countNegsMine) showNegs(row, col)

    } else {
        console.log('mine');
        gBoard[row][col].isShow = true
        gLevel.LIVES--
        updateLives()
        renderCell(row, col)
        if (checkGameOver()) return

        setTimeout(function () {
            gBoard[row][col].isShow = false
            renderCell(row, col)
        }, 1000);
    }

    renderCell(row, col)
    checkGameOver()
}

function createBoard(row, col) {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gEmptyCellId.push(id)
            board[i][j] = {
                id: id++,
                isMine: false,
                isShow: false,
                isFlag: false,
                mineNegsCount: 0,
                i,
                j
            }
        }
    }
    plantMines(board, row, col)

    return board
}

function renderCell(row, col) {
    const elCell = document.querySelector(`[title="Seat: ${row}, ${col}"]`)
    var cellIcon = ''

    if (gBoard[row][col].isFlag) {
        cellIcon = FLAG
        gBoard[row][col].isShow = false
    }

    if (gBoard[row][col].isShow) {
        elCell.classList.add('display-cell')
        cellIcon = gBoard[row][col].mineNegsCount
        if (!cellIcon) cellIcon = ''
    } else {
        elCell.classList.remove('display-cell')
        // cellIcon = ''
    }

    if (gBoard[row][col].isMine) {
        if (gBoard[row][col].isShow) {
            elCell.classList.add('display-cell')
            cellIcon = MINE
        } else {
            elCell.classList.remove('display-cell')
        }

    }

    elCell.innerText = cellIcon
}


function plantMines(board, row, col) {
    var NegsId = getNegsId(board, row, col)
    for (var i = 0; i < NegsId.length; i++) {
        var removeIndx = gEmptyCellId.indexOf(NegsId[i])
        gEmptyCellId.splice(removeIndx, 1)
    }


    for (var i = 0; i < gLevel.MINES; i++) {
        var ranMineIndx = getRandomIntInclusive(0, gEmptyCellId.length - 1)
        var cell = getCellById(board, gEmptyCellId[ranMineIndx])
        cell.isMine = true
        gMinesCells.push(cell)
        gEmptyCellId.splice(ranMineIndx, 1)
    }

}

function getNegsId(board, row, col) {

    var NegsId = []
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            NegsId.push(board[i][j].id)
        }
    }
    return NegsId

}

function countNeighborsMine(row, col) {
    var count = 0
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === row && j === col) continue
            if (gBoard[i][j].isMine) count++
        }
    }
    return count
}

function showNegs(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === row && j === col) continue
            if (gBoard[i][j].isShow) continue
            if (gBoard[i][j].isFlag) continue
            clickLeft(i, j)
        }
    }

}

function updateLives() {
    var hartText = 'Live:'
    for (var i = 0; i < gLevel.LIVES; i++) {
        hartText += HART
    }
    document.querySelector('.lives').innerText = hartText
}

function checkGameOver() {
    onBoardMap()
    document.querySelector('.main-remaining span').innerText = gMinesCells.length - gGame.markedCount 
    const elEmoji = document.querySelector('.emoji')
    const emptyCells = gLevel.SIZE * gLevel.SIZE - gMinesCells.length
    if (gMinesCells.length === gGame.markedCount && gGame.shownCount === emptyCells) {
        console.log('wine!!');
        elEmoji.innerText = '😎'
        checkBestScore()
        gGame.isOn = false
        clearInterval(gTimerIntervalId)
    }
    if (!gLevel.LIVES) {
        console.log('lose');
        showMines()
        elEmoji.innerText = '🤯'
        gGame.isOn = false
        clearInterval(gTimerIntervalId)
        return true
    }
}

function showMines() {
    for (var i = 0; i < gMinesCells.length; i++) {
        gMinesCells[i].isShow = true
        gMinesCells[i].isFlag = false
        console.log(gMinesCells[i]);
        renderCell(gMinesCells[i].i, gMinesCells[i].j)
    }
}
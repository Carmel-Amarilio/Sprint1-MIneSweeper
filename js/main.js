'use strict'


const MINE = '💣'
const FLAG = '🚩'
const HART = '❤️'
const gLevel = {
    SIZE: 4,
    MINES: 2,
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
var gNinesCells = []




function onInit() {
    onSetLv({ size: gLevel.SIZE, mines: gLevel.MINES })
}

function onSetLv(level) {
    if(isHintOn) return
    gGame.isOn = true
    gBoard = []
    id = 0
    gFirstClick = true
    gEmptyCellId = []
    gNinesCells = []
    gGame.markedCount = 0
    gGame.shownCount = 0
    gLevel.LIVES = 3
    document.querySelector('.emoji').innerText = '😃'
    updateLives()

    resatHints()

    gLevel.SIZE = level.size
    gLevel.MINES = level.mines

    var elBox = document.querySelector('.box')
    var elLevelBox = document.querySelector('.levels')
    elBox.style.width = (gLevel.SIZE * 60 + 100) + 'px'
    elBox.style.height = (gLevel.SIZE * 60 + 250) + 'px'
    elLevelBox.style.width = (gLevel.SIZE * 60 + 100) + 'px'

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

    } else if (event.button === 2) {
        clickRight(i, j);
    }
}

function clickRight(row, col) {
    if (gBoard.length === 0 || gBoard[row][col].isShow) return
    if (!gBoard[row][col].isFlag) {
        gBoard[row][col].isFlag = true
        gGame.markedCount++
    } else {
        gBoard[row][col].isFlag = false
        gGame.markedCount--
    }
    renderCell(row, col)
    checkGameOver()
}


function clickLeft(row, col) {
    if (gFirstClick) {
        gBoard = createBoard(row, col)
        gFirstClick = false
    }

    if (isHintOn) {
        revileNegs(row, col)
        return
    }

    if (!gBoard[row][col].isMine) {
        const countNegsMine = countNeighborsMine(row, col)
        gBoard[row][col].mineNegsCount = countNegsMine
        gBoard[row][col].isShow = true
        gGame.shownCount++

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
        gNinesCells.push(cell)
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
    const elEmoji = document.querySelector('.emoji')
    const emptyCells = gLevel.SIZE * gLevel.SIZE - gLevel.MINES

    if (gLevel.MINES === gGame.markedCount && gGame.shownCount === emptyCells) {
        console.log('wine!!');
        elEmoji.innerText = '😎'
        gGame.isOn = false
    }
    if (!gLevel.LIVES) {
        console.log('lose');
        showMines()
        elEmoji.innerText = '🤯'
        gGame.isOn = false
        return true
    }
}

function showMines() {
    for (var i = 0; i < gNinesCells.length; i++) {
        gNinesCells[i].isShow = true
        gNinesCells[i].isFlag = false
        console.log(gNinesCells[i]);
        renderCell(gNinesCells[i].i, gNinesCells[i].j)
    }
}
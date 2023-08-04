'use strict'

var gIsManuallyCreate = false
function onManuallyCreate(elBtn) {

    if (gIsManuallyCreate) {
        elBtn.style.backgroundColor = 'lightgray'
        gFirstClick = false
        gIsManuallyCreate = false
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) { 
                gBoard[i][j].isShow = false
                renderCell(i, j)
            }
        }

    }
    if (gFirstClick && !gIsManuallyCreate) {
        gIsManuallyCreate = true
        elBtn.style.backgroundColor = 'blue'
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
        gBoard = board
    }
}

function plantMinesPlyer(row, col) {
    gBoard[row][col].isMine = !gBoard[row][col].isMine
    gBoard[row][col].isShow = !gBoard[row][col].isShow
    renderCell(row, col)

    mainOnBoardMap()
    document.querySelector('.main-remaining span').innerText = gMinesCells.length - gGame.markedCount 
}
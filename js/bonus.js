'use strict'



// todo: baest score
// todo: Manually positioned mines
// todo:MINE EXTERMINATOR

var isHintOn = false
var gElHint = null
var isMegaHintOn = false
var gElMegaHin = null
var cell1 = null
var isMegaHintOn = false
var cell2 = null
var safeClicksCount = 3

const darkModeCheckbox = document.getElementById('darkModeCheckbox')
darkModeCheckbox.addEventListener('change', function () {
    if (darkModeCheckbox.checked) document.body.style.backgroundColor = 'black'
    else document.body.style.backgroundColor = 'white'
});


function resatBonus() {
    //hints
    isHintOn = false
    gElHint = null
    const elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].innerText = '💡'
        elHints[i].style.display = 'inline-block'
    }

    // mega hint
    isMegaHintOn = false
    cell1 = null
    cell2 = null
    const elmEGAHints = document.querySelector('.mega-hint')
    elmEGAHints.innerText = '🎇'
    elmEGAHints.style.display = 'inline-block'

    //Safe Clicks
    safeClicksCount = 3
    const elBtn = document.querySelector('.safe-clicks')
    elBtn.innerText = `${safeClicksCount} safe clicks`

    //undo
    gAllBoard = []
    
}




function onHint(elHint) {
    if (isHintOn || !gGame.isOn || isMegaHintOn ) return
    gElHint = elHint
    gElHint.style.backgroundColor = 'rgb(248, 225, 119)'
    isHintOn = true
}

function revileNegs(row, col) {
    var revileNegs = []
    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (gBoard[i][j].isShow) continue
            if (gBoard[i][j].isFlag) continue
            gBoard[i][j].mineNegsCount = countNeighborsMine(i, j)
            gBoard[i][j].isShow = true
            revileNegs.push({ i, j })
            renderCell(i, j)
        }
    }

    setTimeout(function () {
        gElHint.innerText = ''
        gElHint.style.backgroundColor = 'rgb(230, 230, 230)'
        gElHint.style.display = 'none'
        for (var i = 0; i < revileNegs.length; i++) {
            var currCell = revileNegs[i]
            gBoard[currCell.i][currCell.j].isShow = false
            renderCell(currCell.i, currCell.j)
            isHintOn = false
        }
    }, 1000);
}

function onMegaHint(elMegaHint) {
    if (isHintOn || !gGame.isOn || isMegaHintOn ) return
    gElMegaHin = elMegaHint
    isMegaHintOn = true
    gElMegaHin.style.backgroundColor = 'rgb(248, 225, 119)'
}

function revileEra(){
    console.log(cell1,cell2);

    var revileEra = []
    for (var i = cell1.row; i <= cell2.row; i++) {
        for (var j = cell1.col; j <= cell2.col; j++) {
            if (gBoard[i][j].isShow) continue
            if (gBoard[i][j].isFlag) continue
            gBoard[i][j].mineNegsCount = countNeighborsMine(i, j)
            gBoard[i][j].isShow = true
            revileEra.push({ i, j })
            renderCell(i, j)
        }
    }

    setTimeout(function () {
        gElMegaHin.style.backgroundColor = 'rgb(230, 230, 230)'
        gElMegaHin.style.display = 'none'
        for (var i = 0; i < revileEra.length; i++) {
            var currCell = revileEra[i]
            gBoard[currCell.i][currCell.j].isShow = false
            renderCell(currCell.i, currCell.j)
            isHintOn = false
        }
    }, 1000);

    isMegaHintOn = false
}


function onSafeClicks(elBtn) {
    if (gFirstClick || !safeClicksCount) return
    safeClicksCount--
    elBtn.innerText = `${safeClicksCount} safe clicks`
    var SafeCellNotShow = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isShow && !currCell.isMine) {
                SafeCellNotShow.push(currCell)
            }
        }
    }
    var ranMineIndx = getRandomIntInclusive(0, SafeCellNotShow.length - 1)
    var cell = SafeCellNotShow[ranMineIndx]
    gBoard[cell.i][cell.j].isShow = true
    gBoard[cell.i][cell.j].mineNegsCount = countNeighborsMine(cell.i, cell.j)
    renderCell(cell.i, cell.j)
    setTimeout(function () {
        gBoard[cell.i][cell.j].isShow = false
        renderCell(cell.i, cell.j)
    }, 1000);
    gAllBoard.pop()
}


function onUndo() {
    if (!gAllBoard.length) return
    if (gAllBoard.length > 1) gAllBoard.pop()
    gBoard = gAllBoard.pop()
    randBoard(gBoard)
}

function randBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `\n<tr>`
        for (var j = 0; j < board[0].length; j++) {
            var classCell = ''
            var cellDisplay = ''
            if (board[i][j].isFlag) {
                cellDisplay = FLAG
                board[i][j].isShow = false
            }
            if (board[i][j].isShow) {
                cellDisplay = (board[i][j].isMine) ? MINE : board[i][j].mineNegsCount
                if (!cellDisplay) cellDisplay = ''
                classCell = `class="display-cell"`
            }

            if (gBoard[i][j].isMine && gBoard[i][j].isShow) gBoard[i][j].classList.remove('display-cell')

            strHTML += ` \n<td title="Seat: ${i}, ${j}" ${classCell} onmousedown="onCellClick(event, ${i}, ${j})">${cellDisplay}</td>`
        }
        strHTML += `\n</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    const copyOfGBoard = JSON.parse(JSON.stringify(gBoard));
    gAllBoard.push(copyOfGBoard);

}

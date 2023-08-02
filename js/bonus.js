'use strict'


var isHintOn = false
var gElHint = null
var safeClicksCount = 3


function resatBonus() {
    //hints
    isHintOn = false
    gElHint = null
    const elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].innerText = '💡'
        elHints[i].style.display = 'inline-block'
    }

    //Safe Clicks
    safeClicksCount = 3
    const elBtn = document.querySelector('.safe-clicks')
    elBtn.innerText = `${safeClicksCount} safe clicks`
}

const darkModeCheckbox = document.getElementById('darkModeCheckbox')

darkModeCheckbox.addEventListener('change', function () {
    if (darkModeCheckbox.checked) document.body.style.backgroundColor = 'black'
    else  document.body.style.backgroundColor = 'white'
});



function onHint(elHint) {
    if (isHintOn || !gGame.isOn) return
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
}





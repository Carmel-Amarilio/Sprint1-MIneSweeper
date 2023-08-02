'use strict'


var isHintOn = false
var gElHint = null


function resatHints() {
    isHintOn = false
    gElHint = null

    const elHints = document.querySelectorAll('.hint')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].innerText = '💡'
        elHints[i].style.display= 'inline-block'
    }
}


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
        gElHint.style.display= 'none'
        for (var i = 0; i < revileNegs.length; i++) {
            var currCell = revileNegs[i]
            gBoard[currCell.i][currCell.j].isShow = false
            renderCell(currCell.i, currCell.j)
            isHintOn = false
        }
    }, 1000);

}
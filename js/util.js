'use strict'
var gDeltaTime = 0

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getCellById(board, id) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].id === id) return board[i][j]
        }
    }
    return null
}

function startTimer() {
    var startTime = Date.now()

    gTimerIntervalId = setInterval(function () {
        gDeltaTime = Date.now() - startTime
        var elTimer = document.querySelector('.timer span')
        elTimer.innerText = `${(gDeltaTime / 1000).toFixed(2)}`
    }, 37)
}

var turn = 'X';
var gtype = 3;
var total_turns = 0;
var computer = true;
var finished = false;

var selections = new Array();
selections['X'] = new Array();
selections['Y'] = new Array();

var scores = new Array();
scores['X'] = 0;
scores['Y'] = 0;

function resetParams() {
    turn = 'X';
    type = 3;
    total_turns = 0;
    computer = true;
    finished = false;

    selections['X'] = new Array();
    selections['Y'] = new Array();
}

function changeTurn() {
    if (turn == 'X') turn = 'Y';
    else turn = 'X';
}

function winnerPatterns() {
    return wins = [
        [11, 12, 13],
        [21, 22, 23],
        [31, 32, 33],
        [11, 21, 31],
        [12, 22, 32],
        [13, 23, 33],
        [11, 22, 33],
        [13, 22, 31]
    ];
}


function DefaultComputerPatterns() {
    return computer_turns = [22, 11, 33, 13, 21, 23, 12, 32, 31];
}


function checkWinner() {

    var selected = selections[turn].sort();
    var win_patterns = winnerPatterns();

    finished = false;
    for (var x = 0; x < win_patterns.length; x++) {

        if (finished != true) {
            finished = isWinner(win_patterns[x], selections[turn]);

            if (finished === true) {
                scoreUpdate(turn);
                disableAllBoxes();
                break;
            }
        }
    }

    if ((total_turns == (type * type)) && finished === false) {
        finished = true;
        disableAllBoxes();
    }

}

function isWinner(win_pattern, selections) {

    var match = 0;

    for (var x = 0; x < win_pattern.length; x++) {
        for (var y = 0; y < selections.length; y++) {
            if (win_pattern[x] == selections[y]) {
                match++;
            }
        }
    }

    if (match == win_pattern.length) return true;

    return false;
}

function disableAllBoxes() {

    var elements = document.getElementsByClassName("grid-box");
    for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
    }

}

function generateGame() {

    resetParams();
    document.getElementById('play-board').innerHTML = '';
    for (var row = 1; row <= type; row++) {
        for (var col = 1; col <= type; col++) {
            var unique_name = 'grid-' + row + '-' + col;
            var unique_id = row + '' + col;
            var button = document.createElement("input");

            button.setAttribute("value", ' ');
            button.setAttribute("id", unique_id);
            button.setAttribute("name", unique_name);
            button.setAttribute("class", 'grid-box');
            button.setAttribute("type", 'button');
            button.setAttribute("onclick", "markCheck(this)");
            document.getElementById('play-board').appendChild(button);
        }

        var breakline = document.createElement("br");
        document.getElementById('play-board').appendChild(breakline);

    }

}

function markCheck(obj) {

    obj.value = turn;
    total_turns++;

    if (turn == 'X') {
        obj.setAttribute("class", 'blue-player');
    } else {
        obj.setAttribute("class", 'red-player');
    }

    obj.setAttribute("disabled", 'disabled');
    selections[turn].push(Number(obj.id));

    checkWinner();
    changeTurn();

    if (computer === true) autoTurn();
}

function autoTurn(again = false) {

    is_empty_result = true;

    if (turn === 'X' || finished === true) return false;

    var computer_pattern = '';
    if (again == true) computer_pattern = DefaultComputerPatterns();
    else computer_pattern = getAutoTurnPattern();

    for (var x = 0; x < computer_pattern.length; x++) {
        var desired_obj = document.getElementById(computer_pattern[x]);
        if (desired_obj.value == '' || desired_obj.value == ' ') {
            markCheck(desired_obj);
            is_empty_result = false;
            break;
        }
    }

}

function getAutoTurnPattern() {

    var pattern = [];
    pattern = getMostNearestPattern('Y');
    if (pattern.length <= 0) {
        pattern = getMostNearestPattern('X');
        if (pattern.length <= 0) {
            pattern = DefaultComputerPatterns();
        }
    }

    return pattern;

}

function getMostNearestPattern(turn) {

    var matches = 0;

    var selected = selections[turn].sort();
    var win_patterns = winnerPatterns();

    finished = false;
    for (var x = 0; x < win_patterns.length; x++) {
        var intersected = intersectionArray(selected, win_patterns[x]);

        if (intersected.length == (win_patterns[x].length - 1)) {
            for (var y = 0; y < win_patterns[x].length; y++) {
                obj = document.getElementById(win_patterns[x][y]);
                if (obj.value == '' || obj.value == ' ') {
                    return win_patterns[x];
                }
            }
        }

    }
    return [];
}

function intersectionArray(x, y) {

    var response = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                response.push(x[i]);
                break;
            }
        }
    }
    return response;

}

function scoreUpdate(turn) {
    scores[turn]++;
    document.getElementById('result-' + turn).innerHTML = scores[turn];
}
/// <reference path="../typings/jquery/jquery.d.ts" />
$(function () {
    var constants = {
        ////ID
        idNewGame: '#new-game',
        ////Classes
        classCell: '.cell',
        classHorStriked: '.hor-striked',
        classVerStriked: '.ver-striked',
        classDiagLrStriked: '.diag-lr-striked',
        classDiagRlStriked: '.diag-rl-striked',
        ////Properties
        propValue: 'value',
        ////Data Properties
        dataPropNumber: 'number',
        ////Messages
        msgFirstPlayerWon: 'First player won!',
        msgSecondPlayerWon: 'Second player won!'
    };

    var currentPlayer = 0;
    var gameFinished = false;

    var player = [{symbol: 'X'}, {symbol: 'O'}];
    var $cells = $(constants.classCell);

    $cells.click(onCellClicked);
    $(constants.idNewGame).click(newGame);

    function gameHasWinner() {
        var validator = function (indx1, indx2, indx3) {
            var val1 = $($cells[indx1]).prop(constants.propValue);
            var val2 = $($cells[indx2]).prop(constants.propValue);
            var val3 = $($cells[indx3]).prop(constants.propValue);

            return val1 && (val1 == val2) && (val2 == val3);
        }

        var cases = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for(var it in cases) {
            var args = cases[it];
            if (validator.apply(null, args))
                return args.map(function (i) { return $($cells[i]); });
        }

        return false;
    }

    function strikeOutCells($cellsToStrike) {
        //TODO: Опреділити положення клітинок одна відносно іншої, і обрати відповідний класс.
        var validator = function(pattern) {
            var diff = pattern.diff; 
            var cell1 = $cellsToStrike[0].data(constants.dataPropNumber);
            var cell2 = $cellsToStrike[1].data(constants.dataPropNumber);
            var cell3 = $cellsToStrike[2].data(constants.dataPropNumber);
            return (cell2 - cell1 == diff[0]) && (cell3 - cell1 == diff[1]);
        }

        //diff: difference in positions of cell2-cell1 and cell3-cell1
        var patterns = [
            {diff: [1, 2], class: constants.classHorStriked},
            {diff: [3, 6], class: constants.classVerStriked},
            {diff: [4, 8], class: constants.classDiagLrStriked},
            {diff: [2, 4], class: constants.classDiagRlStriked}
        ];

        var strikingClass = 'cell-striked ';
        for (var it in patterns){
            var pattern = patterns[it];
            if(validator(pattern)) {
                strikingClass += pattern.class.substr(1);
                break;
            }
        }

        $.each($cellsToStrike, 
        function(i, item) { 
            item.addClass(strikingClass) 
        });
    }

    function newGame() {
        
        currentPlayer = 0;
        $cells
            .removeClass('cell-striked hor-striked ver-striked diag-lr-striked diag-rl-striked')
            .removeProp(constants.propValue)
            .text('');
        gameFinished = false;
    }

    function onCellClicked() {
        var $cell = $(this);
        var cellIsUsed = !!$cell.prop(constants.propValue);
        if (cellIsUsed || gameFinished)
            return;

        var symbol = player[currentPlayer % 2].symbol;
        $cell.prop(constants.propValue, symbol);
        $cell.text(symbol);

        var winningCells = gameHasWinner();
        if (!!winningCells) {
            var msg = currentPlayer % 2 == 0
                ? constants.msgFirstPlayerWon
                : constants.msgSecondPlayerWon;
            gameFinished = true;

            strikeOutCells(winningCells);
            setTimeout(function () {
                alert(msg);
            }, 100);
        }
        currentPlayer++;
    }
});
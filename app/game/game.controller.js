module.exports = ['$scope', 'wordService', GameController];

const STATE_NOT_STARTED = 'not_started';
const STATE_INITIALIZING = 'intializing';
const STATE_PLAYING = 'playing';
const STATE_FINISHED = 'finished';

const TIME_LIMIT = 40;

function GameController($scope, wordService) {
    const self = this;
    self.wordService = wordService;
    $scope.state = STATE_NOT_STARTED;

    $scope.startGame = function startGame() {
        $scope.state = STATE_INITIALIZING;
        wordService.get((wordDetails) => {
            self.newGame($scope, wordDetails);
        });
    }

    $scope.evaluate = function(userInput) {
        self.evaluateMove($scope.currentGame);
        if ($scope.currentGame.word.original === $scope.currentGame.userInput) {
            self.updateGame($scope);
        }
    }

    $scope.stateNotStarted = () => $scope.state === STATE_NOT_STARTED;
    $scope.statePlaying = () => $scope.state === STATE_PLAYING;
    $scope.stateFinished = () => $scope.state === STATE_FINISHED;
}

GameController.prototype.newGame = function($scope, wordDetails) {
    $scope.state = STATE_PLAYING;
    $scope.currentGame = {
        score: 0,
        word: wordDetails,
        timeLeft: 40,
        userInput: "",
        previousInput: ""
    };
}

GameController.prototype.updateGame = function($scope) {
    this.wordService.get((wordDetails) => {
        $scope.currentGame.word = wordDetails;
        $scope.currentGame.userInput = "";
        $scope.currentGame.previousInput = "";
    });
}

GameController.prototype.evaluateMove = function(game) {
    const reduction = this.scoreReduction(game.previousInput, game.userInput);
    game.previousInput = game.userInput;
    game.word.score = this.reduceScore(game.word.score, reduction);
    
    if (game.word.original === game.userInput) {
        game.score += game.word.score;
    }

}

GameController.prototype.scoreReduction = function(previousInput, currentInput) {
    // If they've entered new characters, it doesn't reduce the score
    if (currentInput.length > previousInput.length) {
        return 0;
    }
    else {
        let i = 0;
        let earliestDivergence = previousInput.length;
        while (i < previousInput.length && earliestDivergence === previousInput.length) {
            if (i > currentInput.length || previousInput[i] !== currentInput[i]) {
                earliestDivergence = i;
            }
            i++;
        }
        let reduction = previousInput.length - earliestDivergence;
        return reduction;
    }
}

GameController.prototype.reduceScore = function(currentScore, reduction) {
    const newScore = currentScore - reduction;
    return (newScore > 0) ? newScore : 0;
};

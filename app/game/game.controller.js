module.exports = ['$scope', '$timeout', 'wordService', 'gameEngineService', GameController];

const STATE_NOT_STARTED = 'not_started';
const STATE_INITIALIZING = 'intializing';
const STATE_PLAYING = 'playing';
const STATE_FINISHED = 'finished';

const TIME_LIMIT = 40;


function GameController($scope, $timeout, wordService, gameEngineService) {
    const self = this;
    self.wordService = wordService;
    self.$timeout = $timeout;
    self.gameEngineService = gameEngineService;

    $scope.state = STATE_NOT_STARTED;

    $scope.startGame = function startGame() {
        $scope.state = STATE_INITIALIZING;
        wordService.get((wordDetails) => {
            $scope.currentGame = self.gameEngineService.newGame(wordDetails);
            $scope.state = STATE_PLAYING;
            $scope.timeLeft = TIME_LIMIT;
            self.startTimer($scope);
        });
    }

    $scope.evaluate = function(userInput) {
        self.gameEngineService.updateGameScore($scope.currentGame);
        if (self.gameEngineService.isCorrect($scope.currentGame)) {
            self.updateGame($scope);
        }
    }

    $scope.stateNotStarted = () => $scope.state === STATE_NOT_STARTED;
    $scope.statePlaying = () => $scope.state === STATE_PLAYING;
    $scope.stateFinished = () => $scope.state === STATE_FINISHED;
}

GameController.prototype.updateGame = function($scope) {
    this.wordService.get((wordDetails) => {
        this.gameEngineService.setNewWord($scope.currentGame, wordDetails);
    });
}

GameController.prototype.startTimer = function($scope) {
    const interval = 1000;
    const self = this;
    function tick() {
        $scope.timeLeft = $scope.timeLeft - 1;
        if ($scope.timeLeft === 0) {
            $scope.state = STATE_FINISHED;
        }
        else {
            self.$timeout(tick, interval);
        }
    }
    self.$timeout(tick, interval);
}

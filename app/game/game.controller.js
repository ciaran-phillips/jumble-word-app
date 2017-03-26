module.exports = ['$scope', 'wordService', 'gameEngineService', GameController];

const STATE_NOT_STARTED = 'not_started';
const STATE_INITIALIZING = 'intializing';
const STATE_PLAYING = 'playing';
const STATE_FINISHED = 'finished';


function GameController($scope, wordService, gameEngineService) {
    const self = this;
    self.wordService = wordService;
    self.gameEngineService = gameEngineService;

    $scope.state = STATE_NOT_STARTED;

    $scope.startGame = function startGame() {
        $scope.state = STATE_INITIALIZING;
        wordService.get((wordDetails) => {
            $scope.currentGame = self.gameEngineService.newGame(wordDetails);
            $scope.state = STATE_PLAYING;
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


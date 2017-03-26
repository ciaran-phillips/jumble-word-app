module.exports = ['$timeout', 'wordService', 'gameEngineService', GameController];

const STATE_NOT_STARTED = 'not_started';
const STATE_INITIALIZING = 'intializing';
const STATE_PLAYING = 'playing';
const STATE_FINISHED = 'finished';

const TIME_LIMIT = 40;


function GameController($timeout, wordService, gameEngineService) {
    const self = this;
    self.wordService = wordService;
    self.$timeout = $timeout;
    self.gameEngineService = gameEngineService;

    self.state = STATE_NOT_STARTED;

    self.startGame = function startGame() {
        self.state = STATE_INITIALIZING;
        wordService.get((wordDetails) => {
            self.currentGame = self.gameEngineService.newGame(wordDetails);
            self.state = STATE_PLAYING;
            self.timeLeft = TIME_LIMIT;
            self.startTimer();
        });
    }

    self.evaluate = function(userInput) {
        self.gameEngineService.updateGameScore(self.currentGame);
        if (self.gameEngineService.isCorrect(self.currentGame)) {
            self.updateGame();
        }
    }

    self.stateNotStarted = () => self.state === STATE_NOT_STARTED;
    self.statePlaying = () => self.state === STATE_PLAYING;
    self.stateFinished = () => self.state === STATE_FINISHED;
}

GameController.prototype.updateGame = function() {
    this.wordService.get((wordDetails) => {
        this.gameEngineService.setNewWord(this.currentGame, wordDetails);
    });
}

GameController.prototype.startTimer = function() {
    const interval = 1000;
    const self = this;
    function tick() {
        self.timeLeft--;
        if (self.timeLeft === 0) {
            self.state = STATE_FINISHED;
        }
        else {
            self.$timeout(tick, interval);
        }
    }
    self.$timeout(tick, interval);
}

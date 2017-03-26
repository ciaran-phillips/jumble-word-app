const STATE_NOT_STARTED = 'not_started';
const STATE_INITIALIZING = 'intializing';
const STATE_PLAYING = 'playing';
const STATE_FINISHED = 'finished';

const TIME_LIMIT = 40;


class GameController {
    constructor($timeout, wordService, gameEngineService) {
        const self = this;
        self._wordService = wordService;
        self._$timeout = $timeout;
        self._gameEngineService = gameEngineService;

        self._state = STATE_NOT_STARTED;

        self.startGame = function startGame() {
            self._state = STATE_INITIALIZING;
            wordService.get((wordDetails) => {
                self.currentGame = self._gameEngineService.newGame(wordDetails);
                self._state = STATE_PLAYING;
                self.timeLeft = TIME_LIMIT;
                self.startTimer();
            });
        }

        self.evaluate = function(userInput) {
            self._gameEngineService.updateGameScore(self.currentGame);
            if (self._gameEngineService.isCorrect(self.currentGame)) {
                self.updateGame();
            }
        }

        self.stateNotStarted = () => self._state === STATE_NOT_STARTED;
        self.statePlaying = () => self._state === STATE_PLAYING;
        self.stateFinished = () => self._state === STATE_FINISHED;
    }

    updateGame() {
        this._wordService.get((wordDetails) => {
            this._gameEngineService.setNewWord(this.currentGame, wordDetails);
        });
    }

    startTimer() {
        const interval = 1000;
        const self = this;
        function tick() {
            self.timeLeft--;
            if (self.timeLeft === 0) {
                self._state = STATE_FINISHED;
            }
            else {
                self._$timeout(tick, interval);
            }
        }
        self._$timeout(tick, interval);
    }   
}

module.exports = ['$timeout', 'wordService', 'gameEngineService', GameController];
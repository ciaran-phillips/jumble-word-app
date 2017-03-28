class GameController {

    constructor($timeout, wordService, gameEngineService) {
        this._STATE_NOT_STARTED = 'not_started';
        this._STATE_INITIALIZING = 'intializing';
        this._STATE_PLAYING = 'playing';
        this._STATE_FINISHED = 'finished';

        this._TIME_LIMIT = 40;

        this._wordService = wordService;
        this._$timeout = $timeout;
        this._gameEngineService = gameEngineService;

        this._state = this._STATE_NOT_STARTED;
    }

    evaluate(userInput) {
        this._gameEngineService.updateGameScore(this.currentGame);
        if (this._gameEngineService.isCorrect(this.currentGame)) {
            this._updateGame();
        }
    }

    startGame() {
        this._state = this._STATE_INITIALIZING;
        this._wordService.get((wordDetails) => {
            this.currentGame = this._gameEngineService.newGame(wordDetails);
            this._state = this._STATE_PLAYING;
            this.timeLeft = this._TIME_LIMIT;
            this._startTimer();
        });
    }

    skipWord() {
        this._updateGame();
    }

    stateNotStarted() {
        return this._state === this._STATE_NOT_STARTED;
    }

    statePlaying() {
        return this._state === this._STATE_PLAYING;
    }

    stateFinished() {
        return this._state === this._STATE_FINISHED;
    }

    _updateGame() {
        // At this point we have data in our local firebase, and
        // the callback should fire immediately. Otherwise we
        // would need to set an intermediate state here to 
        // pause the timer
        this._wordService.get((wordDetails) => {
            this._gameEngineService.setNewWord(this.currentGame, wordDetails);
        });
    }

    _startTimer() {
        const interval = 1000;
        const self = this;
        function tick() {
            self.timeLeft--;
            if (self.timeLeft === 0) {
                self._state = self._STATE_FINISHED;
            }
            else {
                self._$timeout(tick, interval);
            }
        }
        self._$timeout(tick, interval);
    }   
}

module.exports = ['$timeout', 'wordService', 'gameEngineService', GameController];
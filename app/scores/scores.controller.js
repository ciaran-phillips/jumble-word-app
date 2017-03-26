class ScoresController {

    constructor(gameEngineService, apiService) {
        this._gameEngineService = gameEngineService;
        this._apiService = apiService;
        this.currentGame = gameEngineService.game;

        this.userName = "";
        this.scoreEntered = false;
        this.scoresLoaded = false;
        this.position = true;
        this.list = [];
        this._loadHighScores();
    }

    submitScore() {
        // we should really be validating the inputted name here, to make sure
        // it's not empty, and not ridiculously long (we aren't truncating them)
        const scoreId = this._apiService.addScore(this.userName, this.currentGame.score);
        this.scoreEntered = true;
        this._loadHighScores((scoreList) => {
            this.position = this._getPosition(scoreId, scoreList);
        });
    }

    entered() {
        return this.scoreEntered;
    }

    notEntered() {
        return !this.entered();
    }

    _loadHighScores(callback) {
        const self = this;
        self._apiService.getScores(function retrievedHighScores(scores) {
            self.scoresLoaded = true;
            self.list = scores;

            if (typeof callback !== 'undefined') {
                callback(scores);
            }
        });
    }

    _getPosition(scoreId, scoreList) {
        let position = null;
        scoreList.forEach((item, idx) => {
            if (item.id === scoreId) {
                position = (idx + 1);
            }
        });
        return position;
    }
}

module.exports = ['gameEngineService', 'apiService', ScoresController];










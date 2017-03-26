module.exports = ['gameEngineService', 'apiService', ScoresController];

function ScoresController(gameEngineService, apiService) {
    this._gameEngineService = gameEngineService;
    this._apiService = apiService;
    this.currentGame = gameEngineService.game;

    this.userName = "";
    this.scoreEntered = false;
    this.scoresLoaded = false;
    this.position = true;
    this.list = [];
    this.loadHighScores();
}

ScoresController.prototype.loadHighScores = function(callback) {
    const self = this;
    self._apiService.getScores(function retrievedHighScores(scores) {
        self.scoresLoaded = true;
        self.list = scores;

        if (typeof callback !== 'undefined') {
            callback(scores);
        }
    });
}

ScoresController.prototype.submitScore = function() {
    const scoreId = this._apiService.addScore(this.userName, this.currentGame.score);
    this.scoreEntered = true;
    this.loadHighScores((scoreList) => {
        this.position = this._getPosition(scoreId, scoreList);
    });
}

ScoresController.prototype.entered = function() {
    return this.scoreEntered;
}

ScoresController.prototype.notEntered = function() {
    return !this.entered();
}


ScoresController.prototype._getPosition = function(scoreId, scoreList) {
    let position = null;
    scoreList.forEach((item, idx) => {
        if (item.id === scoreId) {
            position = (idx + 1);
        }
    });
    return position;
}
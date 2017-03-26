module.exports = ['gameEngineService', 'apiService', ScoresController];

function ScoresController(gameEngineService, apiService) {
    this._gameEngineService = gameEngineService;
    this._apiService = apiService;
    this.currentGame = gameEngineService.game;

    this.userName = "";
    this.scoreEntered = false;
    this.scoresLoaded = false;
    this.list = [];
    this.loadHighScores();
}

ScoresController.prototype.loadHighScores = function() {
    const self = this;
    self._apiService.getScores(function retrievedHighScores(scores) {
        self.scoresLoaded = true;
        self.list = scores;
    });
}

ScoresController.prototype.submitScore = function() {
    this._apiService.addScore(this.userName, this.currentGame.score);
    this.scoreEntered = true;
    this.loadHighScores();
}

ScoresController.prototype.entered = function() {
    return this.scoreEntered;
}

ScoresController.prototype.notEntered = function() {
    return !this.entered();
}


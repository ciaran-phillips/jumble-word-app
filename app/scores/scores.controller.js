module.exports = ['gameEngineService', ScoresController];

function ScoresController(gameEngineService) {
    this.currentGame = gameEngineService.game;
}
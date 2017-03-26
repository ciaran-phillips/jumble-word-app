const angular = require('angular');

module.exports = 
    angular.module('game', ['api'])
        .service('wordService', require('./word.service.js'))
        .service('gameEngineService', require('./gameEngine.service.js'))
        .controller('GameController', require('./game.controller.js'));
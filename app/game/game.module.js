const angular = require('angular');
require('../api/api.module.js')

module.exports = 
    angular.module('game', ['api'])
        .service('wordService', require('./word.service.js'))
        .service('gameEngineService', require('./gameEngine.service.js'))
        .controller('GameController', require('./game.controller.js'));
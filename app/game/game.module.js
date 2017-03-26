const angular = require('angular');
require('../api/api.module.js')

module.exports = 
    angular.module('game', ['api'])
        .controller('GameController', require('./game.controller.js'));
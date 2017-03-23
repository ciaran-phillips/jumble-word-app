const angular = require('angular');
const api = require('./api/api.module.js')

angular.module('app', ['api'])
    .controller('GameController', require('./game.controller.js'));
const angular = require('angular');

module.exports = 
    angular.module('scores', ['api', 'game'])
        .controller('ScoresController', require('./scores.controller.js'));
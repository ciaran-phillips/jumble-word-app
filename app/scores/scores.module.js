const angular = require('angular');

module.exports = 
    angular.module('scores', ['api'])
        .controller('ScoresController', require('./scores.controller.js'));
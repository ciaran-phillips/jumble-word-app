var angular = require('angular');
const firebaseLib = require('firebase');

angular.module('app', [])
    .constant('apiConfig', require('./api.config.js'))
    .constant('firebaseLib', firebaseLib)
    .service('firebaseService', require('./firebase.service.js'))
    .service('apiService', require('./api.service.js'))
    .controller('GameController', require('./game.controller.js'));
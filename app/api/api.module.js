const angular = require('angular');
const firebaseLib = require('firebase');

module.exports = 
    angular.module('api', [])
        .constant('apiConfig', require('./api.config.js'))
        .constant('firebaseLib', firebaseLib)
        .service('firebaseService', require('./firebase.service.js'))
        .service('apiService', require('./api.service.js'));
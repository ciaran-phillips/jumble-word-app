require('./game/game.module.js');
require('./api/api.module.js');
require('./scores/scores.module.js');

const angular = require('angular');

angular.module('app', ['game', 'scores', 'api']);
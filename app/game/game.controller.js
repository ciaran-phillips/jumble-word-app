module.exports = ['$scope', 'wordService', GameController];

function GameController($scope, wordService) {
    $scope.currentWord = "";
    wordService.get((jumbledWord) => {
        $scope.currentWord = wordDetails.jumbled;
        $scope.original = wordDetails.original;
        $scope.score = wordDetails.score;
        $scope.$apply();
    });
}
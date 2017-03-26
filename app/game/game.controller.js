module.exports = ['$scope', 'wordService', GameController];

function GameController($scope, wordService) {
    $scope.currentWord = "";
    wordService.get((jumbledWord) => {
        $scope.currentWord = jumbledWord;
    });
}
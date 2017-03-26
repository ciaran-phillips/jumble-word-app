module.exports = ['$scope', 'apiService', GameController];

function GameController($scope, apiService) {
    $scope.data = apiService.getFullDatabase();
    console.log($scope.data);
    
}
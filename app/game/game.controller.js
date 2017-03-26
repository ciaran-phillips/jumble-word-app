module.exports = ['$scope', 'apiService', GameController];

function GameController($scope, apiService) {
    $scope.data = [];
    apiService.getWords((words) => {
        $scope.data = words;
    });
    console.log($scope.data);
    
}
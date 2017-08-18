angular.module('webskeletonApp')
  .controller('BooksController', function ($scope,webindex,$location,$http,$window,$routeParams) {

$scope.loadData= function(){
	$scope.getBooks = function(){
		$http.get('/books').then(function(response){
			$scope.books = response.data;
			console.log(response);
		});
	}

	$scope.getBook = function(){
		var id = $routeParams.id;
		$http.get('/books/'+id).then(function(response){
			$scope.book = response.data;
		});
	}

	$scope.addBook = function(){
		console.log($scope.book);
		$http.post('/books', $scope.book).then(function(response){
			window.location.href='#/books';
		});
	}

	$scope.updateBook = function(){
		var id = $routeParams.id;
		$http.put('/books/'+id, $scope.book).then(function(response){
			window.location.href='#/books';
		});
	}

	$scope.removeBook = function(id){
		$http.delete('/books/'+id).then(function(response){
			window.location.href='#/books';
		});
	}
}


$scope.$watch(function(){return webindex.userData},function(newValue,oldValue){
        if(angular.equals(webindex.userData, {})){
            $window.location.href="#/login"; 
        }
    },true);
});
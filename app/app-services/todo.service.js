(function () {
    'use strict';

    angular
        .module('app')
        .factory('TodoService', Service);

    function Service($http, $q) {
        var service = {};
        
        service.GetAllTodos = GetAllTodos;
        service.GetPendingTodosCount = GetPendingTodosCount;       
        service.CreateTodo = CreateTodo;
        service.UpdateTodo = UpdateTodo;
        service.DeleteTodo = DeleteTodo;
 
        return service; 

        function GetAllTodos() {
            return $http.get('/api/todos/list/').then(handleSuccess, handleError);
        }   
		
		function GetPendingTodosCount() {
            return $http.get('/api/todos/pending-count/').then(handleSuccess, handleError);
        } 		

        function CreateTodo(todoParam) {
            return $http.post('/api/todos/create-todo', todoParam).then(handleSuccess, handleError);
        }

        function UpdateTodo(todoParam) {			
            return $http.post('/api/todos/update-todo', todoParam).then(handleSuccess, handleError);
        }

        function DeleteTodo(_id) {
            return $http.delete('/api/todos/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();

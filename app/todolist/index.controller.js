(function () {
    'use strict';

    angular
        .module('app')
        .controller('todolist.IndexController', Controller);

    function Controller($window, $scope, UserService, TodoService, FlashService) { 
        var vm = this;

        vm.user = null;
        vm.todoList = null;
        vm.pendingTodosCount = 0;
        vm.createTodo = createTodo;
		vm.updateTodo = updateTodo;
        vm.deleteTodo = deleteTodo;		
		
        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            }); 
			// get all todo list 
            TodoService.GetAllTodos().then(function (response) {
                vm.todoList = response.todoList;
            });
			// get pending todo list 
            TodoService.GetPendingTodosCount().then(function (response) {
                vm.pendingTodosCount = response.count;
            });
        }	 
		
		function createTodo() {
            var title = $.trim($('#title').val());			 		 
			 
			if(title ==''){
				alert('Please enter todo');
				return false;
			}else if(title !='' && /^[a-zA-Z0-9-.,_ ]*$/.test(title) == false) {
				alert('Todo contains illegal characters. Please enter valid todo');
				return false;
			}  
            
			var todoParam = {isDone:false, title:title}; 
			 
			TodoService.CreateTodo(todoParam)
                .then(function () {
                    FlashService.Success('Todo created');
					$('#title').val('');
					initController();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
		
        function updateTodo(id) {
            var todoParam = {isDone:false, _id:id};  
			if($('#todo_chckbox_'+id).prop('checked') == true){
				todoParam.isDone = true;
			}
			TodoService.UpdateTodo(todoParam)
                .then(function () {
                    FlashService.Success('Todo updated');
					initController();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteTodo(_id) {
			if(confirm('Are you sure want to delete this todo?')){
				TodoService.DeleteTodo(_id)
					.then(function () {
						FlashService.Success('Todo deleted');
						$("#todo_list_"+_id).remove();
						initController();
						// redirect to todo listing
						//$state.go('todo-list');
					})
					.catch(function (error) {
						FlashService.Error(error);
					});
			}else{
				return false;
			}				
        }
    }

})();
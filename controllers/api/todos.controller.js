var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var todoService = require('services/todo.service');

// routes
router.get('/list/', getAllTodos);
router.get('/pending-count/', getPendingCount);
router.post('/create-todo', createTodo);
router.post('/update-todo', updateTodo);
router.delete('/:_id', deleteTodo);

module.exports = router;
 
function getAllTodos(req, res) {  
	//get logged user id
    var userId = req.user.sub;   
    
	todoService.getAllTodos(userId)
        .then(function (todoList) {
            res.send({'status':1,'todoList':todoList});
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getPendingCount(req, res) {  
	//get logged user id
    var userId = req.user.sub;   
    
	todoService.getPendingCount(userId)
        .then(function (count) {
            res.send({'status':1,'count':count});
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function createTodo(req, res) {
    var userId = req.user.sub; 
	var todoParam = {};	
	todoParam.title = req.body.title;	 
	todoParam.isDone = req.body.isDone;	 	 
	
	// Checking if todo already exist
    if (todoParam.title != '') {
        
		todoService.create(userId,todoParam)
			.then(function () {
				res.sendStatus(200);
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}else{
		return res.status(400).send('Something missing on update todo');
	}
}

function updateTodo(req, res) {
    var userId = req.user.sub; 
	var todoParam = {};
	todoParam._id = req.body._id;
	todoParam.isDone = req.body.isDone;	 
	todoParam.userId = userId; 
	
    if (todoParam._id != '') {
        
		todoService.update(todoParam)
			.then(function () {
				res.sendStatus(200);
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}else{
		return res.status(400).send('Something missing on update todo');
	}	
}

function deleteTodo(req, res) {
    
	var userId = req.user.sub;
	var todoId = req.params._id;
	if(userId !='' && todoId !=''){
    todoService.delete(todoId,userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
	}else{
		return res.status(400).send('Something missing on delete todo');
	}		
}
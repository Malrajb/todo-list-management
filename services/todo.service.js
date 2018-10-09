var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('todos');

var service = {};
 
service.getAllTodos = getAllTodos;
service.getPendingCount = getPendingCount;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service; 

function getAllTodos(userId) {	 
    var deferred = Q.defer();
	
	db.collection('todos').find({user_id:mongo.helper.toObjectID(userId)},{'sort':{createdAt:-1}}).toArray(function(err, result) {
		if (err) deferred.reject(err.name + ': ' + err.message);

        if (result) {
            // return todo(s)  
            deferred.resolve(result);
        } else {
            // todo not found
            deferred.resolve();
        }
    }); 
	
    return deferred.promise;
}

function getPendingCount(userId) {	 
    var deferred = Q.defer();
	var user_id = mongo.helper.toObjectID(userId)
	db.todos.count({user_id:user_id, isDone:false},function(err, count) {
		if (err) deferred.reject(err.name + ': ' + err.message);

        if (count) {
            // return todo(s)  
            deferred.resolve(count);
        } else {
            // todo not found
            deferred.resolve();
        }
    }); 
	
    return deferred.promise;
}

function create(userId,todoParam) {
    var deferred = Q.defer();
	var user_id = mongo.helper.toObjectID(userId);
    // validation
    db.todos.findOne(
        { title: todoParam.title, user_id: user_id },
        function (err, todo) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (todo) {
                // title already exists
                deferred.reject('Todo "' + todoParam.title + '" is already exist!');
            } else {
                createTodo();
            }
        });

    function createTodo() {      
		todoParam.user_id = user_id;
		todoParam.createdAt = new Date();
        db.todos.insert(
            todoParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(todoParam) { 
    var deferred = Q.defer();
	var _id = todoParam._id;
	var userId = todoParam.userId;
	 
	var set = {
		isDone: todoParam.isDone,
		updatedAt : new Date()		
	};
	
	// fields to update with todo id & userId 
	db.todos.update(
		 { _id: mongo.helper.toObjectID(_id), user_id: mongo.helper.toObjectID(userId) },
		{ $set: set },
		function (err, doc) {
			if (err) deferred.reject(err.name + ': ' + err.message);

			deferred.resolve();
		});

    return deferred.promise;
}

function _delete(_id,userId) { 
    var deferred = Q.defer();
	
	// remove todo with todo id & userId 
    db.todos.remove(
        { _id: mongo.helper.toObjectID(_id), user_id: mongo.helper.toObjectID(userId) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
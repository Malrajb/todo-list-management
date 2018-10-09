const mongoose =require('mongoose'); 
const Schema = mongoose.Schema;

let TodosSchema = new Schema({
	title  : {type:String, max:100, required:true },
	user_id : {type:Schema.Types.ObjectId, ref: 'users',required:true  },
	isDone : {type: Boolean, default:false, required:true}, 
	createdAt : {type: Date, required:true},
	updatedAt : {type: Date},
});

module.exports = mongoose.model('todos', TodosSchema);   
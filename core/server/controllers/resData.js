/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/4/16 .
 * Revise person：qimuyunduan
 * Revise Time：16/4/16 下午4:00
 * @version
 *
 */


//the base response data structure

function Response(){
	this.status = {statusCode:200,message:""};
	this.totalNumber = 0;
	this.responseData = [];
}
// the message returned to client
function setMessage(message){

	if (message != "") {
		this.status.message = message;
	}

}

function  setSuccessStatusCode(){
	this.status.statusCode = 200
}

function setFailStatusCode(){
	this.status.statusCode = 404
}
//the total records for result
function  setTotalRecords(totalRecords){

	if (typeof(totalRecords)=='number'){
		this.totalNumber = totalRecords ;
	}

}

function setResponeseData(){

}
module.exports = Response;
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
function Response(){
	this.message = "";
	this.currenPage = 0;
	this.totalPages = 0;
	this.result = [];
}
// the message returned to client
function setMessage(message){

	if (message != "") {
		this.message = message;
	}

}
function setCurrentPage(page) {

	if (page != this.currenPage){
		this.currenPage = page ;
	}

}
//the total data pages
function  setTotalPages(totalPages){

	if (totalPages != this.totalPages){
		this.totalPages = totalPages ;
	}

}
function  setResult(result){

	if (!_.empty(result)){
		this.result = result;
	}
}
Response.prototype.getCurrentPage=function(){
	return this.currenPage;
};
Response.prototype.getTotalPages=function(){
	return this.totalPages;
};

function setResponseData(cur,total,result,message) {

	setCurrentPage(cur);
	setMessage(message);
	setResult(result);
	setTotalPages(total);
}
//send response data
Response.prototype.responseData=function (cur,total,result,message) {
	var self = this;
	setResponseData(cur,total,result,message);
	return {
		"currentPage":self.currenPage,
		"totalPage":self.totalPages,
		"result":self.result,
		"message":self.message

	};
};
module.exports = Response;
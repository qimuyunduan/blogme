var _       = require('lodash'),
	resData = require('./resData'),
	utils  = require('../utils');

var dataPrefix  = '<td><input type="checkbox" name="checkCtrl"></td>';
/**
 * formats response data for client.
 */

// get the wanted fields values
function filterFields(values,fields){
	var filterValues=[];
	if(_.isArray(values)){
		var length = values.length;
		for(var i=0;i<length;i++){
			if(_.isObject(values[i])){
				var filterObject = utils.filters.filterObject(values[i],fields);
				if(filterObject){
					filterValues.push(filterObject);
				}
			}
		}
	}else if(_.isObject(values)){
		 filterValues = utils.filters.filterObject(values,fields);
	}

	return filterValues;
}

function constructResponseData(){

}

function successWithInfo(){

}
function successWithData(){

}
function successWithPageData(values,fields,pageNumber,pageLimit,isContainCheckbox){
	var pageNum = pageNumber==undefined ? 0:pageNumber;
	var pageRecordsNum = pageLimit==undefined ? 50:pageLimit;
	var totalPages = 0;
	var subValues = [];
	if(_.isArray(values)){
		var length = values.length;

		totalPages =  length%pageRecordsNum==0 ?length/pageRecordsNum :length/pageRecordsNum+1;

		if(pageNum<=totalPages){
			subValues = _.slice(values,pageNum*pageRecordsNum,pageNum*pageRecordsNum+pageRecordsNum);
			var filteredSubValues = filterFields(subValues,fields);
			if(filteredSubValues){
				if(isContainCheckbox){

				}
			}
		}


	}
}
function fail(){

}

module.exports = {
    SuccessWithInfo: successWithInfo,
	SuccessWithData:successWithData,
	SuccessWithPageData:successWithPageData,
    Fail: fail
};

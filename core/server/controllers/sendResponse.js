var _       = require('lodash'),
	utils  = require('../utils');

var dataPrefix  = '<tr><td><input type="checkbox" name="checkCtrl"></td>';
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
				var filterValue = utils.filters.filterObject(values[i],fields);
				if(filterValue){
					filterValues.push(filterValue);
				}
			}
		}
	}else if(_.isObject(values)){
		 filterValues = utils.filters.filterObject(values,fields);
	}

	return filterValues;
}


function replyWithData(values,fields){
	var data = filterFields(values,fields);
	if(data){
		return {err:false,data:data};
	}
	return fail();
}
function replyWithPageData(values,fields,reqBody){
	var pageNum = reqBody.currentPage;
	var pageRecordsNum = reqBody.numPerPage;
	var fieldLength = fields.length;
	var totalPages = 0;
	var tableData = "";
	console.log('current page is '+pageNum);
	console.log('fieldLength is '+fieldLength);
	console.log('records per page is '+pageRecordsNum);
	if(_.isArray(values)){
		var length = values.length;
		console.log('total record is '+length);
		totalPages =  (length%pageRecordsNum) == 0 ? length/pageRecordsNum :parseInt(length/pageRecordsNum)+1;
		console.log('total page is '+totalPages);
		if (pageNum > totalPages) {
		} else {
			//截取一页的数据
			var subValues = _.slice(values, (pageNum - 1) * pageRecordsNum, (pageNum - 1) * pageRecordsNum + pageRecordsNum);
			console.log('filter subValues is');
			var filteredSubValues = filterFields(subValues, fields);
			console.log(filteredSubValues);
			if (filteredSubValues) {
				dataPrefix = reqBody.containCheckBox ? dataPrefix : "<tr>";
				pageRecordsNum = pageRecordsNum<length ? pageRecordsNum:length;
				for (var i = 0; i < pageRecordsNum; i++) {
					tableData += dataPrefix;
					for (var j = 0; j < fieldLength; j++) {

						if(filteredSubValues[i][j]){
							tableData += "<td>" + filteredSubValues[i][j] + "</td>";
						}
						else{
							tableData += "<td>" + "" + "</td>";
						}
					}
					tableData += "</tr>";
				}

				return {err: false, data: {tableData: tableData, totalCount: length}}
			}

		}

	}

	return fail();
}
function fail(){
	return {err:true};
}

module.exports = {
	replyWithData:replyWithData,
	replyWithPageData:replyWithPageData
};

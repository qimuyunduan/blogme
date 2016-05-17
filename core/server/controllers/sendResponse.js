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

	if(_.isArray(values)){
		var length = values.length;

		totalPages =  (length%pageRecordsNum) == 0 ? length/pageRecordsNum :parseInt(length/pageRecordsNum)+1;

		if (pageNum <= totalPages||pageNum==-1) {
			var subValues;
			if(pageNum == -1||pageNum==totalPages-1){
				subValues = _.slice(values, (totalPages - 1) * pageRecordsNum);
			}
			else{
				//截取一页的数据
				subValues = _.slice(values, pageNum * pageRecordsNum, pageNum * pageRecordsNum + pageRecordsNum);
			}

			var filteredSubValues = filterFields(subValues, fields);

			if (filteredSubValues) {
				dataPrefix = reqBody.containCheckbox ? dataPrefix : "<tr>";
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

	return {err:false,data:{tableData:'',totalCount:0}};
}
function fail(){
	return {err:true};
}

module.exports = {
	replyWithData:replyWithData,
	replyWithPageData:replyWithPageData
};

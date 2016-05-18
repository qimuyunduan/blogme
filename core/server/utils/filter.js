/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/5/8 .
 * Revise person：qimuyunduan
 * Revise Time：16/5/8 上午9:33
 * @version
 *
 */
var _ = require('lodash');


// filter array values
//eg: filter:[1,2,4] will get (data[1],data[2],data[4])
function filterArray(data, filters) {
	var values = [];

	if (_.isArray(data) && _.isArray(filters)) {
		var countData = data.length;
		var countFilter = filters.length;
		if (countData >= countFilter) {
			filters.sort();
			for (var i = 0; i < countFilter; i++) {
				if (filters[i] < countData) {
					values.push(data[filters[i]]);
				}
			}
			return values;
		}
	}
	return false;
}

// filter  object element based on keys
function filterObject(data, keys) {
	var values = [];
	if (_.isObject(data) && _.isArray(keys)) {

		var dataKeys = _.keys(data);
		var countFilter = keys.length;
		if (dataKeys.length >= countFilter) {

			for (var i = 0; i < countFilter; i++) {
				if (_.indexOf(dataKeys, keys[i]) != -1) {
					values.push(data[keys[i]]);
				}
			}
			return values;
		}
	}
	return false;
}
function filterArrays(values, filterIndexs, fields) {
	var data = [];
	if(_.isArray(values)&&!_.isEmpty(values)&&filterIndexs.length==fields.length){

		_.forEach(values,function (value) {
			var filteredValues = filterArray(value,filterIndexs);
			data.push(_.zipObject(fields,filteredValues));
		});
	}
	return data ? data:false;
}
function compactObj(obj) {
	var length = _.keys(obj).length;
	var keys = _.keys(obj);
	var values = _.values(obj);
	var index = [];
	for (var i = 0; i < length; i++) {
		values[i] += '';
		if (values[i].length == 0) {
			index.push(i);
		}
	}
	_.pullAt(keys, index);
	_.pullAt(values, index);
	return _.zipObject(keys, values);
}

module.exports = {
	filterArray: filterArray,
	filterArrays: filterArrays,
	filterObject: filterObject,
	compactObj: compactObj
};
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
		var countData = _.keys(data).length;
		var countFilter = keys.length;
		if (countData >= countFilter) {

			for (var i = 0; i < countFilter; i++) {
				if (data[keys[i]]) {
					values.push(data[keys[i]])
				}
			}
			return values;
		}
	}
	return false;
}
module.exports = {filterArray: filterArray, filterObject: filterObject};
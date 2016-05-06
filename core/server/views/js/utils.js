/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/5/3 .
 * Revise person：qimuyunduan
 * Revise Time：16/5/3 下午2:29
 * @version
 *
 */


//clear left and right blanks
function trimLeftRight(strArr) {
	var length = 0;
	if ($.isArray(strArr)) {
		length = strArr.length;
		for (var i = 0; i < length; i++) {
			strArr[i] = strArr[i].replace(/^\s+|\s+$/g, "");
		}
	}
	return strArr;
}


// check :is empty for every field and trim blanks

function checkTrim(values) {
	var sumLength = 0;
	if ($.isArray(values)) {
		var count = values.length;
		for (var i = 0; i < count; i++) {
			//去掉所有空格
			values[i] = values[i].replace(/\s+/g, "");
			sumLength += values[i].length;
		}
	}
	if (sumLength == 0) {
		alertMsg.warn("输入内容不能为空......");
		return false;
	}
	else {
		return values;
	}


}


// merge two array to object
function mergeToObject(keys,values){
	var hash = {};
	if($.isArray(keys) && $.isArray(values)&& keys.length == values.length){
		var length = keys.length;
		for (i = 0;i < length; i++) {
			hash[keys[i]] = values[i];
		}
	}
	return hash;
}

function isContainSpecialChar(strArr) {

	//匹配特殊字符
	var pattern=/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
	if ($.isArray(strArr)) {
		var count = strArr.length;
		for (var i = 0; i < count; i++) {
			if (pattern.test(strArr[i])) {
				alertMsg.warn("输入框内包含有非法字符......");
				return true;
			}
		}
	}
	return false;

}
//antiSQL
function antiSQL(values) {

	var regex = /select|update|delete|exec|count|’|"|=|;|>|<|%/i;
	var length = values.length;
	if ($.isArray(values)) {
		for (var i = 0; i < length; i++) {
			if (regex.test(values[i])) {
				alertMsg.warn("请不要输入特殊字符串...");
				return false;
			}
		}
	}

	return true;
}


//获取去除空格后每个查询字段的值
function getQueryObject(formID) {
	var form = $('#' + formID);
	var keys = [];
	var values = [];
	var queryObject = {};
	if (form) {
		var querySer = form.serializeArray();
		$.each(querySer, function (i, field) {
			keys.push(field.name);
			values.push(field.value);
		});

	}
	//add control for showing records
	keys.push("numPerPage");
	keys.push("currentPage");
	var results = checkTrim(values);
	if (results) {
		if (!isContainSpecialChar(results)) {
			if (antiSQL(values)) {
				results.push("50");
				results.push("1");
				alert(keys);
				alert(values);
				queryObject = mergeToObject(keys, results);
				return queryObject;
			}
		}

	}
	return false;
}
//send get request
function queryRecords(formID, url) {

	var data = getQueryObject(formID);
	//send request
	if (data) {
		$.ajax({
			type: "GET",
			url: url,
			data: data,
			async: false,
			error: function () {
				alertMsg.error("数据查询失败...");
			}
		});
	}


}
//send post request
function addRecords(formID, url) {
	if (document.getElementById(formID)) {
		if (antiSQL(formID, 2)) {
			$.ajax({
				type: "POST",
				url: url,
				data: $('#' + formID).serialize(),
				async: false,
				error: function () {
					alertMsg.error("增加记录失败...");
				}
			});
		}
	}
}
//send update requests
function updateRecords(formID, url) {
	if (document.getElementById(formID)) {
		if (antiSQL(formID, 2)) {
			$.ajax({
				type: "PUT",
				url: url,
				data: $('#' + formID).serialize(),
				async: false,
				error: function () {
					alertMsg.error("更新记录失败...");
				}
			});
		}
	}

}
//send delete requset
function deleteRecords(formID, url) {
	if (document.getElementById(formID)) {
		if (antiSQL(formID, 2)) {
			$.ajax({
				type: "DELETE",
				url: url,
				data: $('#' + formID).serialize(),
				async: false,
				error: function () {
					alertMsg.error("删除记录失败...");
				}
			});
		}
	}
}

//dispose user login
function login(formID) {
	if (antiSQL(formID, 2)) {
		$.ajax({
			type: "POST",
			url: url,
			data: $('#' + formID).serialize(),
			async: false,
			error: function () {
				alertMsg.error("...");
			}
		});
	}
}


// request
//$.ajax({
//	type: "POST”,//PUT GET DELETE
//	url:ajaxCallUrl,
//	data:$('#yourformid').serialize(),// 你的formid
//	async: false,
//	error: function(request) {
//		alert("Connection error");
//	},
//	success: function(data) {
//		$("#commonLayout_appcreshi").parent().html(data);
//	}
//});


//alert
//alertMsg.confirm("msg")
//alertMsg.correct("msg");
//alertMsg.error("msg");
//alertMsg.warn("msg");
//alertMsg.info("msg");


//navTab

//open
//navTab.openTab(tabid,title,url,[data])
//reload
//navTab.reload(url,data.[tabid])
//close
//navTab.closeTab(tabid)
//navTab.closeCurrent()
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
//check field values length
function checkLength(min, max, values, login) {
	var length = 0;
	if ($.isArray(values)) {
		length = values.length;
		if (login) {
			for (var i = 0; i < length - 1; i++) {
				if (values[i].length < min || values[i].length > max) {
					setMessage("用户名和密码长度不小于6...");
					return false;
				}
			}
		} else {
			for (var j = 0; j < length; j++) {
				if (values[j].length < min || values[j].length > max) {
					alertMsg.info("输入框内容长度不小于6...");
					return false;
				}
			}
		}

	}
	return true;
}


// merge two array to object
function mergeToObject(keys, values) {
	var hash = {};
	if ($.isArray(keys) && $.isArray(values) && keys.length == values.length) {
		var length = keys.length;
		for (i = 0; i < length; i++) {
			hash[keys[i]] = values[i];
		}
	}
	return hash;
}

function isContainSpecialChar(strArr, isLogin) {

	//匹配特殊字符
	var pattern = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
	if ($.isArray(strArr)) {
		var count = strArr.length;
		for (var i = 0; i < count; i++) {
			if (pattern.test(strArr[i])) {

				if (isLogin) {
					setMessage("用户名或密码包含有非法字符......");
					return true;
				}
				alertMsg.warn("输入框内包含有非法字符......");
				return true;

			}
		}
	}
	return false;

}
//antiSQL
function antiSQL(values, isLogin) {

	var regex = /select|update|delete|insert|exec|count|’|"|=|;|>|<|%/i;
	var length = values.length;

	if ($.isArray(values)) {
		for (var i = 0; i < length; i++) {
			if (regex.test(values[i])) {

				if (isLogin) {
					setMessage("用户名或密码含有特殊字符串...");
					return false;
				}
				alertMsg.warn("请不要输入特殊字符串...");
				return false;

			}
		}
	}

	return true;
}

function getKeysAndValues(formId) {
	var form = $('#' + formId);
	var keys = [];
	var values = [];
	if (form) {
		var querySer = form.serializeArray();
		$.each(querySer, function (i, field) {
			keys.push(field.name);
			values.push(field.value);
		});

	}
	return {keys: keys, values: values};

}
//获取去除空格后每个查询字段的值
function getQueryObject(formID, method, pageLimit, containCheckbox) {

	var data = getKeysAndValues(formID);
	var keys = data.keys;
	var values = data.values;
	var queryObject = {};
	//add control for showing records
	if (method == 'get') {
		keys.push("numPerPage");
		keys.push("currentPage");
		keys.push("containCheckbox");
		keys.push('forSearch');
	}

	var results = checkTrim(values);
	if (results) {
		if (!isContainSpecialChar(results)) {
			if (antiSQL(values)) {
				if (method == 'get') {
					if (pageLimit) {
						results.push(pageLimit);
					}
					else {
						results.push("50");
					}

					results.push("1");
					if (containCheckbox) {
						results.push("false");
					} else {
						results.push("true");
					}
					results.push('true');
				}
				queryObject = mergeToObject(keys, results);
				return queryObject;
			}
		}

	}
	return false;
}

// get table row data
function getRowData(method, containCheckbox) {
	var tr_s = $('tbody :checked').parents('tr');

	var data = [];
	if (typeof(tr_s) == 'object') {

		var trsCount = tr_s.length;

		if (method == 'put') {
			if (trsCount > 1) {
				alertMsg.info('只能选择一个...');
				return;
			}
			else if (trsCount == 0) {
				alertMsg.info('请先选择一个...');
				return;
			}
		} else {
			if (trsCount == 0) {
				alertMsg.info('请先选择一个...');
				return;
			}
		}

		var cellCount = tr_s[0].cells.length;


		for (var i = 0; i < trsCount; i++) {

			var j = containCheckbox ? 0 : 1;
			data[i] = [];

			if (j) {
				for (; j < cellCount; j++) {
					data[i][j - 1] = tr_s[i].cells[j].innerHTML;
				}
			}
			else {
				for (; j < cellCount; j++) {
					data[i][j] = tr_s[i].cells[j].innerHTML;
				}
			}

		}
	}
	if (data) {
		return {data: data};
	}
	else {
		return false;
	}

}

function changePageNum() {

}

function responseEnter() {
	if (event.keyCode == 13) {
		login();
	}
}
function search(url) {
	if (event.keyCode == 13) {
		sendRequest('pagerForm', url, 'get');
	}
}
function getCookieValue(name) {

	var start = document.cookie.indexOf(name + "=");

	if (start != -1) {

		start = start + name.length + 1;
		var end = document.cookie.indexOf(";", start);
		if (end == -1) {
			end = document.cookie.length;
		}
		return document.cookie.substring(start, end);

	}
	return false;
}

function changePwd(formID, url, method) {

	var userName = getCookieValue('loginUserName');
	if (userName) {
		var formData = getKeysAndValues(formID);
		formData.keys.push("userName");
		formData.values.push(userName);
		var trimedValues = checkTrim(formData.values);

		if (trimedValues) {
			if (antiSQL(trimedValues)) {
				if (checkLength(6, 20, trimedValues)) {

					if (trimedValues[0] == trimedValues[1]) {
						alertMsg.info("新密码与原密码应该不一致...");
					}
					else if (trimedValues[1] == trimedValues[2]) {

						formData = mergeToObject(formData.keys, trimedValues);
						$.ajax({
							type: method,
							url: url,
							data: formData,
							async: false,
							error: function () {
								alertMsg.error("sorry!链接服务器失败......");
							},
							success: function (data) {
								alertMsg.info(data);
								if (data == "success") {
									alertMsg.info("修改密码成功......");
								}
								else {
									alertMsg.warn("你输入的原始密码不正确...");
								}
							}
						});
					}
					else {
						alertMsg.warn("两次输入的密码不一致......");
					}
				}
			}

		}
	}

}

//send request

function sendRequest(url, method, formId, pageNum, containCheckbox) {


	var queryData;

	if (formId) {
		queryData = getQueryObject(formId, method, pageNum, containCheckbox);
	}
	else {
		queryData = getRowData(method, containCheckbox);
	}
	if (queryData) {
		$.ajax({
			type: method,
			url: url,
			data: queryData,
			async: false,
			dataType: "json",
			error: function () {
				alertMsg.error("sorry!链接服务器失败...");
			},
			success: function (Pagedata) {


				if (!Pagedata.err) {

					switch (method) {
						case 'post':
							alertMsg.info("创建成功...");
							break;
						case 'put':
							alertMsg.info("修改成功...");
							break;
						case 'delete':
							alertMsg.info("删除成功...");
							break;
						case 'get':
							$("#tbody").html(Pagedata.data.tableData);
							$("#totalCount").html(Pagedata.data.totalCount);
							break;
						default:
							break;
					}

				}
				else {
					switch (method) {
						case 'post':
							alertMsg.error("创建失败...");
							break;
						case 'put':
							alertMsg.error("修改失败...");
							break;
						case 'delete':
							alertMsg.error("删除失败...");
							break;
						case 'get':
							alertMsg.error('发生错误...');
							break;
						default:
							break;
					}
				}
			}

		});
	}

}

function sendChangeRecordRequest(url) {
	var data = getRowData('put');
	if (data) {
		$.ajax({
			type: 'put',
			url: url,
			data: data,
			async: false
		})
	}
}


function fillUserName() {
	var userName = getCookieValue('loginUserName');
	$('#loginUserName').val(userName);
}
function setMessage(message) {
	$('#loginUserName').val(message);
	$('#pwd').val("");
	setTimeout(fillUserName, 1500);
}

//dispose user login
function login() {

	var queryObject = getKeysAndValues('loginForm');
	var result = checkTrim(queryObject.values);

	if (checkLength(6, 20, result, true)) {
		if (!isContainSpecialChar(result, true)) {

			if (antiSQL(result, true)) {
				queryObject = mergeToObject(queryObject.keys, result);
				$.ajax({
					type: "post",
					url: "index",
					data: queryObject,
					async: false,
					error: function () {
						alert("sorry!链接服务器失败......");
					},
					success: function (data) {

						if (data == "success") {
							window.location = "/authorized"
						}
						else {
							setMessage("用户名或密码错误...");
						}
					}
				});

			}
		}

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
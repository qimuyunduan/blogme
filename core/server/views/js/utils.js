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

// check :is empty for every field

function isEmptyFields(values){
	if($.isArray(values)){
		var count = values.length;
		for(var i=0;i<length;i++){
			if(decodeURI()){

			}

		}
	}


}


//antiSQL
function antiSQL(formID,excludeElementNumber) {

	re = /select|update|delete|exec|count|’|"|=|;|>|<|%/i;
	var form = $("#"+formID);
	for(var i=0;i<form.elements.length-excludeElementNumber;i++){
		if (re.test(form.elements[i].value)) {
			alertMsg.warn("请不要输入特殊字符...");
			form.elements[i].value = "";

			return false;
		}
	}
	return true;
}


//获取每个查询字段的值
function getFieldSValue(formID){
	var form = document.getElementById(formID);
	var values = [];
	if(form){
		var queryStr = form.serialize();
		var splitedStr = queryStr.split(/[=&]/);
		var length = splitedStr.length;
		for(var i=1;i<length;i+=2){
			if(i<length){
				values.push(splitedStr[i]);
			}

		}
	}
	return values;
}
//send get request
function queryRecords(formID, url) {

		alert(getFieldSValue(formID));

		//alert(queryStr);
		//var spliedStr = queryStr.split(/[=&]/);

		//alert(decodeURI(queryStr));
		//if(!isEmptyFields(queryStr)){
		//	if(antiSQL(formID,2)){
		//		$.ajax({
		//			type: "GET",
		//			url: url,
		//			data: $('#' + formID).serialize(),
		//			async: false,
		//			error: function () {
		//				alertMsg.error("数据查询失败...");
		//			}
		//		});
		//	}
		//
		//}



}
//send post request
function addRecords(formID, url) {
	if (document.getElementById(formID)) {
		if(antiSQL(formID,2)){
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
		if(antiSQL(formID,2)){
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
		if(antiSQL(formID,2)){
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
	if(antiSQL(formID,2)){
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
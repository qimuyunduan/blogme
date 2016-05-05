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


//send get request
function queryRecords(formID,url){

	if($("#"+formID)){
		$.ajax({
		type: "GET",
		url:url,
		data:$('#'+formID).serialize(),
		async: false,
		error: function() {
			alert("error");
		}
});
	}

}
//send post request
function addRecords(){

}
//send update requests
function updateRecords(){

}
//send delete requset
function deleteRecords(){

}

//dispose user login
function login(){

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
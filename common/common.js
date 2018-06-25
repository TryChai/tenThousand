
function http_post(url, data, success, fail){

	var app = getApp()
	var host = app.api.host;

	wx.request({
		url: host + url,
		data: data,
        method: 'POST',
        dataType: 'json',
		header: {
            'Content-Type': 'application/x-www-form-urlencoded'
		},
		success: function( res ) {
			typeof success == "function" && success(res);
		},
		fail: function(e){
			console.log('获取失败');
			console.log(e);

			typeof fail == "function" && fail(data);
		}
	})

}
module.exports.http_post = http_post


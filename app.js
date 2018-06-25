import footerState from './template/footerList/data'
var common = require('/common/common.js');

//app.js
App({
	// 接口地址
	api: {
		cdn_path:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/',
		host: "https://wxjzywt.homekoo.com",
		yuyue: "/Activity/Wxtenthousand/commitTheEnrolment.html",
		get_openid: "/Activity/WeixinShareAPI/getOpenid.html",
		index_url:"https://wxjzywt.homekoo.com/Activity/TenthousandIndex.html",
		article_setzan:"https://wxjzywt.homekoo.com/Activity/ArticlesTags/setTags.html",
		article_cancelzan:"https://wxjzywt.homekoo.com/Activity/ArticlesTags/cancelTags.html",
		get_ganhuo:"https://wxjzywt.homekoo.com/Activity/Ganhuo/get_ganhuo.html",
		ganhuo_detail:"https://wxjzywt.homekoo.com/Activity/Ganhuo/get_detail.html",
		setcomment:"https://wxjzywt.homekoo.com/Activity/ArticlesComment/setComments.html",
		comment_setzan:"https://wxjzywt.homekoo.com/Activity/TenthousandIndex/setCommentTags.html",
		comment_concelzan:"https://wxjzywt.homekoo.com/Activity/TenthousandIndex/cancelCommentTags.html",
		article_setcollect:"https://wxjzywt.homekoo.com/Activity/ArticlesCollection/setCollection.html",
		article_concelcollect:"https://wxjzywt.homekoo.com/Activity/ArticlesCollection/cancelCollection.html",
		get_vcode:"https://wxjzywt.homekoo.com/Activity/login/code_action.html",
		login_url:"https://wxjzywt.homekoo.com/Activity/login/login_action.html",
		is_login:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/is_login.html",
		designer_nearby:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/designer_nearby.html",
		yuyue:"https://wxjzywt.homekoo.com/Activity/Wxbaoming/ajax.html",
		atten:"https://wxjzywt.homekoo.com/Activity/ArticlesSubscribe/subscribeApi.html",
		cancelAtten:"https://wxjzywt.homekoo.com/Activity/ArticlesSubscribe/subscribeCancelApi.html",
		loginout:"https://wxjzywt.homekoo.com/Activity/Login/login_exit.html",
		upload:"https://wxjzywt.homekoo.com/Activity/Ganhuo/uploadPic.html",
		fabu:"https://wxjzywt.homekoo.com/Activity/Ganhuo/shaijiaUpload.html",
		user_search:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/searchDesigner.html",
		user_index:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/getSelfAnli.html",
		friend:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/friend.html",
		end_edit:"https://wxjzywt.homekoo.com/Activity/Ganhuo/AnliTempTable.html",
		user_edit:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/getShaijiaEdit.html",
		user_delete:"https://wxjzywt.homekoo.com/Activity/Ganhuo/upliadPicDel.html",
		design_liangchi:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/getTheliangchi.html",
		user_collect:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/getCollections.html",
		user_article:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/getArticles.html",
		get_fanslist:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/getFans.html",
		user_atten:"https://wxjzywt.homekoo.com/Activity/ArticlesSubscribe/userSubscribeApi.html",
		user_cancelAtten:"https://wxjzywt.homekoo.com/Activity/ArticlesSubscribe/userSubscribeCancelApi.html",
		check_edit:"https://wxjzywt.homekoo.com/Activity/Ganhuo/editFinish.html",
		updata_user:"https://wxjzywt.homekoo.com/Activity/ArticlesUser/ArticlesUserInfo.html",
	},
	// 全局变量
	globalData: {
		caseId: 1000098, //案例ID 1000098 多张户型图 1000089 单张户型图 1000090 无户型图
		designerId: 2227, //设计师id
		userinfo: [],
		openid: '',
		store: {
			footerState: footerState
		},
	},
	// 获取用户信息
	getUserInfo: function (cb,callback) {
		var that = this;
		if (this.globalData.userInfo) {
			wx.setStorageSync('userInfo',this.globalData.userInfo);
			typeof cb == "function" && cb(this.globalData.userInfo);
			wx.hideToast();
			// that.updataUser();
		} else {
			//调用登录接口
			wx.login({
				success: function (e) {
					wx.getUserInfo({
					  success: function(res) {
					  	that.globalData.userInfo = res.userInfo;
					  	wx.setStorageSync('userInfo',res.userInfo);
					  	typeof cb == "function" && cb(res.userInfo);
					  	wx.hideToast();
					    that.updataUser();
					  },
					  fail(){
					  	 wx.showModal({
				          title: '提示',
				          content: '为正常使用此应用，需开启“用户信息授权”，点击确定重新获取授权',
				          // showCancel:false,
				          success:function(res){
				          		wx.openSetting({
				          		 success: function (data) {
				          		   	console.log(data);
				          		   if (data) {
				          		     if (data.authSetting["scope.userInfo"] == true) {
				          		       wx.getUserInfo({
					          		         withCredentials: false,
					          		         success: function (data) {
					          		         	wx.hideToast();
					          		         	that.updataUser();
					          		         },
					          		         fail: function () {
					          		         }  
				          		        });
				          		     }
				          		   }                        },
				          		 fail: function () {
				          		   console.info("设置失败返回数据");
				          		}       
				               });
				          	}
				      	})
					  }
					})
					var code = e.code;
					var url = that.api.get_openid;
					var data = { "code": code ,'wxid':6};
					common.http_post(url, data, function (res) {
						var data = res.data;
						if (data.code == 200) {
							if(typeof callback!='undefined') callback(res);
							that.globalData.openid = data.openid;
							// console.log(data.openid);
							
							wx.setStorageSync('openid',data.openid);
						}
					}, function (e) {
						console.log('获取失败');
						console.log(e);
					});
				},
				fail: function (e) {
					console.log(e);
				}
			})
		}
	},
	tongji_visit: function (key1, key2, is_share) {
		var that = this

		if (typeof (is_share) == "undefined") {
			is_share = 0;
		}

		var url = that.api.tongji_visit;
		var data = {
			'key1': key1,
			'key2': key2,
			'is_share': is_share,
			'openid': that.globalData.openid
		};

		common.http_post(url, data, function (res) {
			var data = res.data;
			console.log('分析提交成功');
		}, function (res) {
			console.log('分析提交失败');
		});
	},
	//改变底部按钮状态
	footerStateChange: function (type = 'global', num, cb) {
		switch (type) {
			case 'global':
				this.globalData.store = Object.assign({}, this.globalData.store, {
					footerState: this.globalData.store.footerState.map((value, index) => {
						if (index == num) value.key = true;
						else value.key = false;
						return value;
					})
				});
				break;
			case 'local':
				typeof cb === 'function' && cb({
					footerState: this.globalData.store.footerState.map((value, index) => {
						if (index == num) value.key = true;
						else value.key = false;
						return value;
					})
				});
				break;
			default: break;
		}

	},
	moveSpace(){
		let that = this;
		for(var i in that.api){
			that.api[i] = that.api[i].replace(/(^\s*)|(\s*$)/g, ""); 
		}
	},
	updataUser(func){
		let that = this;
		var parm = {
			openid:	that.globalData.openid,
			nickname:that.globalData.userInfo.nickName,
			sex:that.globalData.userInfo.gender,
			headimgurl:that.globalData.userInfo.avatarUrl,
			city:that.globalData.userInfo.city,
			country:that.globalData.userInfo.country,
			province:that.globalData.userInfo.province,
			identify:3,
		};
		wx.request({
	        url: that.api.updata_user,
	        method: 'POST',
	        dataType: 'json',
	        data : parm,
	        header: {
	            'Content-Type': 'application/x-www-form-urlencoded'
	        },
	        success: ( res )=>{
	           if(res.statusCode == 200){
	           	// wx.hideToast();
	           	typeof func == 'function' && func(res);
	           }
	        },
	        fail:function(res){
	            console.log(res);
	        }
	    });
	},
	onShow(res){
		console.log(res.path);
		var page = res.path.split('/');
		var num = 0;
		// console.log(page[1]);
		num = page[1] == 'index' ? 0 :page[1]== 'citydesign' ? 1 : (page[1] == 'login' || page[1] == 'user') ? 2:0;
		// console.log(num);
		this.footerStateChange('global',num);
		if(typeof(res.query.shareid)!=="undefined"){
			this.footerStateChange('global',res.query.shareid);
			// App.footerStateChange('global',2);
		}
	},
	Toast(title,icon,duration){
		wx.showToast({
		  title: title,
		  icon: icon,
		  duration: 1500
		})
	},
	isLogin(func){
		let that = this,identify;
		that.Ajax(that.api.is_login,{openid:that.globalData.openid},function(res){
			if(typeof (res.data.list)!= 'undefined' && parseInt(res.data.list.login) == 1){
             	if(typeof res.data.list!='undefined' && parseInt(res.data.list.identify) == 2){
             		//这个是用户登录的
             		 identify = 'user';	
             	} else{
             		//这个是设计师登录的
             		 identify = 'design';	
             	}
             } else{
             	//这个是未登录的
             		 identify = 'vistior';
             }
             if (typeof func!='undefined') func(identify);	
		})
	},
	atten(data,func){
		let that = this;
		that.Ajax(that.api.atten,data,func);
	},
	cancelAtten(data,func){
		let that = this;
		that.Ajax(that.api.cancelAtten,data,func);
	},
	loginOut(func){
		let that = this;
		that.Ajax(that.api.loginout,{openid:that.globalData.openid},func);	
	},
	 Ajax(url,data,func){
	 	 wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration:10000
        });
      wx.request({
        url: url,
        method: 'POST',
        dataType: 'json',
        data : data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: ( res )=>{
           if(res.statusCode == 200){
           	wx.hideToast()
             if (typeof func!='undefined') func(res);
           }
        },
        fail:function(res){
            console.log(res);
        }
    });
    },
})
var app = getApp();
app.moveSpace();

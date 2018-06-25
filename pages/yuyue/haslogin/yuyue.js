var app = getApp();
var yuyue_url = app.api.yuyue,openid,id=0;
let pageConfig = {
    data: {
        userName:'',
        userPhone:'',
        classgif:true,
        display:'none',
        userInfo:{
            avatarUrl:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/head.jpg',
        },
        sexImg:{
            'man':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/man.png',
            'femail':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/femail.png',
        },
        checkList:[
            {status:0,text:'全屋'},
            {status:0,text:'卧房'},
            {status:0,text:'客餐厅'},
            {status:0,text:'儿童房'},
            {status:0,text:'书房'},
            {status:0,text:'厨房'},
            {status:0,text:'其他'}
            ],
    },
    onReady: function() {
        //初始化数据
        this.setData({
         display:'none'
        });

    },
    onLoad:function(options){
        let that = this;
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration:10000
        });
       id = ((typeof options.id) == 'undefined') ? id = '' : options.id;
         app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
            openid = app.globalData.openid;
        })
        let openidtemp = setInterval(function(){
            if(typeof that.data.userInfo.nickName!='undefined' && that.data.userInfo.nickName!= ''){
                 wx.hideToast();
                 clearInterval(openidtemp);
            }
        },100);  
        // app.tongji_visit('pages/yuyue/yuyue', 0, is_share);
        this.setData({
         display:'none'
        });

    },
    onShareAppMessage: function () {
        return {
            title: '0元设计全屋',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/yuyue/yuyue?shareid=3'
        }
    },
    // 点击移除光标
    btn_click: function(event) {
      this.setData({
         classgif:false
      });
    }, 
    // 隐藏蒙版
    hide_click: function(event) {
      this.setData({
         display:'none'
      });
    },
    //用户名、手机号码 
    bindChange:function(e){
        var val=e.detail.value;
        switch(e.target.id){
            case "userName":
                this.setData({
                    userName:val
                });
            break;
            case "userPhone":
                this.setData({
                    userPhone:val
                });
            break;
        }
    },
    check(e){
        let {index} = e.currentTarget.dataset||e.target.dataset,that=this;
        that.data.checkList[index].status = !that.data.checkList[index].status;
        that.setData({
            checkList:that.data.checkList
        });
    },
    alert:function(t){
        wx.showModal({
            title:"系统提示",
            content:t,
            showCancel: false,
            confirmColor: '#000'
        });
    },
    // 提交预约
    yuyueSubmit:function(){
        var self=this,num=[],str;
        for(var i=0;i<self.data.checkList.length;i++){
            if(self.data.checkList[i].status){
                console.log(i);
                num.push(i)
            }
        }
        if(num.length <= 0){
            self.alert('请选择空间');
            return false;
        }
        str = num.join(',');
        wx.showToast({
          title: '提交中...',
          icon: 'loading',
          duration:10000
        });
        wx.request({
            url: yuyue_url,
            method: 'POST',
            dataType: 'json',
            data: {
                'openid':app.globalData.openid,
                 sp_type:1624,
                 kehu_setting_des:str,
                 login:1,
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: ( res )=>{
                if(res.statusCode==200){
                    if(res.data.status == 'success'){
                         wx.hideToast();
                         this.setData({
                            display:'block'
                        });
                    }
                }
            },
            fail:function(res){
               self.alert('网络错误，请稍后再试！');
            }
    })
 }
}
pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);
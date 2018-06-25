var app = getApp()
//菜单栏状态
let pageConfig = {
    data: {
        banner:'',
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:true,
        top:true,
        url:'',
        page:1,
        push:true,
        datalist:[],
        count:3,
        Mb:false,
        nocityMb:false,
        cityMb:false,
    },
    onReady: function() {
        //初始化数据

    },
    onLoad:function(options){
       var that = this;
       console.log(typeof options.temp);
          
       if(typeof options.temp !='undefined'&&options.temp == 1){
          app.footerStateChange('global',0);
       }
       if(typeof(options.is_share)!=="undefined"){
          app.footerStateChange('global',options.shareid);
       }
       wx.getSystemInfo({
         success:function(res){
           that.setData({
             scrollHeight:res.windowHeight
           });
         }
       });
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
        })
         setTimeout(function(){
           // console.log(app.globalData);
           return false;
            let data = {
               openid:app.globalData.openid,
               page:that.data.page,
               token:'wxapp',
               count:that.data.count,
          	};
           // console.log(app.globalData);
           that.getList(that.data.url,data,function(res){
           	console.log(res);
            if(res.data.status == 1000){
                that.setData({
                   banner:res.data.banner.banner_path, 
                   datalist:res.data.list 
                });
            }
           });
         },400)
    },
    onShareAppMessage: function () {
        return {
            title: '精选案例',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/store/list/list?shareid=2',
        }
        
    },
    closeCity(){
      this.setData({
         cityMb : false,
         Mb:false,
       });
    },
    closeNocity(){
      this.setData({
         nocityMb : false,
         Mb:false,
       });
    },
    position(){
       this.setData({
         cityMb : true,
         Mb:true,
       });
    },
    scroll:function(event){
      //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
       if(event.detail.scrollTop > 5){
        this.setData({
             top : false
           });
       } else{
            this.setData({
             top : true
           });
       }
       // console.log(event.detail.scrollTop);
     },
     totop(){
         this.setData({
                 scrollTop : 0,
            });
        
     },
    changeData(res){
      var temp = this.data.datalist;
      var num = 0;
      for (var i = temp.length - 1; i >= 0; i--) {
        if(temp[i].id == res){
          num = i;
        }
      }
      temp[num].view = parseInt(temp[num].view)+1;
      this.setData({
         datalist:this.data.datalist, 
      });
    },
    bindDownLoad(){
      return false;
        let that = this;
        let data = {};
        if(that.data.push){
          that.data.page ++;
           data = {
                'openid':app.globalData.openid,
                 page:that.data.page,
                 token:'wxapp',
                 view_sort:that.data.hotState,
                 count:that.data.count,
                 create_date_sort :that.data.timeState,
            };
            // console.log(data);
           that.setData({
               push:false,
            }); 
            that.getList(this.data.url,data,function(res){
                // console.log(res);
                if(res.data.list == ''){
                    that.setData({
                       loading_hidden:true,
                       push:false,
                       loading_box:false,
                       nomore:'block' 
                    });
                } else{
                   that.setData({
                     loading_hidden:true,
                       datalist:that.data.datalist.concat(res.data.list),
                       page: that.data.page,
                       push:true,
                    }); 
                }
           });
        }
    },
    router(e){
        // console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
           // url:"../../pages/store/detail id="+event.target.dataset.id,
           url:"../../../pages/jingxuan/detail/detail?id="+e.currentTarget.dataset.id,
           //接口调用成功的回调方法
           fuccess:function(){},
           //接口调用失败的回调方法
           fail:function(){},
           //接口调用无论成功或者失败的回调方法
           complete:function(){}
       })
    },
    // 提交预约
    getList(url,data,callback){
       this.setData({
           loading_hidden:false,
        });
        wx.request({
            url:url,
            method: 'POST',
            dataType: 'json',
            data:data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: ( res )=>{
                // console.log('提交成功');
                // console.log(res);
                if(typeof callback !='undefined') callback(res);
                 var data=res.data;
                if(data.status==1000){
                    this.setData({
                       loading_hidden:true,
                    });
                }
                // wx.hideToast();
            //    self.alert(data.msg);
            },
            fail:function(res){
                console.log(res);
                // wx.hideToast();
            //    self.alert(data.msg);
            }
        })
    }
}

pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);
var app = getApp()
//菜单栏状态
let pageConfig = {
    data: {
         circular: true,  
        //是否显示画板指示点  
        indicatorDots: true,  
        //选中点的颜色  
        indicatorcolor: "#fff",  
        //是否竖直  
        vertical: false,  
        //是否自动切换  
        autoplay: true,  
        //滑动动画时长毫秒  
        duration: 300,  
        //所有图片的高度  
        imgheights: [],  
        //图片宽度  
        imgwidth: 750,  
        //默认  
        current:0 ,
        swiper:['http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/index-banner.jpg',
                'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/index-banner.jpg',
                ],
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
        atten:false,
        identify:'design',
    },
    onReady: function() {
        //初始化数据

    },
    onLoad:function(options){
       var that = this;
       console.log(options);
       if(typeof options.identify!='undefined'){
          that.setData({
             identify:options.identify
           });
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
    closeNocity(){
      this.setData({
         nocityMb : false,
         Mb:false,
       });
    },
    atten(){
      this.setData({
        atten:!this.data.atten,
      })
    },
    edit(){
      this.setData({
        Mb:true,
        nocityMb:true,
      })
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
     bindchange(e){
        this.setData({
          current:e.detail.current,
        })
     },
     swiperLeft(){
        let t = this,length,num;
        length = t.data.swiper.length;
        num = t.data.current;
        num--;
        num = num < 0 ? length-1 : num;
        t.setData({
          current:num,
        })
     },
     swiperRight(){
        let t = this,length,num;
        length = t.data.swiper.length;
        num = t.data.current;
        num++;
        num = num > length-1 ? 0 : num;
        t.setData({
          current:num,
        })
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
        let that = this,url;
        app.isLogin(function(res){
            if(res == 'user' || res=='design'){
              url = '../../../pages/yuyue/haslogin/yuyue';
            } else{
              url = '../../../pages/yuyue/nologin/yuyue';
            }
            wx.navigateTo({
               url:url,
               //接口调用成功的回调方法
               fuccess:function(){},
               //接口调用失败的回调方法
               fail:function(){},
               //接口调用无论成功或者失败的回调方法
               complete:function(){}
           })
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
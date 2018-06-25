var app = getApp()
//菜单栏状态
let pageConfig = {
    data: {
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
        time:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/time.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/time-active.png'},
        timeState:1,
        hot:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/hot.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/hot-active.png'},
        hotState:0,
         zanState:'',
        zan:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/zan.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/zan-active.png'},
        zangif:false,
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
    zan(e){
      let that = this;
      this.setData({
           loading_hidden:false,
        });
      let index = e.currentTarget.dataset.index;
      if(typeof index == 'number'){
        let zhuantai = this.data.datalist[index].zhuantai;
        let zanurl;
        let data ={
          openid:app.globalData.openid,
          source_type:2,
          type:1,
          article_id:this.data.datalist[index].id,
        }
        if(zhuantai == 0){
          that.data.datalist[index].zhuantai = 1;
          that.data.datalist[index].tags++;
          zanurl = app.api.article_setzan;
        } else{
          that.data.datalist[index].zhuantai = 0
          that.data.datalist[index].tags--;
          zanurl = app.api.article_cancelzan;
        }
        that.getList(zanurl,data,function(res){
          if(res.data.code == 200){
            that.setData({
               loading_hidden:true,
               datalist:that.data.datalist  
            });
          }
        })      
      }
    },
    closeNocity(){
      this.setData({
         nocityMb : false,
         Mb:false,
       });
    },
    hotChange(){
      let that = this;
      this.setData({
           loading_hidden:false,
        });
      that.data.hotState = that.data.hotState == 0 ? 1: 0;
      that.data.timeState = that.data.hotState == 0 ? 1: 0;
      that.data.page = 1;
        that.setData({
         hotState:that.data.hotState, 
         timeState:that.data.timeState,
         page:that.data.page, 
      });
         let data = {
            'openid':app.globalData.openid,
             page:that.data.page,
             token:'wxapp',
             type:1,
             view_sort:that.data.hotState,
             count:that.data.count,
             create_date_sort :that.data.timeState,
        };  
        that.getList(that.data.url,data,function(res){
            console.log(res);
            if(res.statusCode == 200){
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
                       datalist:res.data.list,
                       page: that.data.page,
                       push:true,
                    }); 
                }
            }
       });
     },
     timeChange(){
      this.setData({
           loading_hidden:false,
        });
        let that = this;
        that.data.timeState = that.data.timeState == 0 ? 1: 0;
        that.data.hotState = that.data.timeState == 0 ? 1: 0;
        that.data.page = 1;
          that.setData({
           hotState:that.data.hotState, 
           timeState:that.data.timeState,
           page:that.data.page, 
        });
           let data = {
              'openid':app.globalData.openid,
               page:that.data.page,
               token:'wxapp',
               type:1,
               view_sort:that.data.hotState,
               count:that.data.count,
               create_date_sort :that.data.timeState,
          };  
          that.getList(that.data.url,data,function(res){
              console.log(res);
              if(res.statusCode == 200){
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
                         datalist:res.data.list,
                         page: that.data.page,
                         push:true,
                      }); 
                  }
              }
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
        wx.navigateTo({
           // url:"../../pages/store/detail id="+event.target.dataset.id,
           url:"../../../pages/yuyue/yuyue",
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
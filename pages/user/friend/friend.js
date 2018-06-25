var app = getApp(),openid;
//菜单栏状态
let pageConfig = {
    data: {
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:true,
        nodata:false,
        top:true,
        url:app.api.friend,
        page:1,
        push:true,
        datalist:[],
        count:3,
        Mb:false,
        nocityMb:false,
        userInfo:{
          avatarUrl:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/head.jpg'
        },
        sexImg:{
          man:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/man.png',
          femail:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/femail.png'
        },
        fans_num:0,
        gz_num:0,
    },
    onReady: function() {
        //初始化数据

    },
    onLoad:function(options){
       var that = this;
       wx.getSystemInfo({
         success:function(res){
           that.setData({
             scrollHeight:res.windowHeight
           });
         }
       });
          openid = options.id;
            let data = {
               openid:openid,
               page:that.data.page,
               token:'wxapp',
               count:that.data.count,
          	};
           that.getList(that.data.url,data,function(res){
           	console.log(res);
            if(res.data.status == 'success'){
              // console.log(res.data.zuopin)
              if(typeof res.data.zuopin!='undefined' && res.data.zuopin!=''){
                  if(res.data.zuopin.length>that.data.count){
                      that.setData({ 
                         loading_hidden:true,
                         fans_num:res.data.fans_num,
                         gz_num:res.data.gz_num,
                         datalist:res.data.zuopin,
                         userInfo:res.data.user,
                         nomore:true,
                         nodata:false,
                         push:true,
                      });
                    
                  } else{
                    that.setData({ 
                         loading_hidden:true,
                         fans_num:res.data.fans_num,
                         gz_num:res.data.gz_num,
                         datalist:res.data.zuopin,
                         userInfo:res.data.user,
                         nomore:false,
                         nodata:false,
                         push:false,
                      });
                  }
              } else{
                that.setData({ 
                   loading_hidden:true,
                   fans_num:res.data.fans_num,
                   gz_num:res.data.gz_num,
                   datalist:res.data.zuopin,
                   userInfo:res.data.user,
                   nomore:true,
                   nodata:true,
                });
              }
            }
           });
    },
    // onShareAppMessage: function () {
    //     return {
    //         title: '精选案例',
    //         desc: '免费全屋设计，抢先领取',
    //         path: 'pages/store/list/list?shareid=2',
    //     }
        
    // },
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
    routerAtten(e){
      let {type} = e.currentTarget.dataset||e.target.dataset,that = this;
      wx.navigateTo({
         url:"../../../pages/atten/atten?who=he&type="+type+"&openid="+openid,
     })
     
    },
    bindDownLoad(){
        let that = this;
        let data = {};
        if(that.data.push){
          that.data.page ++;
           data = {
                'openid':openid,
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
                console.log(res);
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
     tabRouter(e){
      let {type} = e.currentTarget.dataset||e.target.dataset,that = this;
       if(type!='jifen'){
          wx.navigateTo({
             url:"../../user/collect/collect?who=he&type="+type+"&openid="+openid,
         })
      } else{
        app.Toast('敬请期待！','none');
      }
    },
    router(e){
      let{id} = e.currentTarget.dataset || e.target.dataset;
        wx.navigateTo({
           // url:"../../pages/store/detail id="+event.target.dataset.id,
           url:"../../../pages/shaijia/detail/detail?id="+id,
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
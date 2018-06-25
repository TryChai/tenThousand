var app = getApp(),openid;
let type = 3;
//菜单栏状态
let pageConfig = {
    data: {
        banner:'',
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:true,
        top:true,
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
        url:app.api.get_ganhuo,
        page:1,
        push:true,
        datalist:[],
        count:3,
        nodata:false,
    },
    onReady: function() {
        //初始化数据

    },
    onLoad:function(options){
       var that = this;
       this.setData({
           loading_hidden:false,
        });
       // console.log(options);
       if(typeof(options.is_share)!=="undefined"){
          app.footerStateChange('global',options.shareid);
       }
       wx.getSystemInfo({
         success:function(res){
           that.setData({
             scrollHeight:res.windowHeight,
             loading_hidden:false,
           });
         }
       });
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                // openid:app.globalData.openid,
            });
        })
       if(typeof wx.getStorageSync('openid')!='undefined' && wx.getStorageSync('openid')!=''){
          openid = wx.getStorageSync('openid');
          that.loadGetlist();
       } else{
         setTimeout(function(){
            openid = app.globalData.openid;
             that.loadGetlist();
         },800)
       }
    },
    onShareAppMessage: function () {
        return {
            title: '精选案例',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/store/list/list?shareid=2',
        }
        
    },
    loadGetlist(){
      let data,that=this;
      data = {
       openid:openid,
       page:that.data.page,
       token:'wxapp',
       type:type,
       view_sort:that.data.hotState,
       count:that.data.count,
       create_date_sort :that.data.timeState,
    };
   that.getList(that.data.url,data,function(res){
    if(res.data.status == 1000){
        if(res.data.list.length>0){
          that.setData({
             banner:res.data.banner.banner_path,
             loading_hidden:true, 
             datalist:res.data.list,
             nodata:false,
          });
        } else{
          that.setData({
             banner:res.data.banner.banner_path,
             loading_hidden:true, 
             nodata:true,
          });
        }
    }
   });
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
          type:type,
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
             type:type,
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
               type:type,
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
    friend(e){
      let{id} = e.currentTarget.dataset || e.target.dataset,that=this,url;
      app.isLogin(function(res){
        if(res == 'vistior'){
            app.footerStateChange('global',2);
            url="../../../pages/login/login";
         } else {
            if(openid == id){
                url="../../../pages/user/index/index";
            } else{
                url="../../../pages/user/friend/friend?id="+id;
           }
         }
        wx.navigateTo({
             url:url,
         })
      })

    },
    bindDownLoad(){
        let that = this;
        this.setData({
           loading_hidden:false,
        });
        let data = {};
        if(that.data.push){
          that.data.page ++;
           data = {
                'openid':app.globalData.openid,
                 page:that.data.page,
                 token:'wxapp',
                 type:type,
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
        } else{
          this.setData({
           loading_hidden:true,
        });
        }
    },
    router(e){
        let {id,type} = e.currentTarget.dataset|| e.target.dataset,url;
        if(typeof type!='undefined' && type=='ping'){
          url = "../../../pages/shaijia/detail/detail?id="+id+"&state="+type;
        } else{
          url = "../../../pages/shaijia/detail/detail?id="+id;
        }
        wx.navigateTo({
           url:url,
       })
    },
    // 提交预约
    getList(url,data,callback){
        wx.request({
            url:url,
            method: 'POST',
            dataType: 'json',
            data:data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: ( res )=>{
                if(typeof callback !='undefined') callback(res);
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
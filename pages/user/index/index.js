import { func } from '../../../template/footerList/footerList';
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
        userInfo:{
          avatarUrl:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/head.jpg'
        },
        sexImg:{
          man:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/man.png',
          femail:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/femail.png'
        },
        fans_num:0,
        gz_num:0,
        loginoutBtn:true,
    },
    onReady: function() {
        //初始化数据
    },
    onLoad:function(options){
       var that = this;
       if(typeof wx.getStorageSync('openid')!='undefined' && wx.getStorageSync('openid')!=''){
          that.data.userInfo = wx.getStorageSync('userInfo');
          openid = wx.getStorageSync('openid');
           that.setData({
                userInfo:that.data.userInfo,
            });
       }  else{
          app.getUserInfo(function (personInfo) {
           //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
        })
          openid = app.globalData.openid;
       }
       wx.getSystemInfo({
         success:function(res){
           that.setData({
             scrollHeight:res.windowHeight
           });
         }
       });
          let data = {
             openid:openid,
             page:that.data.page,
             token:'wxapp',
             count:that.data.count,
             type:2,
        	};
         that.getList(app.api.user_index,data,function(res){
          if(res.data.status == 'success'){
            if(res.data!=''){
              if(res.data.list>that.data.count){
                 that.setData({
                   datalist:res.data.list,
                   fans_num:res.data.fans_num,
                   gz_num:res.data.gz_num,
                   loading_hidden:true,
                   nomore:true,
                   nodata:false,
                   push:true,
                 }); 
              } else{
                that.setData({
                   datalist:res.data.list,
                   fans_num:res.data.fans_num,
                   gz_num:res.data.gz_num,
                   loading_hidden:true,
                   nomore:false,
                   nodata:false,
                   push:false,
                 }); 
              }
            }
          } else{
            that.setData({
                 nomore:true,
                 fans_num:res.data.fans_num,
                 gz_num:res.data.gz_num,
                 nodata:true,
                 loading_hidden:true,
               }); 
          }
         });
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
          openid:openid,
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
            console.log(res);
          if(res.data.code == 200){
            that.setData({
               loading_hidden:true,
               datalist:that.data.datalist  
            });
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
          }
        })      
      }
    },
    addRell(){
       let titledata,data={detail:{}},picktext,content,jobdata,url,that = this,firststep=false,secondstep=false,thirdstep=false,fourstep=false,userData;
       userData = wx.getStorageSync('userData');
       that.getList(app.api.check_edit,{openid:openid,source_type:2},function(res){
          wx.setStorageSync('status','add');
          if(res.data.status == 'success'){
            that.setData({
               loading_hidden:true,
            });
            if(res.data.msg == 'no result'){
               wx.reLaunch({
                url: "../firststep/firststep?status=add",
              })
                return false;
            } else if(res.data.msg='step'){
                  // console.log(res.data);
                  var step = res.data.style,aid=res.data.id;
                  wx.showModal({
                    title: '提示',
                    content: '您有未发布的文章，是否继续编辑？',
                    success: function(res) {
                      if (res.confirm) {
                        if(step == 2){
                             wx.reLaunch({
                              url: '../secondstep/secondstep?status=add&aid='+aid
                            })
                        } else if(step == 3){
                          wx.reLaunch({
                              url: '../thirdstep/thirdstep?status=add&aid='+aid
                            })
                        } else if(step == 4){
                           wx.reLaunch({
                              url: '../fourstep/fourstep?status=add&aid='+aid+'&add=nofabu'
                            })
                        }
                      } else if (res.cancel) {
                         that.getList(app.api.check_edit,{openid:openid,source_type:2,del:'del'},function(res){
                             if(res.data.status == 'success'){
                                  that.setData({
                                     loading_hidden:true,
                                  });
                                  wx.reLaunch({
                                    url: '../firststep/firststep?status=add'
                                  })
                             } else{
                              that.setData({
                                 loading_hidden:true,
                              });
                               wx.showModal({
                                  title: '提示',
                                  content: '网络异常，请稍后再试！',
                                  showCancel:false,
                                  success: function(res) {
                                  }
                                })
                             }       
                         })
                      }
                    }
                  })
              }
          }  else{
            that.setData({
               loading_hidden:true,
            });
             wx.showModal({
                title: '提示',
                content: '网络异常，请稍后再试！',
                showCancel:false,
                success: function(res) {
                }
              })
           } 
       })
       
      
    },
    changeData(e){
      console.log(e);
      let that = this;
      if(e.type == 2 && e.state == 'delete' || e.type == 1 && e.state == 'delete'){
        that.setData({gz_num:that.data.gz_num-1});
      } else if(e.type == 1 && e.state == 'add'){
        that.setData({gz_num:that.data.gz_num+1});
      } 
    },
    tabRouter(e){
      let {type} = e.currentTarget.dataset||e.target.dataset,that = this;
      if(type=='jifen'){
        app.Toast('敬请期待','none');
      } else{
        wx.navigateTo({
           url:"../../user/collect/collect?who=me&type="+type,
           //接口调用成功的回调方法
           fuccess:function(){},
           //接口调用失败的回调方法
           fail:function(){},
           //接口调用无论成功或者失败的回调方法
           complete:function(){}
       })
      }
    },
    routerAtten(e){
      let {type} = e.currentTarget.dataset||e.target.dataset,that = this;
      wx.navigateTo({
         url:"../../../pages/atten/atten?who=me&type="+type,
         //接口调用成功的回调方法
         fuccess:function(){},
         //接口调用失败的回调方法
         fail:function(){},
         //接口调用无论成功或者失败的回调方法
         complete:function(){}
     })
    },
    loginout(){
      let that = this;
      if(that.data.loginoutBtn){
        that.setData({
          loginoutBtn :false,
        })
        app.loginOut(function(res){
          console.log(res);
          if(res.data.status == 'success'){
             // wx.navigateTo({
             //       url:"../../index/list/list",
             //       //接口调用成功的回调方法
             //       fuccess:function(){},
             //       //接口调用失败的回调方法
             //       fail:function(){},
             //       //接口调用无论成功或者失败的回调方法
             //       complete:function(){}
             //   })
             wx.reLaunch({
              url: "../../index/list/list",
            })
             app.footerStateChange('global',0);
          } else{
            setTimeout({function(){
               that.setData({
                  loginoutBtn :true,
                })
             }
            },800)
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
     write(e){
        let{id} = e.currentTarget.dataset || e.target.dataset,that = this,anli,userData={edit:{}}, detail;
        that.getList(app.api.user_edit,{id:id},function(res){
            that.setData({
               loading_hidden:true,
            });
             wx.reLaunch({
              url: "../firststep/firststep?status=edit&aid="+id
            })
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
                       nomore:false, 
                    });
                } else{
                   that.setData({
                     loading_hidden:true,
                       datalist:that.data.datalist.concat(res.data.list),
                       page: that.data.page,
                       push:true,
                       nomore:true,
                    }); 
                }
           });
        }
    },
    router(e){
      let {id} = e.currentTarget.dataset || e.target.dataset;
        // console.log(e.currentTarget.dataset.id);
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
let nextConfig = Object.assign({},pageConfig,func);
Page(nextConfig);
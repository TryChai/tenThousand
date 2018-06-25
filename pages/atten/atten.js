var app=getApp();
var id = 0,openid='',url=app.api.get_fanslist,type,attenOpenid,subOpnenid,num;  

import { fromJS,toJS } from '../../libs/immutable';
let pageConfig = {
    data: {
        index : {
            viewScrollTop : 0, 
        },
        scrollHeight:0,
        top:true,
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:true,
        nav:[app.api.cdn_path+'nav_0.jpg',app.api.cdn_path+'nav_1.jpg',app.api.cdn_path+'nav_2.jpg',app.api.cdn_path+'nav_3.jpg'],
        tuijian:[],
        NavigationBarTitle:'Ta的粉丝',
        Mb:false,
        cancle:false,
        nodata:false,
        datalist:{},
        count:3,
        page:1,
        push:true,
        nodata_text:'TA暂时还没有粉丝~',
        num:0,
        attenShow:true,
        identify:'me',
        },
    onReady(){
      let t = this;
      wx.setNavigationBarTitle({  
          title: t.data.NavigationBarTitle,   
      }) 
    },
    onLoad: function(options) {
         //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        var that = this;
        wx.getSystemInfo({
              success:function(res){
                  // console.info(res.windowHeight);
                  that.setData({
                      scrollHeight:res.windowHeight
                  });
              }
        });
        if(options.who == 'me'){
          that.data.attenShow = true;
          if(options.type=='atten'){
            that.data.NavigationBarTitle='我的关注';
             type=2;
             that.data.nodata_text='你暂时还没有任何关注~';
          } else{
            that.data.NavigationBarTitle='我的粉丝';
             type=1;
             that.data.nodata_text='你暂时还没有粉丝~';
          }
       } else{
          that.data.attenShow=false;
           if(options.type=='atten'){
              that.data.NavigationBarTitle='Ta的关注';
              type=2;
              that.data.nodata_text='Ta暂时还没有任何关注~';
            } else{
              that.data.NavigationBarTitle='Ta的粉丝';
              type=1;
              that.data.nodata_text='Ta暂时还没有粉丝~';
            }
       }
       that.setData({
          loading_hidden:false,
          identify:options.type,
          NavigationBarTitle:that.data.NavigationBarTitle,
          nodata_text:that.data.nodata_text,
          attenShow:that.data.attenShow,
       })
        if(typeof wx.getStorageSync('openid')!='undefined' && wx.getStorageSync('openid')!=''){
          that.data.userInfo = wx.getStorageSync('userInfo');
          openid = wx.getStorageSync('openid');
           that.setData({
                userInfo:that.data.userInfo,
            });
           if(typeof options.openid!='undefined' && options.openid !=''){
            openid = options.openid;
           }
           that.getList();
       }  else{
            app.getUserInfo(function (personInfo) {
             //更新数据
              that.setData({
                  userInfo: personInfo,
                  openid:app.globalData.openid,
              });
              if(typeof options.openid!='undefined' && options.openid !=''){
                openid = options.openid;
              }
              that.getList();
            })
       }
       
    },
    getList(){
        let data ,that=this;
        data = {
          'openid':openid,
           token:'wxapp',
           source_type:2,
           type:type,
           count:that.data.count,
       };
        that.Ajax(url,data,function(res){
          console.log(res.data);
          if(res.data.status ='success'){
            if(typeof res.data.detail!='undefined' && res.data.detail!='' ){
              if(res.data.detail.length>that.data.count){
                  that.setData({
                    loading_hidden:true,
                    datalist:res.data.detail,
                    nomore:true,
                    nodata:false,
                  })
              } else{
                that.setData({
                  loading_hidden:true,
                  datalist:res.data.detail,
                  nomore:false,
                  nodata:false,
                  push:false,
                })
              }
            } else{
              that.setData({
                loading_hidden:true,
                datalist:res.data.detail,
                nomore:true,
                nodata:true,
                push:false,
              })
            }
          } else{
              that.setData({
                loading_hidden:true,
                datalist:res.data.detail,
                nomore:true,
                nodata:true,
                push:false,
              })
            }
        })
    },
    atten(e){
      let {status,openid,sub,num} = e.currentTarget.dataset || e.target.dataset,that=this;
      attenOpenid = openid,subOpnenid=sub,num=num;
      if(status){
        this.setData({
          Mb:true,
          num:num,
        })
        return false;
      } else{
        wx.showLoading({
          title: '加载中',
        })
         that.Ajax(app.api.user_atten,{openid:subOpnenid,sub_openid:attenOpenid,type:type},function(res){
            if(res.data.code=='success'){
              var pages = getCurrentPages();   
              if (pages.length > 1) { 
                  //上一个页面实例对象  
                  var prePage = pages[pages.length - 2];  
                  //关键在这里,这里面是触发上个界面  
                  // console.log(prePage);
                  prePage.changeData({type:type,state:'add'});
                  // 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数  
              }  
              that.data.datalist[num].fans_num = parseInt(that.data.datalist[num].fans_num)+1;
              that.data.datalist[num].is_guanzhu = 1;
              wx.hideLoading();
              wx.showToast({
                title: '关注成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                datalist:that.data.datalist,
              })
            } else{
               wx.hideLoading();
               wx.showModal({
                title: '提示',
                content: '网络异常，请稍后再试',
                showCancel:false,
                success: function(res) {
                }
              })
            }
         })
      }
    },
     friend(e){
      let{id} = e.currentTarget.dataset || e.target.dataset,that=this,url;
      console.log(id);
      url="../user/friend/friend?id="+id;
      wx.navigateTo({
           // url:"../../pages/store/detail id="+event.target.dataset.id,
           url:url,
           //接口调用成功的回调方法
           fuccess:function(){},
           //接口调用失败的回调方法
           fail:function(){},
           //接口调用无论成功或者失败的回调方法
           complete:function(){}
       })
    },
    Cancel(e){
      let t = this,{state} = e.currentTarget.dataset || e.target.dataset,data,num = t.data.num;
      if(state=='cancle'){
          t.setData({
            cancle:true,
          })
          setTimeout(function(){
            t.setData({
              Mb:false,
              cancle:false,
            })
          },500)
        return false;
      } else{
        t.Ajax(app.api.user_cancelAtten,{openid:subOpnenid,sub_openid:attenOpenid,type:type},function(res){
          console.log(res);
            if(res.data.code == 'success'){
              //获取页面栈  
              var pages = getCurrentPages();  
              if (pages.length > 1) {  
                  //上一个页面实例对象  
                  var prePage = pages[pages.length - 2];  
                  //关键在这里,这里面是触发上个界面  
                  // console.log(prePage);
                  prePage.changeData({type:type,state:'delete'});
                  // 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数  
              }  
              if(type==2){
                t.data.datalist.splice(num,1);
              } else{
                t.data.datalist[num].is_guanzhu = 0;
                t.data.datalist[num].fans_num = parseInt(t.data.datalist[num].fans_num)-1;
              }
              if(t.data.datalist<=0){
                  t.setData({
                    nodata:true,
                    nomore:true,
                    cancle:true,
                    datalist:t.data.datalist,
                  })
              } else{
                t.setData({
                    nodata:false,
                    nomore:false,
                    cancle:true,
                    datalist:t.data.datalist,
                  })
              } 
                setTimeout(function(){
                  t.setData({
                    Mb:false,
                    cancle:false,
                  })
                  setTimeout(function(){
                     wx.showToast({
                      title: '取消关注成功',
                      icon: 'success',
                      duration: 2000
                    })
                   },500);
                },500)
            }
        })
      }
    },
     viewtap(e){
        console.log(e.currentTarget);
        let id = e.currentTarget.dataset.id,type = e.currentTarget.dataset.type,url;
        url= type==1? "../../../pages/jingxuan/detail/detail?id="+id+"&is_list=0&openid="+openid : type==2?"../../../pages/designlist/detail/detail?id="+id+"&is_list=0&openid="+openid :"../../../pages/shaijia/detail/detail?id="+id+"&is_list=0&openid="+openid 
        wx.navigateTo({
             url:url,
             //接口调用成功的回调方法
             fuccess:function(){},
             //接口调用失败的回调方法
             fail:function(){},
             //接口调用无论成功或者失败的回调方法
             complete:function(){}
         })
     },
   //页面分享
    onShareAppMessage: function () {
        return {
            title: '10000套家居精选案例',
            desc: '家装干货全都有，看这里就够了',
            path: 'pages/index/list/list?shareid=0',
            imageUrl:'http://img2.homekoocdn.com/html/m_homekoo/miniprogram/baoming20170817/images/first_page.jpg',
        }
    },
  
   bindDownLoad(){
        let that = this;
        let data = {};
        if(that.data.push){
          that.data.page ++;
           data = {
            'openid':openid,
             token:'wxapp',
             source_type:2,
             type:type,
             count:that.data.count,
            };
            // console.log(data);
           that.setData({
               push:false,
            }); 
            that.getList(this.data.url,data,function(res){
                 if(res.data.status ='success'){
                  if(typeof res.data.detail!='undefined' && res.data.detail!='' ){
                    if(res.data.detail.length>that.data.count){
                        that.setData({
                          datalist:res.data.detail,
                          nomore:true,
                          nodata:false,
                        })
                    } else{
                      that.setData({
                        datalist:res.data.detail,
                        nomore:false,
                        nodata:false,
                      })
                    }
                    
                  } 
                } else{
                    that.setData({
                      datalist:res.data.detail,
                      nomore:true,
                      nodata:true,
                    })
                  }
           });
        }
    },
    handleIndex(e){
      let scrollTop = e.detail.scrollTop;
      if(scrollTop > 100){
           this.setData({
             top:false,
           })
      } else{
        this.setData({
             top:true,
           })
      }
    },
    //回到顶部
    backTop(e){
        let scrollTop = e.detail.scrollTop;
        this.setData({
            index : fromJS(this.data.index).set('viewScrollTop',scrollTop -scrollTop).toJS()
        });
    },
    Ajax(url,data,func){
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
               if (typeof func!='undefined') func(res);
             }
          },
          fail:function(res){
              console.log(res);
          }
      });
    },
}
pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);

import { func } from '../../../template/footerList/footerList'
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
        currentCity:'',
        cityCode:0,
        userInfo:{
          avatarUrl:'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/head.jpg'
        },
        sexImg:{
          'man':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/man.png',
          'femail':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/femail.png',
        },
        datalist:{},
        datalength:0,
        nodata_text:'',
    },
    onReady: function() {
        //初始化数据

    },
    onLoad:function(options){
       var that = this;
     
          
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
       if(wx.getStorageSync('userInfo')!=''&&typeof wx.getStorageSync('userInfo')!='undefined' && wx.getStorageSync('userInfo')){
          that.setData({
                userInfo: wx.getStorageSync('userInfo'),
            });
          this.getLocation();
       } else{
        let getstor = setInterval(function(){
          if(wx.getStorageSync('userInfo')!=''&&typeof wx.getStorageSync('userInfo')!='undefined' && wx.getStorageSync('userInfo')){
              that.setData({
                    userInfo: wx.getStorageSync('userInfo'),
                });
              clearInterval(getstor);
           } 
           this.getLocation();
        })
       }
        
    },
    onShareAppMessage: function () {
        return {
            title: '精选案例',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/store/list/list?shareid=2',
        }
        
    },
   getLocation: function () {  
    var t = this  
     t.setData({
       loading_hidden:false,
     })
    wx.getLocation({  
      type: 'wgs84',   
      success: function (res) {  
        // success    
        var longitude = res.longitude  
        var latitude = res.latitude  
        t.loadCity(longitude, latitude) 
      },
      fail(res){
          t.shoufail();
          console.log(res);
      }
    })  
  },  
  shoufail(){
    var t = this  
     t.setData({
       loading_hidden:true,
     })
     wx.showModal({
          title: '提示',
          content: '为正常使用此应用，需开启“位置信息授权”，点击确定重新获取授权',
          success(){
            wx.openSetting({
             success: function (data) {
                console.log(data);
               if (data) {
                console.log(data);
                 if (data.authSetting["scope.userLocation"] == true) {
                    wx.getLocation({  
                      type: 'wgs84',   
                      withCredentials: false,
                      success: function (res) {  
                        // success    
                        var longitude = res.longitude  
                        var latitude = res.latitude  
                        t.loadCity(longitude, latitude) 
                      }
                    })
                 }  else{
                  t.shoufail();
                 }
               }                        },
             fail: function () {
               console.info("设置失败返回数据");
            }       
             });
            
          }
        })
  },
  loadCity: function (longitude, latitude) {  
    var t = this  
    wx.request({  
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=7mQTyGQeeWpQ6wGFlf4jivhsAr8r6Azt&location=' + latitude + ',' + longitude + '&output=json',  
      data: {},  
      header: {  
        'Content-Type': 'application/json'  
      },  
      success: function (res) {  
        // success    
        console.log(res);  
        var city = res.data.result.addressComponent.city.substr(0, res.data.result.addressComponent.city.length-1); 
        var cityCode = res.data.result.cityCode; 
        var url = app.api.designer_nearby;
        t.setData({ currentCity: city,cityCode:cityCode,loading_hidden:true,});  
         if(cityCode !=257 && cityCode != 75 ){
           t.setData({
                 Mb:true,
                 nocityMb:true,
            });
        };
        t.getList(url,{address:city},function(res){
            console.log(res);
            if(typeof res.data.data !='undefined' && res.data.data!=''){
              if(res.data.data.length < t.data.count){
                t.setData({
                  loading_box:false,
                  nomore:false,
                  push:false,
                })
              }
              t.setData({
                loading_hidden:true,
                datalist:res.data.data,
                datalength:res.data.data.length,
              })
            } else{
              t.setData({
                loading_hidden:true,
                datalength:0,
                loading_box:true,
                nomore:true,
                nodata_text:city+'地区附近暂无该设计师数据',
              })
            }
        })
      },  
      fail: function () {  
        t.setData({ currentCity: "获取定位失败" });  
      },  
        
    })  
  },
    closeMb(){
      this.setData({
         cityMb : false,
         nocityMb : false,
         Mb:false,
       });
    },
    changeCity(e){
      let t = this,{type} = e.currentTarget.dataset || e.target.dataset,address,url = app.api.designer_nearby;
      if(type == 'gz'){
        address = '广州';
      } 
       if(type == 'cd'){
        address = '成都';
      }
      t.getList(url,{address:address},function(res){
            console.log(res.data.data);
            if(typeof res.data.data !='undefined' && res.data.data!=''){
               if(res.data.data.length < t.data.count){
                t.setData({
                  loading_box:false,
                  nomore:false,
                  push:false,
                })
              }
              t.setData({
                loading_hidden:true,
                datalist:res.data.data,
                datalength:res.data.data.length,
                currentCity:address,
                cityMb : false,
                nocityMb : false,
                Mb:false,
              })
            } else{
              t.setData({
                loading_hidden:true,
                datalength:0,
                currentCity:address,
                nodata_text:address+'地区附近暂无该设计师数据',
                cityMb : false,
                nocityMb : false,
                loading_box:true,
                nomore:true,
                Mb:false,
              })
            }
        })
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
        let that = this;
        let data = {};
        if(that.data.push){
          that.data.page ++;
           data = {
                'openid':app.globalData.openid,
                 page:that.data.page,
                 token:'wxapp',
                 count:that.data.count,
                 address:that.data.currentCity,
            };
            // console.log(data);
           that.setData({
               push:false,
            }); 
            that.getList(app.api.designer_nearby,data,function(res){
                // console.log(res);
               if(typeof res.data.data !='undefined' && res.data.data!=''){
                    that.setData({
                      loading_hidden:true,
                      datalist:res.data.data,
                      datalength:res.data.data.length,
                      cityMb : false,
                      nocityMb : false,
                      Mb:false,
                    })
                  } else{
                    that.setData({
                      loading_hidden:true,
                      datalength:0,
                      nodata_text:address+'地区附近暂无该设计师数据',
                      cityMb : false,
                      nocityMb : false,
                      Mb:false,
                    })
                  }
           });
        }
    },
    router(e){
        // console.log(e.currentTarget.dataset.id);
        let {id,type} = e.currentTarget.dataset||e.target.dataset,url;
       if(typeof type !='undefined' && type == 'yuyue'){
          url = '../../../pages/yuyue/yuyue';
       }
       if(typeof type !='undefined' && type == 'detail'){
          url = '../../../pages/designlist/detail/detail?id='+id;
       }
       if(typeof type !='undefined' && type == 'design'){
          url = '../../../pages/design/card/card?identify=user?id='+id;
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
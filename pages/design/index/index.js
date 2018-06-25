import { func } from '../../../template/footerList/footerList';
var app=getApp();
var id = 0,openid='';  
var WxParse = require('../../../wxParse/wxParse.js');
import { fromJS,toJS } from '../../../libs/immutable';
let pageConfig = {
    data: {
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:true,
        nav:[app.api.cdn_path+'login_nav01.jpg',app.api.cdn_path+'login_nav02.jpg',app.api.cdn_path+'login_nav03.jpg',app.api.cdn_path+'login_nav04.jpg'],
        tuijian:[],
        stardate:'',
        today:'',
        enddate:'',
        userInfo:{},
        liangchiNum:0,
        },
    onLoad: function(options) {
         //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        var that = this;
        let url = app.api.index_url;
        let data = {
          'openid':app.globalData.openid,
           id:id,
           token:'wxapp',
           source_type:2,
           type:1 ,
       };
        console.log(wx.getStorageSync('userInfo'))
        that.data.userInfo = wx.getStorageSync('userInfo') || {};
        console.log(typeof that.data.userInfo.nickName);
       that.setData({
          today: that.format(),
          userInfo:that.data.userInfo,
      });
        if(typeof that.data.userInfo.nickName == 'undefined'){
           app.getUserInfo(function (personInfo) {
            //更新数据
                that.setData({
                    userInfo: personInfo,
                    openid:app.globalData.openid,
                });
            })
        } 
      let openidtime =  setInterval(function(){
        app.globalData.openid !='' && typeof app.globalData.openid !='undefined' ? (openid = app.globalData.openid,clearInterval(openidtime)) :null;
       },100)
     
        // console.log(app.globalData.login);
        // that.Ajax(url,data,function(res){
        //   if(res.data.status ='success'){
        //     // console.log(res.data.tuijian);
        //     typeof res.data.banner[0] !='undefined' ? (that.data.swiper = [],that.data.swiper.push(res.data.banner[0].banner_path)):null;
        //     typeof res.data.banner[1] !='undefined' ? that.data.swiper.push(res.data.banner[1].banner_path) :null;
        //     typeof res.data.banner[2] !='undefined' ? that.data.swiper.push(res.data.banner[2].banner_path) :null;
        //     that.setData({
        //       tuijian:res.data.tuijian,
        //       swiper:that.data.swiper,
        //     })
        //   }
        // })
    },
    //导航跳转
    navTo(e){
      // console.log(openid);
      var nav = '';
      e.target.dataset.index == 0 ? nav='/pages/design/card/card' :e.target.dataset.index == 1? nav='/pages/design/reels/reels':null;
      if(nav!=''){
        wx.navigateTo({
             url: nav
        });
      }
       
      // console.log(nav);
    },
    bindStardate(e){
      let that = this;
       that.setData({
          stardate: e.detail.value,
      });
    },
    bindEnddate(e){
      let that = this,startime,endtime;
       that.setData({
          enddate: e.detail.value,
      });
       if(that.data.stardate == ''){
        that.alert('请选择开始时间');
        return false;
       }
       startime = new Date(that.data.stardate);
       startime = startime.getTime();
       endtime = new Date(that.data.enddate);
       endtime = endtime.getTime();
       if(endtime < startime){
         that.alert('结束时间不能小于开始时间');
        return false;
       }
       let data = {
        design_name:that.data.userInfo.nickName,
        start_time:startime,
        end_time:endtime
       };
       that.Ajax(app.api.design_liangchi,data,function(res){
          console.log(res);
          if(res.statusCode == 200){
              that.setData({liangchiNum:res.data.num})
          }
       })
    },
    alert:function(t){
        wx.showModal({
            title:"系统提示",
            content:t,
            showCancel: false,
            confirmColor: '#000'
        });
    },
    format(){
        var mat={},date=new Date();
        mat.M=date.getMonth()+1;//月份记得加1
        mat.Y=date.getFullYear();
        mat.D=date.getDate();
      return mat.Y+'-'+(mat.M < 10 ? '0'+mat.M :mat.M)+'-'+(mat.D < 10 ? '0'+mat.D :mat.D);
    },
   //页面分享
    // onShareAppMessage: function () {
    //     return {
    //         title: '10000套家居精选案例',
    //         desc: '家装干货全都有，看这里就够了',
    //         path: 'pages/index/list/list?shareid=0',
    //         imageUrl:'http://img2.homekoocdn.com/html/m_homekoo/miniprogram/baoming20170817/images/first_page.jpg',
    //     }
    // },
  
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
let nextConfig = Object.assign({},pageConfig,func);
Page(nextConfig);
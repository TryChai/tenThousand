import { func } from '../../../template/footerList/footerList';
var app=getApp();
var id = 0,openid='';  

var WxParse = require('../../../wxParse/wxParse.js');
import { fromJS,toJS } from '../../../libs/immutable';
let pageConfig = {
    data: {
        index : {
            viewScrollTop : 0, 
        },
        scrollHeight:0,
        swiper:[app.api.cdn_path+'index-banner.jpg',],
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
        top:true,
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:true,
        nav:[app.api.cdn_path+'nav_0.jpg',app.api.cdn_path+'nav_1.jpg',app.api.cdn_path+'nav_2.jpg',app.api.cdn_path+'nav_3.jpg'],
        tuijian:[],
        },
    onLoad: function(options) {
         //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        var that = this;
        if(typeof(options.is_share)!=="undefined") app.footerStateChange('global',options.shareid);
        wx.getSystemInfo({
              success:function(res){
                  // console.info(res.windowHeight);
                  that.setData({
                      scrollHeight:res.windowHeight
                  });
              }
        });
        let url = app.api.index_url;
        let data = {
          'openid':app.globalData.openid,
           id:id,
           token:'wxapp',
           source_type:2,
           type:1 ,
       };
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
        })
        this.setData({
           loading_hidden:false,
        });
      let openidtime =  setInterval(function(){
        app.globalData.openid !='' && typeof app.globalData.openid !='undefined' ? (openid = app.globalData.openid,clearInterval(openidtime)) :null;
       },100)
        that.Ajax(url,data,function(res){
          if(res.data.status ='success'){
             that.setData({
               loading_hidden:true,
            });
            // console.log(res.data.tuijian);
            typeof res.data.banner[0] !='undefined' ? (that.data.swiper = [],that.data.swiper.push(res.data.banner[0].banner_path)):null;
            typeof res.data.banner[1] !='undefined' ? that.data.swiper.push(res.data.banner[1].banner_path) :null;
            typeof res.data.banner[2] !='undefined' ? that.data.swiper.push(res.data.banner[2].banner_path) :null;
            that.setData({
              tuijian:res.data.tuijian,
              swiper:that.data.swiper,
            })
          }
        })
    },
    //导航跳转
    navTo(e){
      // console.log(openid);
      var nav = '';
      switch(e.target.dataset.index){
        case 0 : nav='/pages/jingxuan/list/list';break;
        case 1 : nav='/pages/shaijia/list/list';break;
        case 2 : app.Toast('敬请期待','none');break;
        // case 2 : nav='/pages/designlist/list/list';break;
        case 3 : app.Toast('敬请期待','none');break;
        // case 3 : (nav='/pages/citydesign/list/list?temp=1', app.footerStateChange('global',1));break;
        default:nav='/pages/index/list/list';break;
      }
      if(nav != ''){
        wx.navigateTo({
             url: nav
        });
      }
      return false;
       
      // console.log(nav);
    },
     viewtap(e){
        console.log(e.currentTarget);
        let {id,type} = e.currentTarget.dataset || e.detail.dataset,url;
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
            // desc: '家装干货全都有，看这里就够了',
            path: 'pages/index/list/list?shareid=0',
            imageUrl:'http://img2.homekoocdn.com/html/m_homekoo/miniprogram/baoming20170817/images/first_page.jpg',
        }
    },
  
   bindDownLoad:function(){
      if (this.data.search_true=="1") {
             this.setData({
               show_a:'block',
               show_text:'已经到最底部了！',
               show_b:'none'
            }); 
      }else{
           
      }
    },
    handleIndex(e){
      let scrollTop = e.detail.scrollTop;
      if(scrollTop > 5){
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
let nextConfig = Object.assign({},pageConfig,func);
Page(nextConfig);

import { func } from '../../../template/footerList/footerList';
let common = require('../../../common/common.js');
let WxParse = require('../../../wxParse/wxParse.js');

let app = getApp(), id = 0,openid,type=3,attenOpenid,aid,status;

//菜单栏状态
let pageConfig = {
    data: {
        totop:'none',
        nomore:'none',
        scrollTop : 0,
        scrollHeight:0,
        list:[{style:'hu',img:[],text:'',status:false,},{style:'ke',img:[],text:'',status:false,},
                {style:'can',img:[],text:'',status:false,},{style:'wo',img:[],text:'',status:false,},
                {style:'er',img:[],text:'',status:false,},{style:'shu',img:[],text:'',status:false,},
                {style:'chu',img:[],text:'',status:false,},{style:'yang',img:[],text:'',status:false,},
                {style:'guo',img:[],text:'',status:false,},{style:'qi',img:[],text:'',status:false,},],
        detail:{},
        userInfo:{},
        imgPrew:[],
  
    },
    onReady: function() {
        //初始化数据
        // this.setData({
        //      like:this.data.likeimg.default,
        //    });
    },
    onLoad:function(options){
       var that = this;
        that.setData({
             loading_hidden:false,
       });
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
            console.log(personInfo);
        })
       aid = options.aid;
       status = options.status;
       console.log(status);
       that.init();
      
    },
    onShareAppMessage: function () {
        return {
            title: '定制商城',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/store/list/list?shareid=2'
        }
    }, 
    init(){
       typeof wx.getStorageSync('openid')!='undefined' ? openid = wx.getStorageSync('openid'):openid = app.globalData.openid;
      let that = this,url,data;
     wx.showToast({
          title: 'loading...',
          icon: 'loading',
          duration: 2000
        })
     if(status == 'add'){
        url=app.api.check_edit;
        data={
          openid:openid,
          token:'wxapp',
          source_type:2,
        }
         wx.request({
          url: url,
          method: 'POST',
          dataType: 'json',
          data :data,
          header: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: ( res )=>{
              if(res.data.status == 'success' ){
                console.log(res.data)
                var data = res.data.four;
                that.data.detail = res.data.list;
                if(data!=''||data.length>0){
                    data.map((x,y)=>{
                      that.data.list.map((v,k)=>{
                        if(v.style == x.style){
                            v.img.push(x.pic);
                            if(x.text.indexOf('&amp;hc')>=0){
                               v.text = x.text.split('&amp;hc').join('\n');
                            } else{
                               v.text = x.text;
                             }
                            v.status=true;
                        }

                      })
                    })
                    if(!~that.data.detail.pic.indexOf('http://img1.homekoocdn.com')){
                        that.data.detail.pic = 'http://img1.homekoocdn.com/huxing_fangan/images/juzhen/b/'+that.data.detail.pic;
                    }
                    that.data.detail.post_date = that.timestampToTime(that.data.detail.post_date);
                    if(that.data.detail.house_cost.indexOf('&lt;')>=0){
                      that.data.detail.house_cost = that.data.detail.house_cost.replace(/&lt;/g, '<');
                     }
                     if(that.data.detail.house_cost.indexOf('&gt;')>=0){
                      that.data.detail.house_cost = that.data.detail.house_cost.replace(/&gt;/g, '>');
                     }
                      var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
                      that.data.imgPrew.push(that.data.detail.pic)
                      that.changString(data,str);
                    wx.hideToast();
                    that.setData({
                      list:that.data.list,
                      detail:that.data.detail,
                  });
                } 
             }else{
                  that.fail();
              }
            },
           fail(){
              that.fail();
             } 
        })
     } else{
        url=app.api.user_edit;
        data={
          openid:openid,
          token:'wxapp',
          source_type:2,
          id:aid,
        }
         wx.request({
            url: url,
            method: 'POST',
            dataType: 'json',
            data : data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: ( res )=>{
              console.log(res);
                if(res.data.status == 'success'){
                var data = res.data.four;
                that.data.detail = res.data.detail[0];
                if(data!=''||data.length>0){
                     data.map((x,y)=>{
                      that.data.list.map((v,k)=>{
                        if(v.style == x.style){
                            v.img.push(x.pic);
                            if(x.text.indexOf('&amp;hc')>=0){
                               v.text = x.text.split('&amp;hc').join('\n');
                            } else{
                               v.text = x.text;
                             }
                            v.status=true;
                        }

                      })
                    })
                    if(!~that.data.detail.pic.indexOf('http://img1.homekoocdn.com')){
                        that.data.detail.pic = 'http://img1.homekoocdn.com/huxing_fangan/images/juzhen/b/'+that.data.detail.pic;
                    }
                    that.data.detail.post_date = that.timestampToTime(that.data.detail.post_date);
                    if(that.data.detail.house_cost.indexOf('&lt;')>=0){
                      that.data.detail.house_cost = that.data.detail.house_cost.replace(/&lt;/g, '<');
                     }
                     if(that.data.detail.house_cost.indexOf('&gt;')>=0){
                      that.data.detail.house_cost = that.data.detail.house_cost.replace(/&gt;/g, '>');
                     }
                      var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
                      that.data.imgPrew.push(that.data.detail.pic)
                      that.changString(data,str);
                    wx.hideToast();
                    that.setData({
                      list:that.data.list,
                      detail:that.data.detail,
                  });
                      console.log(that.data.detail);
                } 
               }else{
                        that.fail();
                    }
                  },
                 fail(){
                    that.fail();
                   } 

          })
     }
      
    },
     changString(data,obj){
      let that = this;
      data.map((x,y)=>{
          that.data.imgPrew.push(x.pic);
      })
      return data;
    },
    imgPrew(e){
      let {url} = e.currentTarget.dataset || e.target.dataset,that=this;
      console.log(url);
      wx.previewImage({
        current: url, 
        urls: that.data.imgPrew
      })
    },
    fail(){
      let that = this;
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
    },
   timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000),Y,M,D;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        return Y+M+D;
    },
     checkArray:(res)=>{
      if(res[0]==''&&res.length==1){
          res=[];
      }
      return res;
    },
    scroll:function(event){
      //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
       if(event.detail.scrollTop > 5){
        this.setData({
             totop : 'block'
           });
       } else{
            this.setData({
             totop : 'none'
           });
       }
       // console.log(event.detail.scrollTop);
     },
     totop(){
         this.setData({
                 scrollTop : 0,
            });
        
     },
}

pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig,func);
Page(nextConfig);
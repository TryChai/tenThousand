import { func } from '../../template/footerList/footerList';
/*
登陆操作
登陆成功根据身份存储本地信息
设计师 1，用户 2
 */
let app=getApp();
let id = 0,openid='',link='',favor=0;  
let pageConfig = {
    data: {
          userState:false,
          userimg:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/usecheck-bg.png',
                    'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/usecheck-active.png'
                  },
          designState:false,
          designimg:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/designcheck-bg.png',
                    'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/designcheck-active.png'
                  },
          Mb:false,
          notic:false,
          phone:'',
          vcode:'',
          vcode_real:'',
          vcode_text:'获取验证码',
          vcodeState:true,
          fail_title:'登录失败',
          fail_content:'验证码输入错误，请重新输入或获取验证码~',
          vcodeSend:false,
        },
    onLoad: function(options) {
         //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        var that = this;
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
        })
      let openidtime =  setInterval(function(){
        app.globalData.openid !='' && typeof app.globalData.openid !='undefined' ? (openid = app.globalData.openid,clearInterval(openidtime)) :null;
       },100)
      var pages = getCurrentPages();  
        if (pages.length > 1) {  
            //上一个页面实例对象  
            var prePage = pages[pages.length - 2];  
            console.log(prePage.route);
            typeof options !='undefined' ? (id = options.id,favor=options.favor) :null;
            link = prePage.route;

            console.log(id);
        }
    },
    closeMb(){
       let that =this;
       that.setData({
          Mb:false,
          notic:false,
       }) 
    },
    chooseUser(){
       let that =this;
       if(!that.data.vcodeSend){
         that.setData({
            userState:!that.data.userState,
            designState:false,
         })  
         return false;
       }
    },
    chooseDesign(){
       let that =this;
      if(!that.data.vcodeSend){
        app.Toast('敬请期待','none');
         // that.setData({
       //    designState:!that.data.designState,
       //    userState:false,
       // })  
         return false;
       }
       // that.setData({
       //    designState:!that.data.designState,
       //    userState:false,
       // })  
    },
    getPhone(e){
        if(e.detail.value!='') {
          this.setData({
            phone:e.detail.value,
          })
        }
    },
    getVcode(e){
        if(e.detail.value!='') {
          this.setData({
            vcode:e.detail.value,
          })
        }
    },
    sendVcode(){
       let i = 59,vcodetime,that=this,getvcode_url = app.api.get_vcode,identify; 
       if(that.data.vcodeState){
         identify = that.data.userState ?  2 : that.data.designState ? 1 :0;
         if(!that.data.userState && !that.data.designState){
            that.alert('请选择登录身份');
              return false;
          }
         if(that.data.phone==''){
           that.alert('手机号码不能为空');
           return false;
         }
         if(!/^1[3|5|8|7]\d{9}$/.test(that.data.phone)){
            that.alert('手机号码格式不正确');
            return false;
        }
        let data={
            phone:that.data.phone,
            identify:identify,
        }
        that.Ajax(getvcode_url,data,function(res){
              console.log(res);
              if(res.data.status == 1000){
                that.setData({
                  vcode_real:res.data.msg,
                  vcodeSend:true,
                })
                that.vcodeCut('已发送');
                return false;
              } 
              if(res.data.status == "false"){
                   that.setData({
                      Mb:true,
                      notic:true,
                      fail_title:'获取失败',
                      fail_content:'尚品宅配后台查询不到您的手机号，请联系店长登录管理后台添加你的信息。',
                    })
              }
          })
       }
    },
    submit(){
      let that = this,data,login_url=app.api.login_url,identify,view_url;
      identify = that.data.userState ?  2 : that.data.designState ? 1 :0;
      if(!that.data.userState && !that.data.designState){
        that.alert('您还没选择您的身份');
          return false;
      }
      if(that.data.phone==''){
         that.alert('手机号码不能为空');
         return false;
       }
       if(!/^1[3|5|8|7]\d{9}$/.test(that.data.phone)){
          that.alert('手机号码格式不正确');
          return false;
      } 
      if(that.data.vcode == ''){
         that.alert('验证码不能为空');
          return false;
      }
      if(that.data.vcode != that.data.vcode_real){
        that.setData({
          Mb:true,
          notic:true,
          fail_title:'登录失败',
          fail_content:'验证码输入错误，请重新输入或获取验证码~',
        })
        return false;
      }
      var userInfo = wx.getStorageSync('userInfo');
      var openid = wx.getStorageSync('openid');
       data={
            phone:that.data.phone,
            identify:identify,
            code:that.data.vcode,
            openid:openid,
            nickname:userInfo.nickName,
            sex:userInfo.gender,
            headimgurl:userInfo.avatarUrl,
            city:userInfo.city,
            country:userInfo.country,
            province:userInfo.province,
        }
        that.Ajax(login_url,data,function(res){
          console.log(res);
            if(res.data.status == 1000){
             wx.setStorageSync('login', identify);
                // view_url = link != '' ? '../../'+link+'?id='+id+'&is_login=1&favor='+favor : identify == 1 ? '../design/index/index' :identify ==2 ? '../user/index/index':'login/login';
                view_url = identify == 1 ? '../design/index/index' :identify ==2 ? '../user/index/index':'login/login';
                that.viewtap(view_url);
            }
        })
        // console.log(app.globalData.login);
    },
    vcodeCut(text){
       let i = 59,vcodetime,that=this; 
       if(that.data.vcodeState){
           that.setData({
              vcode_text:text+'59s',
              vcodeState:false,
            })
           vcodetime = setInterval(function(){
                i--;
                if(i<=0){
                  i=60;
                  clearInterval(vcodetime);
                  // console.log(i);
                  that.setData({
                    vcode_text:'获取验证码',
                    vcodeState:true,
                  })
                  return false;
                } else{
                  that.setData({
                    vcode_text:text+i+'s',
                    vcodeState:false,
                  })
                } 
            },1000)
       }

    },
     alert:function(t){
        wx.showModal({
            title:"系统提示",
            content:t,
            showCancel: false,
            confirmColor: '#000'
        });
    },
     viewtap(url){
      wx.reLaunch({
        url: url,
      })
        // wx.navigateTo({
        //      url:url,
        //      //接口调用成功的回调方法
        //      fuccess:function(){},
        //      //接口调用失败的回调方法
        //      fail:function(){},
        //      //接口调用无论成功或者失败的回调方法
        //      complete:function(){}
        //  })
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
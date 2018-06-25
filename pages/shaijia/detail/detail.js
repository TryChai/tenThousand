
import { func } from '../../../template/footerList/footerList';
let common = require('../../../common/common.js');
let app = getApp(), id = 0,openid,type=3,attenOpenid;

//菜单栏状态
let pageConfig = {
    data: {
        totop:'none',
        nomore:'none',
        scrollTop : 0,
        scrollHeight:0,
        list:{},
        loading_hidden:true,
        atten:false,
        zanState:false,
        zan:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/zan.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/zan-active.png'},
        zangif:false,
        favorState:false,
        favor:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/favor.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/favor-active.png'},
        likeState:false,      
        like:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/like.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/like-active.png'},
        focus:false,
        input_value:'',
        discussMb:false,
        loginMb:false,
        url:app.api.ganhuo_detail,
        detail:{},
        tuijian:{},
        comments:[],
        comments_text:'',
        toView: 'inToView01',
        design:{},
        anli:{},
        attenShow:true,
        adjust:false,
        imgPrew:[],
    },
    onReady: function() {
     
      
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
            // console.log(app.globalData.openid);
        })
      
        that.setData({
           zanState:0,
           favorState:0,
            [`${'detail'}.comment`]:0,
            [`${'detail'}.view`]:0,
            [`${'detail'}.tags`]:0,
        });
        id = options.id;
        typeof options.openid !='undefined' ? openid = options.openid :null;
        openid = typeof wx.getStorageSync('openid') !='undefined'? wx.getStorageSync('openid') :'';
         that.init(id,openid);
         if(typeof options !='undefined'){
	       	if(options.is_login == 1){
	       		// console.log(options);
	       		that.setData({
	       			favorState:options.favor,
	       		})
	       		that.favor();
	       	}
	     }
       //获取页面栈  
        var pages = getCurrentPages();  
        if (pages.length > 1) {  
            //上一个页面实例对象  
            var prePage = pages[pages.length - 2];  
            //关键在这里,这里面是触发上个界面  
           (typeof (prePage.changeData)&&(prePage.changeData) instanceof Function) ? prePage.changeData(id):null;// 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数  
        }  
        if(typeof options.state !='undefined'&& options.state=='ping'){
          setTimeout(function(){
            that.setData({
             focus : false,
             toView: 'inToView-discuss',
            });
            setTimeout(function(){
                that.setData({
                 focus : true,
                });
            },200)
          },800)
       }
       
    },
    onShareAppMessage: function () {
        return {
            title: '业主晒家',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/store/list/list?shareid=2'
        }
    }, 
    init(id,openid){
      let that = this;
      let data = {
          'openid':openid,
           id:id,
           token:'wxapp',
           source_type:2,
           type:type ,
           article_id:id,
      };
       that.setData({
            loading_hidden:false,
        });
      if(openid == ''){
        setTimeout(function(){
            openid = app.globalData.openid;
            // console.log(openid)
            that.getlist(data);
        },1000)
      }
     that.getlist(data);
       
    },
    getlist(data){
      let that = this;
       that.Ajax(this.data.url,data,function(res){
        if(res.statusCode == 200){
          // console.log(res)
          if(res.data!=''){
             attenOpenid = res.data.detail.openid;
             console.log(res.data);
             if(attenOpenid == openid){
              that.data.attenShow = false;
             }
             if(res.data.detail.house_cost.indexOf('&lt;')>=0){
              res.data.detail.house_cost = res.data.detail.house_cost.replace(/&lt;/g, '<');
             }
             if(res.data.detail.house_cost.indexOf('&gt;')>=0){
              res.data.detail.house_cost = res.data.detail.house_cost.replace(/&gt;/g, '>');
             }
             var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
             that.data.imgPrew.push(res.data.detail.pic)
             res.data.anli = that.changString(res.data.anli,str);
             that.setData({
                   loading_hidden:true,
                   detail:res.data.detail,
                   tuijian:res.data.tuijian,
                   zanState:res.data.is_tag,
                   favorState:res.data.is_collection,
                   comments:res.data.comments,
                   design:res.data.designer_info,
                   atten:res.data.is_guanzhu,
                   anli:res.data.anli,
                   attenShow:that.data.attenShow,
                   imgPrew:that.data.imgPrew,
             });
           }
        }else{
            that.fail();
        }
       })
    },
    changString(data,obj){
      let that = this;
      obj.map((x,y)=>{
        if(data[x] != null && data[x].indexOf('&amp;hc')>=0){
            data[x] = data[x].split('&amp;hc').join('\n');
        }
         if(data[`${ obj[y]}_pic`].length>0){
          data[`${ obj[y]}_pic`].map((v,k)=>{
            if(v!=''){
              that.data.imgPrew.push(v);
            }
          })
         }
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
    atten(){
      let that = this;
      if(that.data.atten == 0){
        app.atten({openid:attenOpenid,sub_openid:app.globalData.openid},function(res){
            if(res.data.code == 'success' || res.data.code == 200){
                that.setData({
                 atten:true,
                });
            } else{
                that.fail();
            }
        })
      } else{
         app.cancelAtten({openid:attenOpenid,sub_openid:app.globalData.openid},function(res){
            if(res.data.code == 'success'){
                that.setData({
                 atten:false,
                });
            } else{
                that.fail();
            }
        })
      }
    },
    Baobtn(){
      let url='';
     app.isLogin(function(res){
      // console.log(res);
      url = res=='user'|| res=='design' ? '../../yuyue/haslogin/yuyue':'../../yuyue/nologin/yuyue';
        wx.navigateTo({
           url:url,
           //接口调用成功的回调方法
           fuccess:function(){},
           //接口调用失败的回调方法
           fail:function(){},
           //接口调用无论成功或者失败的回调方法
           complete:function(){}
       })
     });
    },
    zan(){
      let that = this;
       that.setData({
            loading_hidden:false,
        });
        that.data.zanState ? that.data.detail.tags-- :that.data.detail.tags++;
        let zanurl;
        let data ={
          openid:app.globalData.openid,
          source_type:2,
          type:type,
          article_id:id,
        }
         zanurl = !that.data.zanState ? app.api.article_setzan:app.api.article_cancelzan;
        that.Ajax(zanurl,data,function(res){
          if(res.data.code == 200){
            that.setData({
               loading_hidden:true,
               zanState : !that.data.zanState,
               detail:that.data.detail,  
            });
          } else{
                that.fail();
            }
        })  
    },
    like(e){
      let comment_id = e.currentTarget.dataset.id,that = this,data,comment_url,likeState = e.currentTarget.dataset.like,index= e.currentTarget.dataset.index;
       that.setData({
            loading_hidden:false,
        });
      if(likeState == 0){
        comment_url = app.api.comment_setzan;
        that.data.comments[index].tags++;
        that.data.comments[index].has_zan = 1;
      }else{
        comment_url = app.api.comment_concelzan;
        that.data.comments[index].tags--;
        that.data.comments[index].has_zan = 0;
      }
      data ={
          openid:app.globalData.openid,
          source_type:2,
          type:type,
          comment_id:comment_id,
      }
      // console.log(comment_url)
      that.Ajax(comment_url,data,function(res){
        // console.log(res);
          if(res.data.code == 200 || res.data.code == 300){
            that.setData({
               loading_hidden:true,
               comments:that.data.comments,
            });
          } else{
                that.fail();
            }
        })  
    },
    favor(){
      let that = this,data,favorUrl,login,islogin_url=app.api.is_login;
      that.setData({
           loading_hidden:false,
        });
      app.isLogin(function(res){
            if(res == 'user' || res == 'design'){
              data ={
                  openid:app.globalData.openid,
                  source_type:2,
                  type:type,
                  article_id:id,
              }
              // console.log(that.data.favorState);
              favorUrl = that.data.favorState == 0 ? app.api.article_setcollect : app.api.article_concelcollect;
                that.Ajax(favorUrl,data,function(res){
                  // console.log(res);
                   that.setData({
                       loading_hidden:true,
                    });
                  if(res.data.code == 'success'|| res.data.code == 200 ){
                    that.setData({
                       favorState:!that.data.favorState,
                       discussMb:true,
                       comments_text: that.data.favorState == 0 ?'收藏成功了~':'取消收藏成功了~',
                    });
                    let favortime = setTimeout(function(){
                      that.setData({
                         discussMb:false,
                      }); 
                    },800);
                  } 
                })  
            } else{
              that.setData({
                 loading_hidden:true,
                loginMb:true,
              });
          }
      })
    },
    loginX(){
        this.setData({
             loginMb : !this.data.loginMb,
        });
    
    },
    login(){
    	wx.navigateTo({
             url:'../../login/login?id='+id+'&favor='+this.data.favorState,
         })
    },
    ping(){
        this.setData({
             focus : true,
             toView: 'inToView-discuss',
        });
        
    },
    send(){
      // 发表评论
        let that = this,myDate = new Date(), mytime=(parseInt(myDate.getHours()) < 10 ?'0'+ myDate.getHours() :myDate.getHours())+':'+(parseInt(myDate.getMinutes()) < 10 ?'0'+ myDate.getMinutes() :myDate.getMinutes());
       that.setData({
            loading_hidden:false,
        });
      setTimeout(function(){
       
        if(that.data.input_value ==''){
          that.setData({
             loading_hidden:true,
             comments_text:'您还没有输入任何文字哦~',
             discussMb:true,
          });
          setTimeout(function(){
              that.setData({
                   discussMb:false,
                });
            },800);
          return false;
        }
        if(that.data.input_value !=''&& that.data.input_value!=null){
            that.setData({
             loading_hidden:false,
          });
            let data ={
              openid:app.globalData.openid,
              source_type:2,
              type:type,
              article_id:id,
              comments:that.data.input_value,
              headimgurl:app.globalData.userInfo.avatarUrl,
              nickname:app.globalData.userInfo.nickName,
            }
             let senurl = app.api.setcomment;
            that.Ajax(senurl,data,function(res){
              console.log(res);
              if(res.data.code == 200){
                 let temp = {
                    nickname:app.globalData.userInfo.nickName,
                    comments:that.data.input_value,
                    user_head_img:app.globalData.userInfo.avatarUrl,
                    post_date:mytime,
                    id: res.data.comment_id,
                    tags:0,
                    has_zan:0,
                }
                that.data.comments.unshift(temp);
                that.setData({
                   loading_hidden:true,
                   comments_text:'评论发送成功~',
                   discussMb:true,
                   input_value:'',
                });
              } else{
                  that.setData({
                   loading_hidden:true,
                   comments_text:'评论发送失败~',
                   discussMb:true,
                   input_value:'',
                });
              }
            })  
            setTimeout(function(){
              that.setData({
                   discussMb:false,
                   comments:that.data.comments,
                });
            },800);
        }
      },300);
     
    },
    getInput(e){
      this.setData({
             input_value : e.detail.value,
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
              // console.log(res);
               if(res.statusCode == 200){
                 if (typeof func!='undefined') func(res);
               }
            },
            fail:function(res){
                console.log(res);
            }
        });
    },
     router(e){
        // console.log(e.currentTarget);
        let id = e.currentTarget.dataset.id,type = e.currentTarget.dataset.type,url;
        url= type==1? "../../../pages/jingxuan/detail/detail?id="+id+"&is_list=0" : type==2?/*"../../../pages/designlist/detail/detail?id="+id+"&is_list=0"*/app.Toast('敬请期待','none') :"../../../pages/shaijia/detail/detail?id="+id+"&is_list=0" 
        if(type!=2){
          wx.navigateTo({
               url:url,
               //接口调用成功的回调方法
               fuccess:function(){},
               //接口调用失败的回调方法
               fail:function(){},
               //接口调用无论成功或者失败的回调方法
               complete:function(){}
           })
        }
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
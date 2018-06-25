var app = getApp(),openid,url;
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
        banner:'',
        icon:['http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/icon-artical.jpg',
              'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/icon-collect.jpg'],
        favorState:true,
        favor:{'default':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/favor.png',
              'active':'http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/favor-active.png'},
        nodata_text:'Ta还没有任何的收藏~',
        NavigationBarTitle:'我的收藏',
        datalist:[],
        collect:false,
    },
    onReady: function() {
        //初始化数据
         let t = this;
        wx.setNavigationBarTitle({  
            title: t.data.NavigationBarTitle,   
        }) 
    },
    onLoad:function(options){
       var that = this;
        that.setData({
           loading_hidden:false,
        });
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
       }
       wx.getSystemInfo({
         success:function(res){
           that.setData({
             scrollHeight:res.windowHeight
           });
         }
       });
       if(options.who == 'me' ){
        if(options.type=="collect"){
          that.data.NavigationBarTitle = '我的收藏';
          that.data.banner = that.data.icon[1];
          that.data.collect = true;
          that.data.nodata_text="你还没有任何的收藏，快去收藏吧~";
           url = app.api.user_collect;
        } else{
          that.data.NavigationBarTitle = '我的文章';
          that.data.banner = that.data.icon[0];
          that.data.collect = false;
          that.data.nodata_text="你还没有任何的文章，快去发布吧~";
           url = app.api.user_article;
        }
       } else{
        console.log(options);
         openid = options.openid;
        if(options.type=="collect"){
          that.data.NavigationBarTitle = 'Ta的收藏';
          that.data.banner = that.data.icon[1];
          that.data.collect = false;
          that.data.nodata_text="Ta还没有任何的收藏~";
           url = app.api.user_collect;
        } else{
          that.data.NavigationBarTitle = 'Ta的文章';
          that.data.banner = that.data.icon[0];
          that.data.collect = false;
          that.data.nodata_text="Ta还没有任何的文章~";
           url = app.api.user_article;
        }
       }
       that.setData({
        NavigationBarTitle:that.data.NavigationBarTitle,
        nodata_text:that.data.nodata_text,
        banner:that.data.banner,
        collect:that.data.collect,
       })
          let data = {
             openid:openid,
             page:that.data.page,
             token:'wxapp',
             source_type:2,
             count:that.data.count,
        	};
         that.getList(url,data,function(res){
          if(res.data.status == 'success'){
            if(res.data.data!=''&&res.data.data.length>0){
              if(res.data.data.length>=that.data.count){
                var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
                that.getDes(res.data.data,str);
                 that.setData({
                   datalist:res.data.data,
                   loading_hidden:true,
                   nomore:true,
                   push:true,
                   nodata:false,
                 }); 
              } else{
                var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
                that.getDes(res.data.data,str);
                that.setData({
                   datalist:res.data.data,
                   loading_hidden:true,
                   nomore:false,
                   push:false,
                   nodata:false,
                 }); 
              }
            } else{
               that.setData({
                   nodata:true,
                   loading_hidden:true,
                 }); 
            }
          } else{
               that.setData({
                   nodata:true,
                   loading_hidden:true,
                 }); 
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
              console.log(that.data.favorState);
              favorUrl = that.data.favorState == 0 ? app.api.article_setcollect : app.api.article_concelcollect;
                that.Ajax(favorUrl,data,function(res){
                  console.log(res);
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
    cancelFavor(e){
      let data,num,that = this,{id,type}=e.currentTarget.dataset || e.target.dataset;
       data ={
          openid:openid,
          source_type:2,
          type:type,
          article_id:id,
      };
      that.getList(app.api.article_concelcollect,data,function(res){
        console.log(res);
         that.setData({
             loading_hidden:true,
          });
        if(res.data.code == 'success'|| res.data.code == 200 ){
          that.data.datalist.map((x,y)=>{
            if(x.id == id){
              num = y;
            }
          })
          that.data.datalist.splice(num,1);
          if(that.data.datalist.length<=0){
              that.data.nodata = true;
              that.data.nomore = true;
          } else{
              that.data.nodata = false;
              that.data.nomore = false;
            }
          that.setData({
            datalist:that.data.datalist,
            nodata:that.data.nodata,
            nomore:that.data.nomore,
          })
        } 
      })  
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
     getDes(obj,str){
      let that = this,text='';
      obj.map((x,y)=>{
        if(typeof x.des == 'string') {
          if(x.des != null && x.des.indexOf('&amp;hc')>=0){
              x.des = obj[y].des.split('&amp;hc').join('\n');
          }
        }  
      })
      return obj;
     },
    bindDownLoad(){
        let that = this;
        let data = {};
        if(that.data.push){
          that.data.page ++;
           data = {
             openid:openid,
             page:that.data.page,
             token:'wxapp',
             source_type:2,
             count:that.data.count,
            };
            // console.log(data);
           that.setData({
               push:false,
            }); 
            that.getList(url,data,function(res){
                 if(res.data.status == 'success'){
                    console.log(res.data)
                    if(res.data.data!='' && res.data.data.length>0){
                      if(res.data.data.length>that.data.count){
                         var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
                          that.getDes(res.data.data,str);
                          that.data.datalist = that.data.datalist.concat(res.data.data);
                         that.setData({
                           datalist:that.data.datalist,
                           loading_hidden:true,
                           nomore:true,
                           push:true,
                           nodata:false,
                         }); 
                      } else{
                        var str = ['hu','ke','can','wo','chu','er','shu','yang','guo','qi'];
                        that.getDes(res.data.data,str);
                        that.data.datalist = that.data.datalist.concat(res.data.data);
                        that.setData({
                           datalist:that.data.datalist,
                           loading_hidden:true,
                           nomore:false,
                           push:false,
                           nodata:false,
                         }); 
                      }
                    } else{
                       that.setData({
                           nodata:false,
                           nomore:false,
                           loading_hidden:true,
                         }); 
                    }
                  } else{
                      that.setData({
                         nodata:false,
                         nomore:false,
                         loading_hidden:true,
                       }); 
                   }
           });
        }
    },
     router(e){
        // console.log(e.currentTarget);
        let {id,type}= e.currentTarget.dataset || e.target.dataset,url;
        url= type==1? "../../../pages/jingxuan/detail/detail?id="+id+"&is_list=0" : type==2?"../../../pages/designlist/detail/detail?id="+id+"&is_list=0" :"../../../pages/shaijia/detail/detail?id="+id+"&is_list=0" 
        wx.navigateTo({
             url:url,
         })
     },
     ping(e){
        // console.log(e.currentTarget);
        let {id,type}= e.currentTarget.dataset || e.target.dataset,url;
        url= type==1? "../../../pages/jingxuan/detail/detail?id="+id+"&is_list=0&ping=1" : type==2?"../../../pages/designlist/detail/detail?id="+id+"&is_list=0&ping=1" :"../../../pages/shaijia/detail/detail?id="+id+"&is_list=0&ping=1" 
        wx.navigateTo({
             url:url,
         })
     },
    // 提交预约
    getList(url,data,callback){
      let that = this;
       that.setData({
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
                if(typeof callback !='undefined') callback(res);
                 var data=res.data;
                if(data.status==1000){
                    that.setData({
                       loading_hidden:true,
                    });
                }
            },
            fail:function(res){
                console.log(res);
                 that.setData({
                       loading_hidden:true,
                 });
            }
        })
    }
}

pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);
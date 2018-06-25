var app = getApp(),openid,status,aid;
//菜单栏状态
let pageConfig = {
    data: {
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
        mbInfo:false,
        titledata:{
          title:'',
          cover:'',
          des:'',
        },
        nocover:false,
        update:false,
        textareashow:true,
        draft:'',
        cursorIndex:0,
    },
    onReady: function() {
        //初始化数据
        if (wx.createCameraContext()) {  
          this.cameraContext = wx.createCameraContext('myCamera')  
        } else {  
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
          wx.showModal({  
            title: '提示',  
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'  
          })  
        }  
    },
    onLoad:function(options){
       var that = this;
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
            console.log(personInfo);
        })
        var userData = wx.getStorageSync('userData');
        status = options.status;
        aid = options.aid;
         typeof wx.getStorageSync('openid')!='undefined' ? openid = wx.getStorageSync('openid'):openid = app.globalData.openid;
          if(options.status == 'edit' || options.stc == 'back'){
            wx.showToast({
              title: 'loading...',
              icon: 'loading',
            })
              wx.request({
                url: app.api.user_edit,
                method: 'POST',
                dataType: 'json',
                data : {openid:openid,source_type:2,id:aid},
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: ( res )=>{
                  console.log(res);
                 
                    if(res.data.status == 'success'){
                      var detail = res.data.detail[0];
                        that.data.titledata.title = detail.title;
                        that.data.titledata.cover = detail.pic;
                        that.data.titledata.des = detail.gaishu =='null'?'': detail.gaishu;
                        that.data.draft = detail.gaishu =='null'?'': detail.gaishu;
                        if(that.data.titledata.cover.indexOf('img1.homekoocdn.com')>0){
                          that.data.update = 0;
                        }
                      that.setData({
                            titledata:that.data.titledata,
                            draft:that.data.draft,
                            update:that.data.update,
                        });
                      console.log( that.data.titledata.des);
                   }else{
                        that.fail();
                    }
                     setTimeout(function(){
                        wx.hideToast();
                    },400);
                  },
                 fail(){
                    that.fail();
                   } 
              })
          }
    },
    back(){
      console.log('3bu');
       wx.reLaunch({
          url: "../secondstep/secondstep?stc=back&aid="+aid+"&status="+status,
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
    closeMb(){
      this.setData({
        mbNotic:false,
        mbInfo:false,
        textareashow:true,
      });
    },
    choseCover(){
      this.setData({
        nocover:true,
      });
    },
    chooseImg(e){
      let{type} = e.currentTarget.dataset || e.target.dataset, that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            that.data.update = true;
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths.toString();
          that.setData({
            [`${'titledata'}.cover`]:tempFilePaths,
            nocover:false,
            update:that.data.update,
          })
        }
      })
    },
    nestStep(){
      let that = this,id,userData;
      that.data.titledata.title == '' ? this.setData({ mbInfo:true,textareashow:false, }):null;
      that.data.titledata.cover == '' ? this.setData({ mbInfo:true,textareashow:false, }):null;
      if(that.data.titledata.title !='' && that.data.titledata.cover!=''){
        that.setData({
           loading_hidden:false,
        });
         if( that.data.titledata.cover.indexOf('img1.homekoocdn.com')<0 ){
            wx.uploadFile({
              url: app.api.upload, //仅为示例，非真实的接口地址
              filePath: that.data.titledata.cover,
              name: 'file',
              formData:{
                'style': 'banner',
                 step:3,
                 id:aid,
                 openid:openid,
                 title:that.data.titledata.title,
                 gaishu:that.data.draft,
                 status:status,
                 update:that.data.update?1:0,
              },
              success: function(res){
                var data = res.data;
                console.log(data);
                data = JSON.parse(data);
               if(data.state="success"){
                setTimeout(function(){
                  that.setData({
                         loading_hidden:true,
                   });
                    wx.reLaunch({
                      url: "../fourstep/fourstep?status="+status+"&aid="+aid,
                    })
                },500);
               }
              },
              fail(res){
                 console.log(res);
               },
            })
         } else{
          wx.request({
              url: app.api.upload,
              method: 'POST',
              dataType: 'json',
              data : {
                'style': 'banner',
                 step:3,
                 id:aid,
                 openid:openid,
                 title:that.data.titledata.title,
                 gaishu:that.data.draft,
                 status:'edit',
                 pic:that.data.titledata.cover,
                 update:that.data.update?1:0,
               },
              header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: ( res )=>{
                 var data = res.data;
                console.log(data);
                // data = JSON.parse(data);
               if(data.state="success"){
                    wx.reLaunch({
                      url: "../fourstep/fourstep?stc=back&status="+status+"&aid="+aid,
                    })
               }
              }
            })
         }
           
        
      }
    },
   getValue(e){
    let {type}=e.currentTarget.dataset||e.target.dataset,{value,cursor}=e.detail,that=this;
    if(type!='des'){
        that.setData({
          [`${'titledata'}.${type}`] :value
        })
    } else{
      that.setData({
        draft:value,
        cursorIndex: cursor,
      })
    }
   },
}

pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);
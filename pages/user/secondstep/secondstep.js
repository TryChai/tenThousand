var app = getApp(),openid,status,aid,stc='';
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
        jobdata:{
          job:'',
          address:'',
          introduction:'',
        },
        textareashow:true,
        draft:'',
        cursorIndex:0,
    },
    onReady: function() {
        //初始化数据
        
    },
    onLoad:function(options){
       var that = this;
       wx.getSystemInfo({
         success:function(res){
           that.setData({
             scrollHeight:res.windowHeight
           });
         }
       });
       typeof wx.getStorageSync('openid')!='undefined' ? openid = wx.getStorageSync('openid'):openid = app.globalData.openid;
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
        })
          aid = options.aid;
          status = options.status;
          stc = options.stc;
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
                  if(res.data.status == 'success'){
                    // wx.hideToast();
                    var detail = res.data.detail[0];
                      that.data.jobdata.job = detail.position == 'null'?'':detail.position;
                      that.data.jobdata.address = detail.area == 'null'?'':detail.area;
                      that.data.jobdata.introduction = detail.jianjie == 'null'?'':detail.jianjie;
                      that.data.draft = detail.jianjie == 'null'?'':detail.jianjie;
                    that.setData({
                          draft:that.data.draft,
                          jobdata:that.data.jobdata,
                      });
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
    back(){
      console.log('3bu');
       wx.reLaunch({
          url: "../firststep/firststep?stc=back&aid="+aid+"&status="+status,
        })
    },
    closeMb(){
      this.setData({
        mbNotic:false,
        mbInfo:false,
        textareashow:true,
      });
    },
    nestStep(){
      let that = this,userData,id,parm;
      if(that.data.jobdata.job == '' || that.data.jobdata.job == null ||that.data.jobdata.address == '' ||that.data.jobdata.address == null){
        this.setData({ mbInfo:true,textareashow:false })
      }
      that.setData({
         loading_hidden:true,
      });
      if(that.data.jobdata.job !='' && that.data.jobdata.address!='' && that.data.jobdata.job !=null && that.data.jobdata.address!=null){
         if(status == 'add'){
           parm={
             id:aid,
             step:2,
             openid:openid,
             position:that.data.jobdata.job,
             area:that.data.jobdata.address,
             jianjie:that.data.draft,
             status:status,
           };
         } else{
           parm={
             id:aid,
             step:2,
             openid:openid,
             position:that.data.jobdata.job,
             area:that.data.jobdata.address,
             jianjie:that.data.draft,
             status:status,
           };
         }
          wx.setStorageSync('userData',userData);
           wx.request({
              url: app.api.fabu,
              method: 'POST',
              dataType: 'json',
              data : parm,
              header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: ( res )=>{
                 if(res.statusCode == 200){
                  if(res.data.status == 'success'){
                    that.setData({
                       loading_hidden:false,
                    });
                      wx.reLaunch({
                        url: "../thirdstep/thirdstep?status="+status+"&aid="+aid+"&stc="+stc,
                      })
                  }
                }
              }
            })
      }
    },
   getValue(e){
    let {type}=e.currentTarget.dataset||e.target.dataset,{value,cursor}=e.detail,that=this;
    if(type!='introduction'){
      that.setData({
        [`${'jobdata'}.${type}`] :value
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
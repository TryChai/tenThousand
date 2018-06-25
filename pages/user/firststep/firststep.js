var app = getApp(),designid,designername,userData,openid,status,aid,stc;
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
        nocityMb:false,
        picker:[
              {
                text:'户型',
                pickArr:['单身公寓','两居室','三居室','四居室','复式','别墅','其他'],
                value:'0',
              },
              {
                text:'风格',
                pickArr:['欧式风','简约风','中式风','田园风','新实用','混搭风','其他'],
                value:'0',
              },
              {
                text:'面积',
                pickArr:['<=50','51-70','71-90','91-140','>140','其他'],
                value:'0',
              },
              {
                text:'装修费用',
                pickArr:['<=1万','1万<X<=5万','5万<X<=10万','10万<X<=15万','15万<X<=20万','>20万'],
                value:'0',
              },
        ],
        picktext:[{value:'请选择'},{value:'请选择'},{value:'请选择'},{value:'请选择'}],
        mbNotic:false,
        mbInfo:false,
        edit:false,
        design_data:'',

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
       app.getUserInfo(function (personInfo) {
        //更新数据
            that.setData({
                userInfo: personInfo,
                openid:app.globalData.openid,
            });
            console.log(personInfo);
        })
        openid = typeof wx.getStorageSync('openid')!='undefined' ? wx.getStorageSync('openid'): app.globalData.openid;
       if(typeof options.id != 'undefined'){
          designid = options.id;
          designername = options.name;
           that.setData({
                design_data:options.name
            });
       }
      status = options.status;
      stc =  options.stc || '';
      aid = options.aid;
       if(options.status == 'edit' || options.stc == 'back'){
          wx.showToast({
                title: 'loading...',
                icon: 'loading',
                duration: 2000
              })
          // status == 'edit';
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
                    wx.hideToast();
                    var detail = res.data.detail[0];
                      that.data.picktext[0].value = detail.house_type;
                      that.data.picktext[1].value = detail.house_style;
                      that.data.picktext[2].value = detail.house_area;
                      that.data.picktext[3].value = detail.house_cost;
                      that.data.is_yc = detail.is_yc;
                      console.log(detail.is_yc);
                    that.setData({
                          picktext:that.data.picktext,
                          design_data:that.data.design_data,
                          edit:parseInt(detail.is_yc)?true:false,
                      });
                  }
              },

            })
       }
    },
    back(){
        wx.reLaunch({
          url: '../index/index'
        })
    },
    closeMb(){
      this.setData({
        mbNotic:false,
        mbInfo:false,
      });
    },
    showMb(e){
      console.log(status)
      let {type} = e.currentTarget.dataset || e.target.dataset,that=this,parm,is_yc;
      type == 'notic' ? that.setData({ mbNotic:true}) : null;
      if(type == 'info'){
        for(var i=0;i<that.data.picktext.length;i++){
          if(that.data.picktext[i].value == '请选择' || that.data.picktext[i].value == ''||!that.data.edit){
            that.setData({ mbInfo:true});
            return false;
          }
        }
         is_yc = that.data.edit ? 1 :0,
         that.setData({
           loading_hidden:true,
        });
         console.log(aid);
        if(status == 'add'&&stc==''){
          console.log(aid);
           parm={
              step:1,
              openid:openid,
              house_type:that.data.picktext[0].value,
              house_style:that.data.picktext[1].value,
              house_area:that.data.picktext[2].value,
              house_cost:that.data.picktext[3].value,
              designer:designid,
              status:status,
              is_yc:is_yc,
            };
        } else if(status=='edit' || stc == 'back'){
           parm={
              id:aid,
              step:1,
              openid:openid,
              house_type:that.data.picktext[0].value,
              house_style:that.data.picktext[1].value,
              house_area:that.data.picktext[2].value,
              house_cost:that.data.picktext[3].value,
              designer:designid,
              status:'edit',
              is_yc:is_yc,
            };
        }
           wx.request({
              url: app.api.fabu,
              method: 'POST',
              dataType: 'json',
              data : parm,
              header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: ( res )=>{
                console.log(res)
                 if(res.statusCode == 200){
                  if(res.data.status == 'success'){
                       that.setData({
                         loading_hidden:false,
                      });
                    var id  = parseInt(res.data.id);
                    if(status =='add'&& stc==''){
                      aid = res.data.id;
                    }
                    var url;
                    if(typeof stc!='undefined'&&stc!='undefined'){
                      url = "../secondstep/secondstep?status="+status+"&aid="+aid+"&stc="+stc;
                    } else{
                        url = "../secondstep/secondstep?status="+status+"&aid="+aid
                      
                    }
                      wx.reLaunch({
                        url: url
                      })
                  }
                } else{
                    that.fail();
                }
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
    switchChange(e){
      this.setData({
        edit:e.detail.value,
        is_yc:e.detail.value,
      })
    },
    listenerPickerSelected: function(e) {
      //改变index值，通过setData()方法重绘界面
      let t = e.currentTarget.dataset.t||e.target.dataset.t,value=e.detail.value,that=this,temp;
       if (wx.openBluetoothAdapter) {
            wx.openBluetoothAdapter()
          } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
          }
        temp = that.data.picker[t];
        that.data.picktext[t]={value:temp.pickArr[value]};
        temp.value = value;
        this.setData({
          picker: that.data.picker,
          picktext: that.data.picktext,
        });

    }, 
    search(e){
        // console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
           url:"../../../pages/user/search/search",
           //接口调用成功的回调方法
           fuccess:function(){},
           //接口调用失败的回调方法
           fail:function(){},
           //接口调用无论成功或者失败的回调方法
           complete:function(){}
       })
    },
}

pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);
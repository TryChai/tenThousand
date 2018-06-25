var app = getApp()
//菜单栏状态
let pageConfig = {
    data: {
        loading_hidden:true,
        loading_box:true,
        loading_msg:true,
        nomore:false,
        top:true,
        url:'',
        page:1,
        push:true,
        datalist:[],
        count:3,
        input_value:'',
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
      
    },
    onShareAppMessage: function () {
        return {
            title: '精选案例',
            desc: '免费全屋设计，抢先领取',
            path: 'pages/store/list/list?shareid=2',
        }
        
    },
   searchInput(e){
      this.setData({input_value:e.detail.value})
   },
   search(){
    let that = this;
       wx.request({
          url: app.api.user_search,
          method: 'POST',
          dataType: 'json',
          data : {name:that.data.input_value},
          header: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: ( res )=>{
            console.log(res)
             if(res.statusCode == 200){
              console.log(res);
              if(res.data.status == 'success'){
                if(res.data.list!='' && typeof res.data.list!='undefined' ){
                  that.setData({datalist:res.data.list,nomore:false})
                } 
              }else{
                  that.setData({nomore:true})
                }
             }
          },
          fail:function(res){
              console.log(res);
          }
      });
   },
    getSearch(e){
      let{id,name} = e.currentTarget.dataset || e.target.dataset;
        // console.log(e.currentTarget.dataset.id);
        wx.navigateTo({
           url:"../firststep/firststep?id="+id+'&name='+name,
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
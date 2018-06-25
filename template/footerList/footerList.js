
var app=getApp();

export const func = {
   navigateTo : function(e){

      switch(parseInt(e.currentTarget.dataset.number)){
         case 1 : 
            app.footerStateChange('global',0);
            wx.redirectTo({
               url: '/pages/index/list/list'
            });
            break;
         case 2 :
            // app.footerStateChange('global',1);
            // wx.redirectTo({
            //    url: '/pages/citydesign/list/list'
            // });
            app.Toast('敬请期待','none');
            break;
         case 3 : 
            app.footerStateChange('global',2);
            let islogin_url=app.api.is_login,go_url;
            wx.request({
               url: islogin_url,
               method: 'POST',
               dataType: 'json',
               data : {openid:app.globalData.openid},
               header: {
                   'Content-Type': 'application/x-www-form-urlencoded'
               },
               success: ( res )=>{
                  if(res.statusCode == 200){
                    if(typeof res.data.list !='undefined'&&parseInt(res.data.list.login) == 1){
                        if(parseInt(res.data.list.identify) == 2){
                           go_url = '/pages/user/index/index';
                        } else{
                           go_url = '/pages/design/index/index';
                        }
                    } else{
                           go_url = '/pages/login/login';
                     }
                      wx.redirectTo({
                        url: go_url
                     });
                  }
               },
               fail:function(res){
                   console.log(res);
               }
            });
           
            break;
         // case 4 : 
         //    app.footerStateChange('global',3);
         //    wx.navigateTo({
         //       url: '/pages/yuyue/yuyue'
         //    });
         //    break;
         default : break;
      }
   }
}




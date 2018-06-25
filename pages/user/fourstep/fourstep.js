var app = getApp(), cdn='http://img1.homekoocdn.com/html/weixin/hyuser_sys/tenThousand_miniprogram/images/';
var num = 0,n=0,u=0,len= 0,id,openid,status,aid,prew=false;
//菜单栏状态
let pageConfig = {
    data: {
        Mb:false,
        Mbphoto:false,
        mbInfo:false,
        bottomShow:false,
        nocontent:false,
        addimg:cdn+'icon-add.jpg',
        editimg:cdn+'icon-edit.png',
        contenttab:[
          {text:'户型', type:'hu',img:cdn+'icon-hu.jpg',status:false, },{text:'客厅', type:'ke',img:cdn+'icon-ke.jpg',status:false, },
          {text:'餐厅', type:'can',img:cdn+'icon-can.jpg',status:false, },{text:'卧房', type:'wo',img:cdn+'icon-wo.jpg',status:false, },
          {text:'儿童房',type:'er',img:cdn+'icon-er.jpg',status:false, },{text:'书房', type:'shu',img:cdn+'icon-shu.jpg',status:false, },
          {text:'厨房', type:'chu',img:cdn+'icon-chu.jpg',status:false, },{text:'阳台', type:'yang',img:cdn+'icon-yang.jpg',status:false, },
          {text:'过道', type:'guo',img:cdn+'icon-guo.jpg',status:false, },{text:'其他', type:'qi',img:cdn+'icon-qi.jpg',status:false, },
        ],
        placeholder:'分享你家卧房的装修小秘密或装修过程发生的故事',
        title_text:'',
        textarea:'',
        type:'',
        num:0,
        content:[{style:'hu',img:[],text:'',status:false,},{style:'ke',img:[],text:'',status:false,},
                {style:'can',img:[],text:'',status:false,},{style:'wo',img:[],text:'',status:false,},
                {style:'er',img:[],text:'',status:false,},{style:'shu',img:[],text:'',status:false,},
                {style:'chu',img:[],text:'',status:false,},{style:'yang',img:[],text:'',status:false,},
                {style:'guo',img:[],text:'',status:false,},{style:'qi',img:[],text:'',status:false,},],
        btnState:false,
        imgPrew:[],
        update:false,
        firstshow:false,
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
        typeof wx.getStorageSync('openid')!='undefined' ? openid = wx.getStorageSync('openid'):openid = app.globalData.openid;
        status = options.status;
        console.log(options.status);
        aid = options.aid;
        if((typeof options.status!='undefined'&&options.status=='add') || options.stc=='back'){
         console.log(options);
            wx.showToast({
              title: 'loading...',
              icon: 'loading',
              // duration: 2000
            })
             wx.request({
                url: app.api.check_edit,
                method: 'POST',
                dataType: 'json',
                data : {openid:openid,source_type:2},
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: ( res )=>{
                    if(res.data.status == 'success'){
                       wx.showToast();
                      var btnArr1 = [];
                      var data = res.data.four;
                      console.log(typeof data !='undefined');
                      if(typeof data !='undefined' && data!=''&& data.length>0){
                          data.map((x,y)=>{
                            that.data.content.map((v,k)=>{
                              if(v.style == x.style){
                                  v.img.push(x.pic);
                                  if(x.text.indexOf('&amp;hc')>=0){
                                     v.text = x.text.split('&amp;hc').join('\n');
                                  } else{
                                     v.text = x.text;
                                   }
                                  v.status=true;
                                  btnArr1.push(1);
                                  that.data.contenttab[k].status=true;
                              }

                            })
                          })
                          wx.hideToast();
                          if(btnArr1.length>0){
                              prew = true;
                              that.data.btnState=true;
                             } else{
                              prew = false;
                              that.data.btnState=false;
                             }
                          that.setData({
                            content:that.data.content,
                            contenttab:that.data.contenttab,
                            btnState:that.data.btnState,
                        });
                      } 
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
        if(options.status == 'edit'){
          wx.showToast({
              title: 'loading...',
              icon: 'loading',
              // duration: 2000
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
              var btnArr = [];
                if(res.data.status == 'success'){
                  var data = res.data.four;
                    data.map((x,y)=>{
                    that.data.content.map((v,k)=>{
                      if(v.style == x.style){
                          v.img.push(x.pic);
                         if(x.text.indexOf('&amp;hc')>=0){
                             v.text = x.text.split('&amp;hc').join('\n');
                          } else{
                             v.text = x.text;
                           }
                          v.status=true;
                          btnArr.push(1);
                          that.data.contenttab[k].status=true;
                      }

                    })
                  })
                   // wx.hideToast();
                   if(btnArr.length>0){
                    prew = true;
                    that.data.btnState=true;
                   } else{
                    prew = false;
                    that.data.btnState=false;
                   }
                  that.setData({
                        content:that.data.content,
                        contenttab:that.data.contenttab,
                        btnState:that.data.btnState,
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
    back(){
      console.log('3bu');
      wx.reLaunch({
          url: "../thirdstep/thirdstep?stc=back&aid="+aid+"&status="+status,
        })
    },
    backT(){
       let that = this;
       that.setData({nocontent:false,Mb:false});
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
    // onShareAppMessage: function () {
    //     return {
    //         title: '精选案例',
    //         desc: '免费全屋设计，抢先领取',
    //         path: 'pages/store/list/list?shareid=2',
    //     }
        
    // },
    checkArray:(res)=>{
      if(res[0]==''&&res.length==1){
          res=[];
      }
      return res;
    },
    edit(e){
      let {index} = e.currentTarget.dataset || e.target.dataset,that=this,userData = wx.getStorageSync('userData'),content;
       that.data.imgPrew=that.data.content[index].img;
       that.data.draft = that.data.content[index].text;
       that.data.textarea = that.data.content[index].text;
      this.setData({
        title_text:that.data.contenttab[index].text,
        placeholder:'分享你家'+that.data.contenttab[index].text+'的装修小秘密或装修过程发生的故事',
        nocontent:true,
        type:that.data.contenttab[index].type,
        num:index,
        draft:that.data.draft,
        textarea:that.data.textarea,
        imgPrew: that.data.imgPrew
      });

    },
    save(e){
      let that = this,{style,num} = e.currentTarget.dataset || e.target.dataset,id,l=0,n=0,pic;
      // console.log(that.data.content);
      if(that.data.draft == ''||that.data.content[num].img.length <=0){
        that.setData({mbInfo:true,textareashow:false,});
        return false;
      }
      that.data.content[num].text = that.data.draft;
      that.data.contenttab[num].status = true;
      that.data.content[num].status = true;
      that.setData({content:that.data.content});
      wx.showLoading({
        title: '提交中...',
      })
       wx.request({
          url: app.api.user_delete,
          method: 'POST',
          dataType: 'json',
          data : {id:aid,openid:openid,style:that.data.content[num].style},
          header: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: ( res )=>{
             if(res.statusCode == 200){
              if(res.data.state == 'success'){
                  that.data.content[num].img.map((x,y)=>{
                    n++;
                    if(!~x.indexOf('img1.homekoocdn.com') ){
                      that.uploadImg(x,that.data.content[num].style,that.data.content[num].text,status,aid,(res)=>{
                          l++;
                          if(u <= 0){
                            if(l>=n){
                               wx.hideLoading();
                              wx.showToast({
                                title: '成功',
                                icon: 'success',
                                duration: 1000
                              })
                              setTimeout(function(){
                                that.setData({nocontent:false,content:that.data.content,contenttab:that.data.contenttab,btnState:true});
                              },1000);
                            }
                          } else{
                            console.log((l+u));
                            console.log(n);
                            if((l+u) >=n){
                                 wx.hideLoading();
                                  wx.showToast({
                                    title: '成功',
                                    icon: 'success',
                                    duration: 1000
                                  })
                                  setTimeout(function(){
                                    that.setData({nocontent:false,content:that.data.content,contenttab:that.data.contenttab,btnState:true});
                                  },1000);
                                }
                          }
                      });
                    } else{
                      wx.request({
                        url: app.api.upload,
                        method: 'POST',
                        dataType: 'json',
                        data : {id:aid,openid:openid,style:that.data.content[num].style,pic:x,text:that.data.content[num].text.split('\n').join('&hc'),step:4},
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: ( res )=>{
                          var data = res.data;
                          if(res.data.state == 'success'){
                            u++;
                            if(l <= 0){
                              if(u>=n){
                                wx.hideLoading();
                                wx.showToast({
                                  title: '成功',
                                  icon: 'success',
                                  duration: 1000
                                })
                                setTimeout(function(){
                                  that.setData({nocontent:false,content:that.data.content,contenttab:that.data.contenttab,btnState:true});
                                },1000);
                              }
                            } 

                          }
                        },
                        fail(){
                           wx.showModal({
                            title: '提示',
                            content: '网络错误，请稍后再试！',
                            showCancel:false,
                            success: function(res) {
                              
                            }
                          })
                        },
                      })
                    }
               
                  })
              }
            }
          }
        })
    },
    mbShow(e){
      let that = this,{type,num} = e.currentTarget.dataset||e.target.dataset;
      // console.log(num);
      console.log(that.data.content[num])
      that.data.content[num].text = that.data.draft;
      if(type =='cancel'){
        if(that.data.bottomShow){
           that.setData({bottomShow:false});
            setTimeout(function(){
              that.setData({Mb:false,textareashow:true,content:that.data.content,textarea:that.data.draft,});
            },499);
        }
      } 
      else if(type == 'no'){
          that.setData({Mb:false,bottomShow:false,Mbphoto:false,textareashow:true,content:that.data.content,textarea:that.data.draft,firstshow:false,});
      } else if(type == 'yes'){
          that.setData({Mb:true,bottomShow:true,Mbphoto:false,textareashow:false,});
      } else if(type == 'Mbphoto'){
          if(that.data.imgPrew.length >=5){
            wx.showModal({
              title: '提示',
              content: '图片上限了',
              showCancel:false,
            })
          } else{
            if(that.data.firstshow){
              that.setData({Mb:true,bottomShow:true,Mbphoto:false,textareashow:false,});
            } else{
             that.setData({Mb:true,bottomShow:false,Mbphoto:true,firstshow:true,textareashow:false,});
            }
          }
      }else if(type == 'mbInfo'){
          that.setData({mbInfo:false,textareashow:true,content:that.data.content,textarea:that.data.draft,});
        }
    },
    write(e){
      this.setData({draft:e.detail.value,cursorIndex:e.detail.cursor,})
    },
    Btn(e){
      let {type} = e.currentTarget.dataset || e.target.dataset,that = this;
      if(that.data.btnState){
        // console.log(123);
        if(type == 'view'){
          wx.navigateTo({
             url:"../../../pages/user/preview/preview?aid="+aid+"&status="+status,
             //接口调用成功的回调方法
             fuccess:function(){},
             //接口调用失败的回调方法
             fail:function(){},
             //接口调用无论成功或者失败的回调方法
             complete:function(){}
           })
          return false;
        }
        if(type == 'send'){
            wx.request({
              url: app.api.end_edit,
              method: 'POST',
              dataType: 'json',
              data : {id:aid,openid:openid,state:'end'},
              header: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: ( res )=>{
                console.log(res);
                 if(res.statusCode == 200){
                  if(res.data.status == 'success'){
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 1000
                      })
                    setTimeout(function(){
                       wx.reLaunch({
                        url: "../../../pages/user/index/index",
                      })
                    },1000);
                  }
                }
              },
              fail(){
                 wx.showModal({
                  title: '提示',
                  content: '提交失败，请稍后重试！',
                  showCancel:false,
                })
              },
            })
        }
      } else{
          wx.showModal({
            title: '提示',
            content: '你还没填写内容',
            showCancel:false,
          })
      }
    },
    detele(e){
      let that= this,{id,num}=e.currentTarget.dataset||e.target.dataset;
      that.data.content[num].img.splice(id,1);
      that.setData({
        content:that.data.content,
        imgPrew: that.data.content[num].img,
      })
    },
    uploadImg(img,filename,text,status,id,func){
      let that = this;
       wx.uploadFile({
          url: app.api.upload, //仅为示例，非真实的接口地址
          filePath: img,
          name: 'file',
          formData:{
            'style': filename,
             id:id,
             text:text,
             status:status,
          },
          success: function(res){
            var data = res.data;
            console.log(res);
           typeof func!='undefined'?func(res):null;
          },
          fail(res){
             console.log(res);
           },
        })
    },
    chooseImg(e){
      let{type,style,num} = e.currentTarget.dataset || e.target.dataset, that = this;
      wx.chooseImage({
        count: 5, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          res.tempFilePaths.map((x,y)=>{
            that.data.content[num].img.push(x);
          })
          that.data.content[num].text = that.data.draft;
          that.setData({
            content:that.data.content,
            imgPrew: that.data.content[num].img,
            update:true,
          });
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
}

pageConfig.data = Object.assign({},pageConfig.data,app.globalData.store)
let nextConfig = Object.assign({},pageConfig);
Page(nextConfig);
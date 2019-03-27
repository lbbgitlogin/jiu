const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    check: "",
    url: "/pages/views/index/index",
    active: ""
  },
  handlemove: function() {},
  bindchange_checkbox: function(e) {
    console.log(e)
    let _this = this
    var value = e.detail.value;
    var act = e.target.dataset.act
    let attr = value.length > 0 ? true : false
    let obj = {}
    obj[act] = attr
    this.setData(obj, function() {
      _this.checkAll()
    })

  },
  checkAll() {
    if (this.data.a == 1 && this.data.b == 1) {
      this.setData({
        check: 'getUserInfo',
        active: "active"
      })
    } else {
      this.setData({
        check: '',
        active: ""
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let url = options.url || ''
    if(options.act==1){
      // 需要转义的
      url = decodeURIComponent(url)
    }
    this.setData({
      url
    });
  },
  //分享
  onShareAppMessage: function () {
    return app.shareApp()
  },
  showToast(e) {
    wx.navigateTo({
      url: '../txt/txt?act=' + e.target.dataset.act,
    })
  },
  btnStart: function() {
    if (this.data.check == "") {
      this.selectComponent('#toast').show("../../assets/images/authorization-prompt.png")
    }
  },
  getUserInfo(e) {
    this.getUser();
  },
  /**
   * 获取用户信息
   */
  getUser: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: userInfo => {
              app.userInfo = res.result
              // 登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  wx.request({
                    url: app.Config.domainName + app.Config.login,
                    data: {
                      code: res.code
                    },
                    header: {
                      "content-type": "application/json"
                    },
                    success: res => {
                      app.loginInfo = res.data.result;
                      if (res.data.errcode == 0) {
                        wx.setStorageSync('SessionKey', res.data.result.SessionKey)
                        wx.setStorageSync('OpenID', res.data.result.OpenID)
                        wx.request({
                          url: app.Config.domainName + app.Config.saveUserInfo,
                          data: {
                            NickName: userInfo.userInfo.nickName,
                            HeadImage: userInfo.userInfo.avatarUrl,
                            SessionKey: app.loginInfo.SessionKey,
                            Sex: userInfo.userInfo.gender == 0 ? 2 : userInfo.userInfo.gender
                          },
                          header: {
                            "content-type": "application/json"
                          },
                          success: res => {
                             
                            if (res.data.errcode == 0) {
                              wx.redirectTo({
                                url: this.data.url
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }
});
var app = getApp();
import {
  getUser,
  savePhone
} from '../../common/user.js'
Page({
  data: {
    item: null,
    getPhoneNumber: 'getPhoneNumber',
  },
  /** 生命周期函数--监听页面加载 **/
  onLoad: function(options) {
    this.setData({
      domainName: app.Config.imgPath,
      item: JSON.parse(options.item)
    })
  },
  /** 生命周期函数--监听页面初次渲染完成 **/
  onReady: function() {},

  /** 生命周期函数--监听页面显示 **/
  onShow: function() {
    getUser().then(res => {
      if (res.result.Phone) {
        this.setData({
          getPhoneNumber: ''
        })
      }
    })
  },
  //获取手机号授权
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      savePhone({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then(res => {
        let phoneNumberInfo = res.result;
        app.userInfo.Phone = phoneNumberInfo.phoneNumber;
        this.setData({
          getPhoneNumber: ''
        },()=>{
          this.select()
        })
      })
    }
  },
  select: function(e) {
    if (!this.data.getPhoneNumber) {
      this.setData({
        index: 1
      })
      this.selectComponent('#toast').show()
    }
  },
  send: function(e) {
    this.selectComponent('#toast').hide()
    if (this.data.item.IsRetention == 2) {
      this.selectComponent('#toast').hide()
      wx.navigateTo({
        url: '../address/address?id=' + this.data.item.ID,
      })
      return false;
    }
    app.Ajax.get('/Barhandler.ashx?method=PrizeExchange', {
      PrizeID: this.data.item.ID,
      Count: 1
    }).then(res => {
      if (res.result && res.result.Exchange) {
        this.setData({
          index: 2
        })
      } else {
        this.setData({
          index: 3
        })
        this.selectComponent('#toast').show()
        // app.toast(res.result && res.result.Info);
      }
    })
  },
  go() {
    wx.navigateTo({
      url: '../reward/reward',
    })
  },
  /** 用户点击右上角分享 **/
  onShareAppMessage: function(e) {
    return app.shareApp()
  }
});
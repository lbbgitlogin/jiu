var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: null,
    switch: false,
    recommendList: [],
    domainName: ""
  },
  onLoad: function(option) {
    this.getAlcoholList();
    this.setData({
      domainName: app.Config.domainName
    });
  },
  //获取轶事列表
  getAlcoholList: function(callBack) {
    let obj = {
      SessionKey: app.loginInfo.SessionKey,
      p: 1,
      PageSize: 100,
      Type: this.data.current
    };
    this.data.current == null ? delete obj.Type : "";
    wx.request({
      url: app.Config.domainName + app.Config.getAlcoholList,
      data: obj,
      header: {
        "content-type": "application/json"
      },
      success: res => {
        if (res.data.errcode == 0) {
          let data = res.data.result;
          this.setData({
            recommendList: data.List
          });
        }
      }
    });
  },
  recommendSwitch: function(e) {
    this.setData({
      current: e.currentTarget.dataset.current
    });
    this.getAlcoholList();
  },
  switch: function() {
    this.setData({
      switch: !this.data.switch,
      current: null
    });
    this.getAlcoholList();
  },
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  },
  recommendTo: function(e) {
    wx.navigateTo({
      url: "/pages/views/cocktaildetail/cocktaildetail?act=1&type=1&id=" +
        e.currentTarget.dataset.item.ID
    });
  }
});
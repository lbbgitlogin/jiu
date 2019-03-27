var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: null,
    recommendList: [],
    domainName: ""
  },
  onLoad: function(option) {
    this.getAlcoholList();
    this.setData({
      domainName: app.Config.imgPath
    });
  },
  imageLoad(ev) {
    let i = ev.target.dataset.index
    let _this = this
    wx.createSelectorQuery().select('#box').boundingClientRect(function (res) {
      let recommendList = _this.data.recommendList
      recommendList[i].style = app.getImgStyle(res,ev)
      _this.setData({
        recommendList
      })
    }).exec()
  },
  //获取list
  getAlcoholList: function(callBack) {
    app.Ajax.get('/Barhandler.ashx?method=GetAnecdoteList',{p:1,PageSize:100}).then(res=>{
      console.log(res)
      this.setData({
        recommendList: res.result.List
      });
    })
  },
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  },
  recommendTo: function(e) {
    wx.navigateTo({
      url: '../rewarddetail/rewarddetail?item=' + JSON.stringify(e.currentTarget.dataset.item)  
    })
  }
});
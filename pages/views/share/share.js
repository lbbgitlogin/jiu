// pages/views/share/share.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let option = {
      head: 'https://wx.qlogo.cn/mmopen/vi_32/ThibXfYQRgbCfBqSVGrZIvCFV30YkoGVjslibmKrf6OI6GpvLEVzD9z1JjQOf3UUyzlW5fWwLCgftApqq1TuvzEw/132',
      src: 'https://bacardi.h5-x.com/wxapp/Upload/Ad/d60ede37-baa8-4cbe-a629-aa86ab01d644.jpg',
      title: '王的二次陈酿',
      time: '2018.10.12',
      name: 'Blend'
    }
    console.log(options)
    this.setData({
      options,
      head: decodeURIComponent(options.head) || option.head,
      src: decodeURIComponent(options.src) || option.src,
      title: options.title || option.title,
      time: options.time || option.time,
      name: options.name || option.name,
    })
  },
  imageLoad(ev){
    let _this = this
    wx.createSelectorQuery().select('#box').boundingClientRect(function (res) {
      console.log(res)
      console.log(ev)
      _this.setData({
        style: app.getImgStyle(res, ev)
      })
    }).exec()
  },
  purchaseTo() {
    let options = this.data.options
    // wx.navigateTo({
    //   url: '/pages/views/gallery/gallery?id=' + options.id + '&title=' + options.title
    // })
    wx.redirectTo({
      url: '/pages/views/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // 分享
  onShareAppMessage() {
    return app.shareApp()
  }
})
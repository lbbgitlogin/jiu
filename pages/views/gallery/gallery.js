var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shade: false,
    galleryList: [],
    count: 0, //记录当前索引
    direction: null,
    openSetting: "",
    domainName: ""
  },
  init() {
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        let y = 115 + 60 + 25 + 70
        let bili = res.windowWidth / 750 //当前比例
        let innerH = bili * y // 其余的实际高度
        let _h = res.windowHeight - innerH //盒子的  总高度-其他高度
        _this.setData({
          h: 'height:' + _h + 'px'
        })
      }
    })
  },
  imageLoad(ev) {
    let i = ev.target.dataset.index
    let _this = this
    wx.createSelectorQuery().select('#box').boundingClientRect(function (res) {
      let galleryList = _this.data.galleryList
      galleryList[i].style = app.getImgStyle(res, ev)
      _this.setData({
        galleryList
      })
    }).exec()
  },
  // 轮播完成回调中取下标
  bindanimationfinish(e) {
    let count = e.detail.current
    this.setData({
      count
    })
  },
  go(e) {
    let act = e.currentTarget.dataset.act
    let count = this.data.count
    if (act == 1) {
      count--
      count = count < 0 ? 0 : count
    } else {
      count++
      count = count > this.data.galleryList.length - 1 ? this.data.galleryList.length - 1 : count
    }
    this.setData({
      count
    });
  },
  closeShade: function() {
    this.setData({
      shade: false
    });
  },
  openShade: function(e) {
    this.setData({
      shade: true,
      count: e.currentTarget.dataset.index
    });
  },
  onLoad: function(options) {
    this.init();
    this.getUser()
    this.setData({
      options,
      id: options.id,
      title: options.title || '',
      domainName: app.Config.domainName
    })
    this.getList(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      openSetting: app.openSetting
    });
  },
  preserve: function() {
    var imgSrc = "http://ftp.h5-x.com/joly/images/2.jpg";
    var $this = this;
    wx.downloadFile({
      url: imgSrc,
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(data) {
            wx.showToast({
              title: "已保存到系统相册"
            })
            app.openSetting = "";
            $this.setData({
              openSetting: ""
            });
          },
          fail: function(err) {
            if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              app.openSetting = "openSetting";
              $this.setData({
                openSetting: "openSetting"
              });
            }
          }
        });
      }
    });
  },

  getList(options) {
    app.Ajax.post('/Handler.ashx?method=GetCoursePicture',{
      PageSize: 500,
      CourseID: options.id || 1
    }).then(res=>{
      if (res.errcode == 0) {
        console.log(res)
        let data = res.result;
        this.setData({
          galleryList: data.List,
        })
      }
    })
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          wx.redirectTo({
            url: app.param()
          });
        } else {
          //已经授权
        }
      }
    });
  },
  onReady: function() {},
  getUser() {
    wx.getUserInfo({
      success: res => {
        this.setData({
          user: res.userInfo
        })
      }
    })
  },
  showGule() {
    this.selectComponent('#gule').show()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // 如果没有点击。说明分享的不是图片。。就不管
    if (!this.data.shade) {
      return app.shareApp()
    }
    let id = this.data.id
    let src = this.data.domainName + this.data.galleryList[this.data.count].Image
    // let src = this.data.galleryList[this.data.count].ID
    let title = this.data.title
    let d = new Date()
    let time = `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`
    let head = this.data.user.avatarUrl
    let name = this.data.user.nickName
    let path = `/pages/views/share/share?id=${id}&head=${encodeURIComponent(head)}&src=${encodeURIComponent(src)}&title=${title}&time=${time}&name=${name}`
    console.log(path)
    return {
      title,
      imageUrl: src,
      path
    }
  }
});
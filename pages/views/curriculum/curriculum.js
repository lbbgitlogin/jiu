var Interval;
var app = getApp();
import {
  getUser,
  savePhone
} from '../../common/user.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pictureHeight: 460,
    direction: 0,
    iphoneX: app.Os.iphoneX,
    lastX: 0,
    lastY: 0,
    direction: 0,
    detailInfo: {},
    getPhoneNumber: 'getPhoneNumber',
    domainName: "",
    openSetting: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.writePhotosAlbum"]) {
          this.openSetting = "openSetting";
          this.setData({
            openSetting: "openSetting"
          })
          wx.saveImageToPhotosAlbum({
            filePath: "fdsfdfs",
            success: function(data) {},
            fail: (err) => {
              if (err.errMsg == "saveImageToPhotosAlbum:fail file not found") {
                this.openSetting = "";
                this.setData({
                  openSetting: ""
                })
              }
            }
          });
        }
      }
    })
    this.setData({
      options,
      domainName: app.Config.domainName
    });
    wx.request({
      url: app.Config.domainName + app.Config.getCourseInfo,
      data: {
        SessionKey: app.loginInfo.SessionKey,
        id: options.id
      },
      header: {
        "content-type": "application/json"
      },
      success: res => {
        if (res.data.errcode == 0) {
          let data = res.data.result;
          let YTD = data.Date.split(" ")[0].split("/");
          let detailInfo = {
            time: `${YTD[0]} ${YTD[1]}.${YTD[2]} ${data.StartTime}-${data.EndTime}`,
            Banner: app.Config.domainName + data.Banner,
            title: data.Title,
            alcohol: data.Alcohol,
            Link: data.Link,
            Intr: data.Intr,
            Cover: app.Config.domainName + data.Cover,
            Difficult: data.Difficult,
            Info: data.Info,
            QRCode: data.QRCode,
            ID: data.ID
          };
          console.log(data.Info)
          this.setData({
            detailInfo: detailInfo
          });
        }
      }
    });
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onPageScroll: function(e) {
    if (e.scrollTop >= 50) {
      this.setData({
        pictureHeight: 330
      });
    } else if (e.scrollTop <= 0) {
      this.setData({
        pictureHeight: 460
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      openSetting: app.openSetting
    });
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
        }, () => {
          this.emption()
        })
      })
    }
  },
  emption: function() {
    if (this.data.getPhoneNumber) {
        return false;
    }
    let _this = this
    wx.request({
      url: app.Config.domainName + app.Config.addCourseSign,
      data: {
        SessionKey: app.loginInfo.SessionKey,
        CourseID: _this.data.detailInfo.ID
      },
      header: {
        "content-type": "application/json"
      },
      success: res => {
        console.log('未知实验室跳转minapp')
        wx.navigateToMiniProgram({
          appId: "wx103cfed43193511a", // 要跳转的小程序的appid
          path: _this.data.detailInfo.Link,
          success(res) {
            console.log('跳转成功')
          }
        });
      }
    });
  },
  preserve: function(e) {
    console.log(e.currentTarget.dataset.src)
    var imgSrc = e.currentTarget.dataset.src;
    var $this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.writePhotosAlbum"]) {
          wx.downloadFile({
            url: imgSrc,
            success: function(res) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(data) {
                  wx.showToast({
                    title: "已保存到系统相册"
                  });
                  app.openSetting = "";
                  $this.setData({
                    openSetting: ""
                  });
                },
                fail: function(err) {}
              });
            }
          });
        } else {
          app.openSetting = "openSetting";
          $this.setData({
            openSetting: "openSetting"
          });
        }
      }
    })

  }
});
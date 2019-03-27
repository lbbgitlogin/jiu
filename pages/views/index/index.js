//获取应用实例
var app = getApp();
import {
  getUser,
  savePhone
} from '../../common/user.js'
Page({
  data: {
    userInfo: {},
    showmember: 0,
    watch: 0,
    w: null,
    current: null,
    tabList: [{
        name: "探索者资料",
        index: 1,
        icon: "icon-gerenxinxi",
        link: "/pages/views/member/member"
      },
      {
        name: "味知积分奖励",
        index: 3,
        icon: "icon-haoqizhishu",
        link: "/pages/views/reward/reward"
      },
      {
        name: "味知积分兑换",
        index: 2,
        icon: "icon-haoqixin",
        link: "/pages/views/integral/integral"
      },
      {
        name: "实验课管理",
        index: 4,
        icon: "icon-baoming",
        link: "/pages/views/curriculumadmin/curriculumadmin?act=2"
      }
    ],
    lastX: 0, //滑动开始x轴位置
    lastY: 0, //滑动开始y轴位置
    swiperList: [],
    count: 0, //记录当前索引
    direction: null,
    promptShow: false,
    where: "../../assets/images/where.png",
    getPhoneNumber: "getPhoneNumber"
  },
  init() {
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        let y = (155 + 15) * 2 + 66 + 15 + 60 * 2
        let bili = res.windowWidth / 750 //当前比例
        let innerH = bili * y // 其余的实际高度
        let _h = res.windowHeight - innerH //盒子的  总高度-其他高度
        _this.setData({
          h: _h
        })
      }
    })
  },
  imageLoad(ev) {
    let i = ev.target.dataset.index
    let _height = ev.detail.height
    let _width = ev.detail.width
    let bili = _height / _width
    let _this = this
    wx.createSelectorQuery().select('#box').boundingClientRect(function(res) {
      let _w = (res.height) / bili
      let _style = ''
      // 如果都不能铺满屏幕的话
      if (_w < res.width) {
        let _h = res.width * bili
        _style = `width:100%;height:${_h}px`
      } else {
        _style = `width:${parseInt(_w)}px;`
      }
      let swiperList = _this.data.swiperList
      swiperList[i].style = _style
      _this.setData({
        swiperList
      })
    }).exec()
  },
  enterMember: function() {
    this.setData({
      showmember: "active",
      current: null
    });
  },
  whereShout: function() {
    if (app.f) {
      wx.navigateTo({
        url: '../where/where',
      })
    } else {
      this.selectComponent('#toast').show("../../assets/images/where.png")
    }
  },
  hidememebr: function() {
    this.setData({
      showmember: ""
    });
  },
  clickWatch: function() {
    this.setData({
      watch: 1
    });
  },
  goLabPage: function(e) {
    wx.navigateTo({
      url: "/pages/views/laboratory/laboratory"
    });
  },
  navTo() {
    console.log('跳转minapp')
    wx.navigateToMiniProgram({
      appId: 'wxcb91197da65aa9cb',
      path: 'pages/shop/shop?shopId=1000082661',
      success(res) {
        console.log('跳转成功')
      }
    })
  },
  selectItem: function(e) {
    let ident = e.currentTarget.dataset.current
    this.setData({
      current: ident
    });
    if (ident == 0 && this.data.getPhoneNumber) {
      return false;
    }
    if ((ident == 1 && !app.f) || (ident == 2 && !app.f)) {
      this.selectComponent('#toast').show("../../assets/images/await1.png")
      return false
    }
    wx.navigateTo({
      url: this.data.tabList[ident].link
    });
  },
  swiper_item: function(e) {
    if (e.currentTarget.dataset.link) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.userInfo && app.userInfo.ID) {
      this.setData({
        getPhoneNumber: app.userInfo ? app.userInfo.Phone ? "" : "getPhoneNumber" : "getPhoneNumber",
        userInfo: app.userInfo
      });
      this.checkPhone(app.userInfo);
    } else {
      this.getUserInfo()
    }
  },
  checkPhone(user) {
    if (user) {
      if (!user.Phone) {
        this.selectComponent('#tips').show()
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.init()
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          //未授权
          wx.showModal({
            title: "提示",
            showCancel: false,
            mask: true,
            content: "您还未授权，请先去开启授权！",
            success: function(res) {
              if (res.confirm) {
                var routeList = getCurrentPages();
                wx.redirectTo({
                  url: `/pages/views/condition/condition?url=/${
                    routeList[routeList.length - 1].route
                    }`
                });
              }
            }
          });
        } else {
          //已经授权
          // 登录
          if (!app.loginInfo.SessionKey) {
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
                    if (res.data.errcode == 0) {
                      wx.setStorageSync('SessionKey', res.data.result.SessionKey)
                      wx.setStorageSync('OpenID', res.data.result.OpenID)
                      app.loginInfo = res.data.result;
                      this.getAdList();
                      //已经授权
                      this.getUserInfo();
                    }
                  }
                });
              }
            });
          } else {
            this.getAdList();
            //已经授权
            this.getUserInfo();
          }
        }
      }
    });
  },
  getUserInfo: function() {
    getUser().then(res => {
      if (res.errcode == 1) {
        return false
      }
      console.log('================')
      console.log(res)
      app.userInfo = res.result;
      this.checkPhone(res.result);
      this.setData({
        userInfo: app.userInfo
      });
      if (this.data.userInfo.Phone) {
        this.setData({
          getPhoneNumber: ""
        });
      }
    })
  },
  detailList(list) {
    var swiperList = [];
    for (let index = 0; index < list.length; index++) {
      let classType;
      if (this.data.count == index) {
        classType = "first";
      } else if (this.data.count + 1 == index) {
        classType = "second";
      } else if (this.data.count + 2 == index) {
        classType = "third";
      } else {
        classType = "normal";
      }
      swiperList[index] = {
        src: app.Config.domainName + list[index].Cover,
        class: classType,
        link: list[index].Link
      };
    }
    this.setData({
      swiperList: swiperList
    });
  },
  //获取轮播
  getAdList: function() {
    app.Ajax.post('/Handler.ashx?method=GetAdList').then(res => {
      this.detailList(app.detailList(res.result, 4))
    })
  },
  //获取手机号授权
  getPhoneNumber: function(e) {
    let types = e.currentTarget.dataset.type
    if (e.detail.errMsg != 'getPhoneNumber:ok' && types != 'index') {
      wx.navigateTo({
        url: this.data.tabList[0].link
      });
    } else {
      savePhone({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then(res => {
        let phoneNumberInfo = res.result;
        app.userInfo.Phone = phoneNumberInfo.phoneNumber;
        if (types == 'index') {
          this.getUserInfo()
          this.selectComponent('#tips').hide()
        } else {
          wx.navigateTo({
            url: this.data.tabList[0].link
          });
        }

      })
    }
  },
  //滑动移动事件
  handletouchmove: function(event) {
    var currentX = event.touches[0].pageX; //当前x轴位置
    var currentY = event.touches[0].pageY; //当前y轴位置
    var tx = currentX - this.data.lastX; //滑动的x轴距离
    var ty = currentY - this.data.lastY; //滑动的y轴距离
    // //左右方向滑动
    // if (Math.abs(tx) > Math.abs(ty)) {
    //   if (tx < 0)  //向左滑动
    //   else if (tx > 0)  //向右滑动
    // }
    //上下方向滑动
    if (!(Math.abs(tx) > Math.abs(ty))) {
      //x轴滑动距离不大于y轴滑动距离说明是上下方向滑动
      if (ty < -100) {
        //向上滑动
        this.data.direction = 1;
      } else if (ty > 100) {
        //向下滑动
        this.data.direction = 0;
      }
    }
  },
  //滑动开始事件
  handletouchtart: function(event) {
    this.data.lastX = event.touches[0].pageX; //滑动开始x轴位置
    this.data.lastY = event.touches[0].pageY; //滑动开始y轴位置
    this.data.direction = null; //清空状态
  },
  //滑动结束事件
  handletouchend: function(event) {
    var list = this.data.swiperList; //获取图片列表
    var count = this.data.count; //获取当前显示图片下标
    var first = list[count]; //当前显示的图片
    var second = list[(count + 1) > (list.length - 1) ? Math.abs(list.length - (count + 1)) : (count + 1)]; //当前显示的图片的后面一张
    var third = list[(count + 2) > (list.length - 1) ? Math.abs(list.length - (count + 2)) : (count + 2)]; //当前显示的图片的后面第二张
    if (this.data.direction === 1) {
      //向上滑动 下一张
      var fourth = list[(count + 3) > (list.length - 1) ? Math.abs(list.length - (count + 3)) : (count + 3)]; //当前显示的图片的后面第三张
      if (this.data.count == this.data.swiperList.length - 1) {
        //如果是最后一张
        var second = list[0]; //当前显示的图片的后面一张
        var third = list[1]; //当前显示的图片的后面第二张
      }
      third && (third.class = "second"); //第三个变成第二个
      fourth && (fourth.class = "third"); //第四个变成第三个
      first && (first.class = "pre"); //当前图片离去
      second && (second.class = "first"); //第二个变成第一个
      this.setData({
        swiperList: list,
        count: this.data.count == this.data.swiperList.length - 1 ? 0 : count + 1
      });
    } else if (this.data.direction === 0) {
      //向下滑动 上一张
      var fourth = list[count - 1]; //当前显示的图片的前面一张
      if (this.data.count == 0) {
        //如果是第一张
        var fourth = list[list.length - 1]; //当前显示的图片的前面一张
      }
      third && (third.class = "normal"); //第三个变成第四个
      first && (first.class = "second"); //当前图片变成第二个
      second && (second.class = "third"); //第二个变成第三个
      fourth && (fourth.class = "firstpre"); //当前显示的图片的前面一张变成第一个
      this.setData({
        swiperList: list,
        count: this.data.count == 0 ? list.length - 1 : count - 1
      });
    }
  },
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  },
  handlemove: function(event) {}
});
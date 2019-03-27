const app = getApp();
import {
  getUser,
  savePhone
} from '../../common/user.js'
let data = {
  getAct: 2, // 识别到位置是1  点击出现是2
  swiperList: [],
  array: [],
  region: ["城市"],
  scrollY: true,
  customItem: "全部",
  date: "",
  selectItem: null,
  imgPath: app.Config.imgPath,
  translateY: 170,
  h: 350,
  getPhoneNumber:'getPhoneNumber',
  countIndex: 2,
  galleryList: [],
  count: 0,
  cityIndex: 0
}
Page({
  /**
   * 页面的初始数据
   */
  data,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      cid: app.getNum(app.userInfo.ID || 32, 7),
      url: app.Config.imgPath
    })
    this.getData()
  },
  onShow() {
    this.checkUser()
    getUser().then(res => {
      if (res.result.Phone) {
        this.setData({
          getPhoneNumber: ''
        })
      }
    })
  },
  checkUser() {
    // 获取有没有签到过
    this.getAddress('', '', 1).then(res => {
      this.setData({
        signData: res.result
      })
    })
  },
  imageLoad(ev) {
    let i = ev.target.dataset.index
    let _this = this
    wx.createSelectorQuery().select('#box').boundingClientRect(function(res) {
      let recommendList = _this.data.recommendList
      recommendList[i].style = app.getImgStyle(res, ev)
      _this.setData({
        recommendList
      })
    }).exec()
  },
  getData,
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
        })
        this.selectComponent('#tips-phone').hide()
      })
    }
  },
  sign() {
    if (this.data.getPhoneNumber) {
      this.selectComponent('#tips-phone').show()
      return false;
    }
    wx.getLocation({
      success: res => {
        app.Ajax.get('/Barhandler.ashx?method=BarSignIn', {
          LONG: res.longitude,
          LAT:res.latitude,
          BarID: this.data.selectItem.ID
        }).then(res => {
          this.selectComponent('#toast').hide()
          if (res.result.State) {
            wx.navigateTo({
              url: '../sign/sign',
            })
            app.toast(res.result.msg, 5000)
          } else {
            this.setData({
              strInfo:res.result.msg
            })
            this.selectComponent('#signErr').show()
            // app.toast(res.result.msg, 5000)
          }
        })
      },
      fail(res) {
        this.getAddress('', '')
        console.log(res)
      }
    })
   
  },
  navSign() {
    wx.navigateTo({
      url: '../sign/sign',
    })
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
  recommendTo(e) {
    this.setData({
      galleryList: e.currentTarget.dataset.item.HeadImage ? e.currentTarget.dataset.item.HeadImage.split(',') : [],
      getAct: 2,
      count:0,
      selectItem: e.currentTarget.dataset.item
    }, () => {
      this.selectComponent('#toast').show()
    })
  },
  getAddress(LONG = '', LAT = '', act) {
    return new Promise((resolve, reject) => {
      app.Ajax.get('/Barhandler.ashx?method=SelectBar', {
        LONG,
        LAT
      }).then(res => {
        // 页面进来做请求
        if (act == 1) {
          resolve(res)
          return false;
        }
        //没有识别到位置
        if (!res.result.Nearby) {
          this.selectComponent('#tips').show()
        } else {
          let item = res.result.Bar
          this.setData({
            galleryList: item.HeadImage ? item.HeadImage.split(',') : [],
            getAct: 1,
            selectItem: item
          }, () => {
            this.selectComponent('#toast').show()
          })
        }
      })
    })

  },
  showReg() {
    wx.getLocation({
      success: res => {
        console.log(res)
        this.getAddress(res.longitude, res.latitude)
        // this.getAddress('2324.4547', '1234.765')
        // this.getAddress('121.2743','31.1225')
      },
      fail(res) {
        this.getAddress('', '')
        console.log(res)
      }
    })
  },
  getCourseList,
  bindPickerChange,
  detailList(list) {
    list.map((v, i) => {
      v.imgPath = v.HeadImage ? v.HeadImage.split(',')[0] : v.HeadImage
    })
    return list
  },
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  },
});

//获取city
function getData() {
  app.Ajax.get('/Barhandler.ashx?method=GetBarCity').then(res => {
    this.setData({
      array: res.result
    }, () => {
      this.getCourseList()
    });
  })
}

//获取酒吧列表
function getCourseList() {
  app.Ajax.get('/Barhandler.ashx?method=GetBarList', {
    p: 1,
    PageSize: 100,
    City: this.data.array[this.data.cityIndex].City
  }).then(res => {
    this.setData({
      recommendList: this.detailList(res.result.List)
    })
  })
}

// 城市选择器
function bindPickerChange(e) {
  this.setData({
    cityIndex: e.detail.value,
    translateY: 170,
    countIndex: 0,
  });
  this.getCourseList()
}
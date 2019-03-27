const app = getApp();
let gule = ['活动细则：2018年11月1日至2019年3月31日期间，顾客在百加得味知实验室微信小程序‘去哪喝’酒吧签到页面中每成功签到4家店，即可获得百加得莫吉多鸡尾酒兑换券一张 。', '顾客可在2018年11月1日至2019年3月31日期间，持兑换券至百加得味知实验室微信小程序 “酒吧推荐”中任意门店，即可免费兑换一杯百加得莫吉多鸡尾酒。', '我们建议您在前往指定酒吧兑换前可先致电预约 ，若无空位，酒吧有权拒绝入场。每张兑换券仅限使用一次，每次兑换一杯，兑换后即作废。', '此兑换券不可与其他优惠同时使用，不可退换，遗失不补，不可兑换其他产品，不可兑换或抵扣现金。', '本次活动仅限十八周岁以上人群参加。', '本活动最终解释权在法律法规允许范围内归百加得洋酒贸易有限公司所有。']

import {
  getUser,
  savePhone
} from '../../common/user.js'

let data = {
  gule,
  Max: 4,
  cityList: [],
  barList: [],
  galleryList: [],
  count: 0,
  barIndex:0,
  getPhoneNumber:'getPhoneNumber',
  url: app.Config.domainName,
  index: -1,
  cityIndex: 0,
  barIndex:0
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
    
  },
  onShow(){
    this.init()
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
        })
        this.selectComponent('#tips-phone').hide()
      })
    }
  },
  init(){
    // 获取有没有签到过
    this.getAddress('', '', 1).then(res => {
      this.setData({
        signData: res.result
      })
    })
    this.getList()
  },
  // 轮播完成回调中取下标
  bindanimationfinish(e) {
    let count = e.detail.current
    this.setData({
      count
    })
  },
  // 左右点击切换
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
  showReg() {
    wx.getLocation({
      success: res => {
        console.log(res)
        this.getAddress(res.longitude, res.latitude)
        // this.getAddress('2324.4547', '1234.765')
      },
      fail(res) {
        this.getAddress('', '')
        console.log(res)
      }
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
            selectItem: item
          }, () => {
            this.selectComponent('#toast-inner').show()
          })
        }
      })
    })

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
          LAT: res.latitude,
          BarID: this.data.selectItem.ID
        }).then(res => {
          this.selectComponent('#toast-inner').hide()
          if (res.errcode == 0) {
            app.toast(res.result.msg)
            this.init()
          } else {
            app.toast(res.result.msg)
          }
        })
      },
      fail(res) {
        this.getAddress('', '')
        console.log(res)
      }
    })

    
  },
  getList() {
    app.Ajax.get('/Barhandler.ashx?method=GetCouponList', {
      p: 1,
      PageSize: 100
    }).then(res => {
      this.setData({
        list: res.result.List
      })
    })
  },
  cache: function() {
    this.setData({
      index: 1
    })
  },
  recommendTo(e) {
    this.setData({
      index: 0,
      items: e.currentTarget.dataset.item
    })
    this.getData()
    this.selectComponent('#toast').show()
  },
  send: function(e) {
    app.Ajax.get('/Barhandler.ashx?method=UseCoupon', { ID: this.data.items.ID, BarID: this.data.barList[this.data.barIndex].ID}).then(res=>{
      if(res.errcode==0){
        this.setData({
          index: 2
        })
        this.getList()
      }else{
        app.toast(res.errmsg)
      }
    })
  },
  showGule() {
    this.selectComponent('#gule').show()
  },
  getData,
  getCityBarList,
  bindPickerCityChange,
  bindPickerBarChange,
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  },
});

//获取city
function getData() {
  app.Ajax.get('/Barhandler.ashx?method=GetBarCity').then(res=>{
    this.setData({
      cityIndex: 0,
      cityList: res.result
    }, () => {
      this.getCityBarList()
    });
  })
}

//获取城市内酒吧
function getCityBarList() {
  app.Ajax.get('/Barhandler.ashx?method=GetBarList', { p: 1, PageSize: 100, City: this.data.cityList[this.data.cityIndex].City}).then(res=>{
    this.setData({
      barList: res.result.List,
      barIndex: 0
    })
  })
}

// 城市选择器
function bindPickerCityChange(e) {
  this.setData({
    cityIndex: e.detail.value
  },()=>{
    this.getCityBarList()
  });
}
// 酒吧选择器
function bindPickerBarChange(e){
  this.setData({
    barIndex: e.detail.value,
  });
}
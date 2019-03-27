var app = getApp();
let gender = [{
  code: 1,
  name: "先生"
}, {
  code: 2,
  name: "女士"
}]
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gender,
    genderIndex: 0,
    userInfo: {
      avatarUrl: "",
      nickName: ""
    },
    hoppyList: [],
    hoppyFocusFlag: false,
    nicknameFocus: false,
    phoneFocus: false
  },

  init() {
    let genderIndex = 0;
    if (app.userInfo.Sex == 1) {
      genderIndex = 0;
    } else if (app.userInfo.Sex == 2) {
      genderIndex = 1;
    }
    if (app.userInfo) {
      app.userInfo.Hobby = app.userInfo.Hobby == "null" ? "" : app.userInfo.Hobby
    }
    this.setData({
      userInfo: app.userInfo,
      genderIndex: genderIndex
    }, () => {
      this.getHoppyList()
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userInfo: app.userInfo
    });
    this.getUserInfo();
  },
  // 获取用户信息
  getUserInfo: function() {
    app.Ajax.get('/Handler.ashx?method=GetUserInfo').then(res => {
      app.userInfo = res.result;
      this.init()

    })
  },
  dataClick() {
    this.setData({
      dataFlag: true
    })
  },
  getHoppyList() {
    app.Ajax.post('/BarHandler.ashx?method=GetHobbyList').then(res => {
      let hoppyList = res.result
      if (hoppyList.length) {
        let Hobby = this.data.userInfo.Hobby.split('、')
        if (Hobby.length) {
          hoppyList.map(v => {
            Hobby.map(m => {
              if (v.HobbyName == m) {
                v.check = true
              }
            })
          })
        }
        this.setData({
          hoppyList
        })
      }
    })
  },
  recommendSwitch(e) {
    let hoppyList = this.data.hoppyList
    let _elem = this.check(hoppyList)
    let ident = e.currentTarget.dataset.ident
    if (_elem.i > 2 && !hoppyList[ident].check) {
      return false
    }
    hoppyList[ident].check = hoppyList[ident].check ? hoppyList[ident].check ? false : true : true
    _elem = this.check(hoppyList)
    let Hobby = _elem.arr.join('、')
    let userInfo = this.data.userInfo
    userInfo.Hobby = Hobby
    this.setData({
      userInfo,
      hoppyList
    })
  },
  check(list) {
    let ret = {
      i: 0,
      arr: []
    };
    list.map((v) => {
      if (v.check) {
        ret.i = ret.i + 1
        ret.arr.push(v.HobbyName)
      }
    })
    return ret
  },
  containerTap: function() {
    this.setData({
      phoneFocus: false,
      'switch': false,
      dataFlag: false,
      hoppyFocusFlag: false,
      nicknameFocus: false
    });
  },
  btnSure: function() {
    let data;
    data = {
      SessionKey: app.loginInfo.SessionKey,
      NickName: this.data.userInfo.NickName,
      HeadImage: this.data.userInfo.HeadImage,
      Sex: this.data.userInfo.Sex,
      Phone: this.data.userInfo.Phone,
      Birthday: this.data.userInfo.Birthday,
      Hobby: this.data.userInfo.Hobby
    };
    data.Birthday ? "" : delete data.Birthday;
    app.Ajax.post('/Handler.ashx?method=SaveUserInfo', data).then(res => {
      app.userInfo.NickName = this.data.userInfo.NickName;
      app.userInfo.HeadImage = this.data.userInfo.HeadImage;
      app.userInfo.Sex = this.data.userInfo.Sex;
      app.userInfo.Phone = this.data.userInfo.Phone;
      app.userInfo.Birthday = this.data.userInfo.Birthday;
      app.userInfo.Hobby = this.data.userInfo.Hobby;
      wx.navigateBack({
        delta: 2
      });
    })
  },

  // 上传图片
  avatar: function() {
    var $this = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.Config.domainName + app.Config.uploadImage,
          filePath: tempFilePaths[0],
          name: "file",
          formData: {
            user: "test"
          },
          success(res) {
            let data = JSON.parse(res.data);
            if (data.errcode == 0) {
              $this.data.userInfo.HeadImage = data.result;
              $this.setData({
                userInfo: $this.data.userInfo
              });
              wx.showToast({
                title: "上传成功，点击确认修改保存"
              });
            }
          }
        });
      }
    });
  },
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  },
  //   修改性别
  sexChange: function(e) {
    this.data.userInfo.Sex = this.data.gender[e.detail.value].code;
    this.setData({
      genderIndex: e.detail.value,
      userInfo: this.data.userInfo
    });
  },
  // 出生日期
  bindDateChange: function(e) {
    this.data.userInfo.Birthday = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    });
  },
  //手机号
  phoneKeyInput: function(e) {
    this.data.userInfo.Phone = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    });
  },
  //昵称
  bindKeyInput(e) {
    this.data.userInfo.NickName = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    });
  },
  hoppyFoucus: function(e) {
    let flag = this.data.hoppyFocusFlag ? false : true
    this.setData({
      'switch': flag,
      hoppyFocusFlag: flag
    })
  },
  inputFocus: function(e) {
    this.setData({
      nicknameFocus: false,
      phoneFocus: false,
      hoppyFocusFlag: false,
      [e.currentTarget.dataset.type]: true
    });
  },
  awardTo: function() {
    wx.redirectTo({
      url: "/pages/views/reward/reward"
    });
  }
});
//app.js
import Ajax from "/pages/common/api.js";
import Config from "/pages/common/config.js";
import Os from "/pages/common/os.js";
App({
 
  login(){
    debugger
    wx.login({
  
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.Config.domainName + this.Config.login,
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
              this.loginInfo = res.data.result;
            }
          }
        });
      }
    });
  },
  f: true,
  userInfo: {},
  loginInfo: {},
  Ajax,
  Config: Config,
  Os: Os,
  openSetting: "",
  detailList(arr, n) {
    let _ret = arr
    while (_ret.length < n) {
      _ret = _ret.concat(arr)
    }
    return _ret
  },
  toast(str = '', time = 2000) {
    wx.showToast({
      title: str,
      duration: time,
      icon: 'none'
    })
  },
  shareAjax() {
    this.Ajax.get('/Barhandler.ashx?method=Share')
  },
  shareApp(title = '味知实验室', src = '/pages/assets/images/share.jpg', path = '/pages/views/index/index') {
    this.shareAjax()
    return {
      title,
      imageUrl: src,
      path
    }
  },
  //把从routerList 中取出来的地址带参数 转码发回去
  param(n) {
    var routeList = getCurrentPages();
    let link = routeList[n || routeList.length - 1]
    let data = link.options || {}
    let url = ''
    for (var k in data) {
      let value = data[k] !== undefined ? data[k] : ''
      url += '&' + k + '=' + (value)
    }
    url = url ? url.substring(1) : ''
    let _ret = encodeURIComponent('/' + link.route + '?' + url)
    return `/pages/views/condition/condition?act=1&url=${_ret}`
  },
  // 穿盒子 图片进去 算出图片的合适大小 撑满盒子
  getImgStyle(box, img) {
    let bili = img.detail.width / img.detail.height
    let _style = ''
    // 如果都不能铺满屏幕的话
    let _w = box.height * bili
    let _h = box.width / bili
    if (_w < box.width) {
      _style = `width:100%;height:${_h}px`
    }
    if (_h < box.height) {
      _style = `width:${parseInt(_w)}px;height:100%`
    }
    return _style
  },
  getNum(n, l) {
    let _ret = n + '';
    while (_ret.length < l) {
      _ret = '0' + _ret
    }
    return _ret
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
      }
    })
    this.login()
  }
});
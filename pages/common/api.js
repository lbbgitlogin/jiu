//  封装的ajax
import Config from '../common/config.js'
// const domainName = Config.domainName
const domainName = 'http://bacardi.h5-x.com/test/Api'

function Ajax() {
  this.get = (_url, data = {}) => {
    return new Promise((resolve, reject) => {
      let url = domainName + _url
      let SessionKey = wx.getStorageSync('SessionKey')
      data.SessionKey = SessionKey || ''
      url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
      wx.request({
        url,
        method: 'GET',
        dataType: 'json',
        header: {
          "content-type": "application/json"
        },
        success(response) {
          console.log(response.data)
          resolve(response.data)
        }
      })
    })
  }
  this.post = (url, data = {}) => {
    data = Object.assign(data,{
        SessionKey: wx.getStorageSync('SessionKey') || ''
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: domainName + url,
        method: 'POST',
        data: data,
        dataType: 'json',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success(response) {
          console.log(response.data)
          resolve(response.data)
        }
      })
    })
  }
}


function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}


module.exports = new Ajax();
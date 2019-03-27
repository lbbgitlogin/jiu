const app = getApp();
let data = {
  swiperList: [],
  array: [],
  region: ["城市"],
  customItem: "全部",
  date: "",
  translateY: 170,
  h: 350,
  count: 2,
  cityIndex: 0
}
let aniFlag = true
const styleAdmin = 'transform:scale(1) translateY(0rpx);z-index: 1;opacity:0;'
const _style = 'transition: all 0.5s ease-in;'
let y
// 样式
let styleArr
Page({
  /**
   * 页面的初始数据
   */
  data,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        y = 250
        let bili = res.windowWidth / 750 //当前比例
        let innerH = bili * 504 // 其余的实际高度
        let _h = res.windowHeight - innerH //盒子的  总高度-其他高度
        let mH = 700 * (res.windowWidth / 750) //盒子的规格高度
        let _y = ((_h - mH) / 1) //多出来的高度
        y = y + _y + 30 //_y 就是第三个的高度
        _this.setData({
          h: _h
        })
        styleArr = [
          `background-color:rgba(61,56,52,1);opacity: 0.3;transform:scale(0.75) translateY(${y}rpx);`,
          'background-color:rgba(61,56,52,1);opacity:0.9;z-index: 2;transform:scale(0.85) translateY(180rpx);',
          'background-color:#b18d58;transform:scale(1);opacity: 1;z-index: 10;',
          'background-color:rgba(61,56,52,1);opacity:0.9;z-index: 2;transform:scale(0.85) translateY(-180rpx);',
          `background-color:rgba(61,56,52,1);opacity:0.3;transform:scale(0.75) translateY(-${y}rpx);`
        ]
        _this.getData()
      }
    })
  },
  getData,
  getCourseList,
  detailData,
  bindPickerChange,
  lookPictureTo,
  oldpracticeTo,
  recommendTo,
  scrollItemTo,
  next,
  prev,
  ani,
  ani1,
  handletouchmove,
  handletouchtart,
  handletouchend,
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  }
});


// 下一个
function next() {
  if (!aniFlag) {
    return
  }
  aniFlag = false
  var _count = this.data.count
  this.setData({
    count: _count + 1
  })
  this.ani1(1)
  if (_count == this.data.l * 2) {
    let _this = this
    setTimeout(function() {
      var count = _this.data.l * 1 + 1
      _this.setData({
        count
      })
      _this.ani1(2)
    }, 500)
  }
  setTimeout(function() {
    aniFlag = true
  }, 500)
}

// 上一个
function prev() {
  if (!aniFlag) {
    return
  }
  aniFlag = false
  var _count = this.data.count
  this.setData({
    count: _count - 1
  })
  this.ani1(1)
  if (_count == this.data.l * 1) {
    let _this = this
    setTimeout(function() {
      var count = _this.data.l * 2 - 1
      _this.setData({
        count
      })
      _this.ani1(2)
    }, 500)
  }
  setTimeout(function() {
    aniFlag = true
  }, 500)
}

// 处理为轮播能用的数据格式
function setList(arr) {
  var _arr = arr
  while (_arr.length < 5) {
    _arr = _arr.concat(arr)
  }
  let index = _arr.length
  let _ret = _arr.concat(_arr).concat(_arr)
  return {
    index,
    arr: _ret
  }
}

// 处理数据
function detailData(list) {
  if (!list.length) {
    return false
  }
  // 必须要足够5个以上才能循环得起来。才能流畅
  var _list = setList(list)
  this.setData({
    count: _list.index * 1,
    l: _list.index
  })
  this.ani(_list.arr)
}
// 滚动
function ani1(i) {
  var list = this.data.swiperList
  let count = this.data.count
  list.map(function(v, index) {
    let style = ''
    if (index - 2 == count) {
      style = styleArr[0]
    } else if (index - 1 == count) {
      style = styleArr[1]
    } else if (index == count) {
      style = styleArr[2]
    } else if (index + 1 == count) {
      style = styleArr[3]
    } else if (index + 2 == count) {
      style = styleArr[4]
    } else {
      style = styleAdmin
    }
    if (i == 1) {
      style += _style
    }
    v.style = style
  })
  this.setData({
    swiperList: list
  });
}

// init
function ani(list) {
  let swiperList = [];
  let count = this.data.count
  for (let index = 0; index < list.length; index++) {
    let YTD = list[index].Date.split(" ")[0].split("/");
    let classType = this.data.count == index ? 'current' : '';
    let style = ''
    if (index - 2 == count) {
      style = styleArr[0]
    } else if (index - 1 == count) {
      style = styleArr[1]
    } else if (index == count) {
      style = styleArr[2]
    } else if (index + 1 == count) {
      style = styleArr[3]
    } else if (index + 2 == count) {
      style = styleArr[4]
    } else {
      style = styleAdmin
    }
    swiperList[index] = {
      style,
      title: list[index].Title,
      src: app.Config.domainName + list[index].Cover,
      class: classType,
      link: "/pages/views/curriculum/curriculum?id=" + list[index].ID,
      guest: list[index].Alcohol,
      time: `${YTD[0]} ${YTD[1]}.${YTD[2]} ${list[index].StartTime}-${list[index].EndTime}`
    };
  }
  this.setData({
    swiperList: swiperList
  });
}
//滑动开始事件
function handletouchtart(event) {
  this.data.lastX = event.touches[0].pageX;
  this.data.lastY = event.touches[0].pageY;
  this.data.direction = null;
}
//滑动移动事件
function handletouchmove(event) {
  var currentX = event.touches[0].pageX;
  var currentY = event.touches[0].pageY;
  var tx = currentX - this.data.lastX;
  var ty = currentY - this.data.lastY;
  var text = "";
  //左右方向滑动
  if (Math.abs(tx) > Math.abs(ty)) {
    if (tx < 0) text = "向左滑动";
    else if (tx > 0) text = "向右滑动";
  }
  //上下方向滑动
  else {
    if (ty < -100) {
      //向上滑动
      this.data.direction = 1;
    } else if (ty > 100) {
      //向下滑动
      this.data.direction = 0;
    }
  }
}
//滑动结束事件
function handletouchend(event) {
  if (this.data.direction === 1) {
    //向上滑动 下一张
    this.next();
  } else if (this.data.direction === 0) {
    //向下滑动 上一张
    this.prev();
  }
}



//获取city
function getData() {
  wx.request({
    url: app.Config.domainName + app.Config.getCourseCity,
    data: {
      SessionKey: app.loginInfo.SessionKey
    },
    header: {
      "content-type": "application/json"
    },
    success: res => {
      if (res.data.errcode == 0) {
        this.setData({
          array: res.data.result
        });
        this.getCourseList();
      }
    }
  });
}

//获取课程列表
function getCourseList() {
  wx.request({
    url: app.Config.domainName + app.Config.getCourseList,
    data: {
      SessionKey: app.loginInfo.SessionKey,
      PageSize: 100,
      City: this.data.array[this.data.cityIndex].City
    },
    header: {
      "content-type": "application/json"
    },
    success: res => {
      if (res.data.errcode == 0) {
        this.detailData(res.data.result.List)
      }
    }
  });
}

//查看过往照片
function lookPictureTo() {
  wx.navigateTo({
    url: "/pages/views/curriculumadmin/curriculumadmin?act=2"
  });
}

// 城市选择器
function bindPickerChange(e) {
  this.setData({
    cityIndex: e.detail.value,
    translateY: 170,
    count: 0,
  });
  this.getCourseList()
}

//课程详情
function scrollItemTo(e) {
  wx.navigateTo({
    url: e.currentTarget.dataset.link
  });
}

//未知故事
function oldpracticeTo() {
  wx.navigateTo({
    url: "/pages/views/oldpractice/oldpractice"
  });
}

//鸡尾酒推荐
function recommendTo() {
  wx.navigateTo({
    url: "/pages/views/recommend/recommend"
  });
}
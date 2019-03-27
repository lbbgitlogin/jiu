var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    primary: [],
    current: 1,
    swiperList: [],
    count: 0, //记录当前索引
    lastX: 0, //滑动开始x轴位置
    lastY: 0, //滑动开始y轴位置
    direction: null,
    w: null,
    iphoneX: app.Os.iphoneX,
    underlineLeft: "188px"
  },
  recommendSwitch: function(e) {
    this.setData({
      current: e.currentTarget.dataset.current,
      underlineLeft: e.target.offsetLeft + "px"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  init() {
    let _this = this
    wx.getSystemInfo({
      success: function(res) {
        let y = (100 + 142 - 5)
        let bili = res.windowWidth / 750 //当前比例
        let innerH = bili * y // 其余的实际高度
        let _h = res.windowHeight - innerH //盒子的  总高度-其他高度
        _this.setData({
          h: _h
        })
      }
    })
  },
  onLoad: function(options) {
    this.init()
    //原味轶事
    this.getAnecdoteList(1, data => {
      let list = data.List;
      let primary = [];
      console.log(list);
      for (let index = 0; index < list.length; index++) {
        primary[index] = {
          src: app.Config.domainName + list[index].Cover,
          title: list[index].Title,
          ID: list[index].ID,
          notComingOut: list[index].IsLock,
          name: list[index].Title
        };
      }
      this.setData({
        primary: primary
      });
    });
    //玩味轶事
    this.getAnecdoteList(2, data => {
      let list = app.detailList(data.List, 4);
      let swiperList = [];
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
          title: list[index].Title,
          ID: list[index].ID,
          Link: list[index].Link,
          src: app.Config.domainName + list[index].Cover,
          class: classType,
          notComingOut: list[index].IsLock,
          name: list[index].Title
        };
      }
      this.setData({
        swiperList: swiperList
      });
    });
  },
  //获取轶事列表
  getAnecdoteList: function(Type, callBack) {
    wx.request({
      url: app.Config.domainName + app.Config.getAnecdoteList,
      data: {
        SessionKey: app.loginInfo.SessionKey,
        p: 1,
        PageSize: 100,
        Type: Type
      },
      header: {
        "content-type": "application/json"
      },
      success: res => {
        if (res.data.errcode == 0) {
          let data = res.data.result;
          callBack && callBack(data);
        }
      }
    });
  },
  //原味轶事
  recommendItem: function(e) {
    wx.navigateTo({
      url: "/pages/views/cocktaildetail/cocktaildetail?type=0&act=1&id=" +
        e.currentTarget.dataset.id
    });
  },
  //玩味轶事
  swiperItemTo: function(e) {
    let _item = e.currentTarget.dataset.item
    if (_item.notComingOut) {
      return false
    }
    // 因为传参会截图?后的东西.所以编码 
    // & url=${ encodeURIComponent(_item.Link) }
    wx.navigateTo({
      url: `/pages/views/cocktaildetail/cocktaildetail?type=0&id=${_item.ID}&act=2`
    });

  },
  imageLoad(ev) {
    let i = ev.target.dataset.index
    console.log(ev.detail)
    let bili = ev.detail.height / ev.detail.width
    let _this = this
    let _res = _this.data.res
    console.log(_res)
    if (_res && _res.width < 100) {
      this.setData({
        res: null
      })
      _this.imageLoad(ev)
      return false
    }
    if (_this.data.res) {
      let res = _this.data.res
      let _w = (res.height + 30) / bili
      let swiperList = _this.data.swiperList
      let _style = ''
      //宽度不够box的宽度
      if (_w < res.width) {
        let _h = res.width * bili
        _style = `width:100%;height:${_h}px`
      } else {
        _style = `width:${parseInt(_w)}px;`
      }
      swiperList[i].style = _style
      _this.setData({
        swiperList
      })
    } else {
      wx.createSelectorQuery().select('.swiper_box').boundingClientRect(function(res) {
        if (res.width < 100) {
          _this.imageLoad(ev)
          return false
        }
        let _w = res.height / bili
        let swiperList = _this.data.swiperList
        let _style = ''
        //宽度不够box的宽度
        if (_w < res.width) {
          let _h = res.width * bili
          _style = `width:100%;height:${_h}px`
        } else {
          _style = `width:${parseInt(_w)}px;`
        }
        swiperList[i].style = _style
        _this.setData({
          res,
          swiperList
        })
      }).exec()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
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
      //向下滑动
      //向上滑动 上一张
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
  }
});
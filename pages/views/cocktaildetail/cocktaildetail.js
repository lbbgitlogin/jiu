// pages/views/cocktaildetail/cocktaildetail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

var gule = ['第一条 会员在社区内的言论(包括但不限于文字、图片、音频、视频，下同)不得违反国家的法律法规。根据《互联网新闻信息服务管理规定》，会员的言论不得含有下列内容：', '(一)违反宪法确定的基本原则的；', '(二)危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；', '(三)损害国家荣誉和利益的；', '(四)煽动民族仇恨、民族歧视，破坏民族团结的；', '(五)破坏国家宗教政策，宣扬邪教和封建迷信的；', '(六)散布谣言，扰乱社会秩序，破坏社会稳定的；', '(七)散布淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；', '(八)侮辱或者诽谤他人，侵害他人合法权益的；', '(九)煽动非法集会、结社、游行、示威、聚众扰乱社会秩序的；', '(十)以非法民间组织名义活动的；', '(十一)含有法律、行政法规禁止的其他内容的。', '第二条  会员发言前应了解所讨论的主题和相关规定，不得发表与主帖内容无关的言论。', '第三条 会员应尊重他人的知识产权，不得剽窃他人作品，转载和引用他人作品时应符合版权许可。', '第四条 会员应尊重他人隐私，除非涉及公众利益或者经当事人同意，不得发表他人的姓名、住址、电话等个人资料以及其他隐私信息。', '第五条 未经许可，禁止发布广告或者其他以获取商业利益为目的的内容。', '第六条 会员在评论区发表违反以上规定的言论的，我司有权随时删除其全部或部分言论。', '第七条 会员对自己的言论承担责任。', '第八条 会员在公共论坛的言论一经发表，就无法由本人修改和删除，我司不受理会员删除自己言论的请求。']
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gule,
    f: app.f,
    p: 1,
    iphoneX: app.Os.iphoneX,
    detailInfo: {},
    urltxt: '即刻购买',
    domId: null,
    inputValue: '',
    commonList: [],
    commentFlag: false,
    domainName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      act: options.act || -1,
      id: options.id || -1,
      url: options.url || '',
      domainName: app.Config.domainName
    })
    if (options.act == 2) {
      this.setData({
        urltxt: "去看同款原味轶事"
      })
    } else {}
    // 获取评论
    this.getComment()
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

    if (options.type == 0) {
      this.getData(app.Config.getAnecdoteInfo, options.id)
    } else if (options.type == 1) {
      this.getData(app.Config.getAlcoholInfo, options.id)
    }
  },
  getData(url, id) {
    app.Ajax.post(url, {
      id
    }).then(res => {
      if (res.errcode == 0) {
        let data = res.result;
        let detailInfo = {
          title: data.Title || data.Name,
          Info: data.Info,
          Link: data.Link
        };
        this.setData({
          detailInfo: detailInfo
        });
      }
    })
  },
  // 获取评论
  getComment(act) {
    let _this = this
    app.Ajax.post('/Barhandler.ashx?method=GetAlcConmentList', {
      p: this.data.p,
      PageSize: 50,
      AnecdoteID: this.data.id
    }).then(res => {
      if (res.errcode != 0) {
        return
      }
      if (res.result.List.length) {
        let commonList = act ? res.result.List : this.data.commonList.concat(res.result.List || [])
        let p = this.data.p + 1

        _this.setData({
          commonList,
          p
        })
      }
    })
  },
  //  上拉加载
  bindscrolltolower() {
    this.getComment()
  },
  // 发送评论
  send() {
    let val = this.data.inputValue
    if (!val) {
      app.toast('请输入评论内容');
      return false
    }
    app.Ajax.get('/Barhandler.ashx?method=ToAlcConment', {
      Info: val,
      AlcoholID: this.data.id
    }).then(res => {
      if (res.errcode == 0) {
        app.toast('评论成功');
        this.setData({
          p: 1,
          inputValue: ''
        })
        this.getComment(1)
      }
    })

  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  showComment() {
    this.setData({
      commentFlag: true
    })
    this.setData({
      domId: 'ul'
    })
  },
  toggle(e) {
    console.log('--------------------------')
    this.setData({
      btnFlag: e.detail
    })
    console.log(e.detail)
  },
  showGule() {
    this.selectComponent('#toast').show()
  },
  hideComment() {
    this.setData({
      commentFlag: false
    })
  },
  //即刻购买
  purchaseTo: function() {
    let url = this.data.detailInfo.Link
    console.log('data的Link：' + url)
    if (this.data.act == 1) {
      console.log('原味/鸡尾酒推荐 跳转jd+link:' + url)
      wx.navigateToMiniProgram({
        appId: 'wxcb91197da65aa9cb',
        path: url,
        success: function(res) {
          console.log('跳转成功')
        }
      })
      return;
    } else if (this.data.act == 2) {
      this.setData({
        urltxt: "去看同款原味轶事"
      })
      console.log('玩味跳转 data.link' + url)
      // 解码
      // url = decodeURIComponent(this.data.link)
      wx.navigateTo({
        url
      });
      return;
    }
    if (url) {
      wx.navigateTo({
        url
      });
    } else {
      console.log('跳转链接错误')
    }

  }
});
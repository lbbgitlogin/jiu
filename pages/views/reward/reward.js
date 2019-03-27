//获取应用实例
var app = getApp();
let gule = ['积分获取规则：', '(1).新用户注册奖励积分', '新用户注册即可获取200积分。', '(2).用户完善个人信息奖励积分', '用户完整填写个人信息获取20积分', '(3).签到奖励积分', '每天签到就能获得一定积分', '- 连续签到7天以下，每次获取5积分', '- 连续签到7天及以上，每天可获取20积分', '(4).分享推荐奖励积分', '- 每分享给一位微信好友可获取20积分，每天限额获取60积分', '(5).线下体验奖励积分', '消费包括味知实验室线下课程，根据实付金额奖励等值积分，如一节味知实验室线下课程实付268元，即获得268积分。', '积分使用规则：', '(1).积分仅可在味知实验室小程序中味知积分兑换中兑换指定礼品使用。积分不得转让，不可兑换现金。指定礼品数量有限，兑完即止，礼品以实物为准。', '(2).在获取和使用积分的过程中，如果出现违规行为（如作弊领取，恶意套现，虚假交易，通过各类外挂等恶意注册、获取或使用等），会员违规获得的积分将被扣除，必要时将被追究法律责任。', '(3).百加得洋酒贸易有限公司对此活动在法律允许范围内保留最终解释权。']

Page({
  data: {
    gule,
    userData: null,
    ident: 0,
    recommendList:[],
    isShare: false,
    historyList: null,
  },
  onShow: function() {
    this.init()
  },
  init() {
    this.getUser()
    this.getHistoryList()
    this.checkShare()
  },
  checkShare() {
    app.Ajax.get('/Barhandler.ashx?method=Share', {
      ShareTask: 'Task'
    }).then(res => {
      this.setData({
        isShare: res.result.ShareTask
      })
    })
  },
  onLoad: function(option) {
    this.setData({
      domainName: app.Config.imgPath
    });
  },
  recommendTo: function(e) {
    wx.navigateTo({
      url: '../integral/integral'
    })
  },
  getUser() {
    app.Ajax.get('/Handler.ashx?method=GetUserInfo').then(res => {
      this.setData({
        userData: res.result
      })
    })
  },
  imageLoad(ev) {
    let i = ev.target.dataset.index
    let _this = this
    wx.createSelectorQuery().select('#box').boundingClientRect(function (res) {
      let recommendList = _this.data.recommendList
      recommendList[i].style = app.getImgStyle(res, ev)
      _this.setData({
        recommendList
      })
    }).exec()
  },
  getHistoryData(){
    app.Ajax.get('/BarHandler.ashx?method=GetExchange', { p: 1, PageSize:500}).then(res => {
      let recommendList = res.result.List
      this.setData({
        recommendList
      })
    })
  },
  selectNav(e){
    let ident = e.currentTarget.dataset.index;
    if(ident==1){
      this.getHistoryData()
    }
    this.setData({
      ident
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    app.Ajax.post('/Handler.ashx?method=GetPhone', {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(res => {
      if (res.errcode == 0) {
        let phoneNumberInfo = res.result;
        this.init(); //更新数据
      }
    })
  },
  getHistoryList() {
    app.Ajax.get('/Barhandler.ashx?method=GetPointBill', {
      PageSize: 500,
      p: 1
    }).then(res => {
      this.setData({
        historyList: res.result.List
      })
    })
  },
  tipLogin() {
    app.toast('请每天坚持登陆')
  },
  showGule() {
    this.selectComponent('#gule').show()
  },
  goLaboratory() {
    wx.navigateTo({
      url: '/pages/views/laboratory/laboratory'
    })
  },
  // 分享
  onShareAppMessage() {
    return app.shareApp()
  }
});
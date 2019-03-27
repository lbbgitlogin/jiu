var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    underlineLeft: "0px",
    promptShow: false,
    swiperList: [
      // {
      //   title: "王的二次陈酿",
      //   src: "/pages/assets/laboratory/1.png",
      //   link: "/pages/views/curriculum/curriculum",
      //   guest: "帝王调配苏格兰威士忌"
      // },
      // {
      //   title: "伦敦千金的风情",
      //   src: "/pages/assets/laboratory/1.png",
      //   link: "/pages/views/curriculum/curriculum",
      //   guest: "孟买蓝宝石金酒"
      // },
      // {
      //   title: "盛开的法兰西",
      //   src: "/pages/assets/laboratory/1.png",
      //   link: "/pages/views/curriculum/curriculum",
      //   guest: "圣哲曼接骨木花利口酒"
      // }
    ],
    domainName: ""
  },
  promptClose: function() {
    this.setData({
      promptShow: false
    });
  },
  onLoad: function(option) {
    // act  0=所有已报名 1=未开课 2=已结课
    this.setData({
      domainName: app.Config.imgPath
    });
    app.Ajax.post('/Handler.ashx?method=GetCourseSign',{
      p:1,
      Type: option.act,
      PageSize: 500
    }).then(res=>{
      if (res.errcode == 0) {
        let data = res.result;
        let List = data.List;
        var swiperList = [];
        for (let index = 0; index < List.length; index++) {
          let YTD = List[index].Date.split(" ")[0].split("/");
          List[index].time = `${YTD[0]} ${YTD[1]}.${YTD[2]} ${
            List[index].StartTime
            }-${List[index].EndTime}`;
          swiperList[index] = List[index];
        }
        this.setData({
          swiperList: swiperList
        });
      }
    })
  },
  //分享
  onShareAppMessage: function() {
    return app.shareApp()
  },
  recommendSwitch: function(e) {
    this.setData({
      current: e.currentTarget.dataset.current,
      underlineLeft: e.target.offsetLeft + "px"
    });
  },
  galleryTo: function(e) {
    // this.setData({
    //   promptShow: true
    // });
    wx.navigateTo({
      url: "/pages/views/gallery/gallery?id=" + e.currentTarget.dataset.item.ID + '&title=' + e.currentTarget.dataset.item.Title
    });
  }
});
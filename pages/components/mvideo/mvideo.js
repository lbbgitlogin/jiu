var Timeout;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    frontCoverSrc: {
      // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: "" // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    src:{
         type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
         value: "" // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalShow: false,
    hide: false,
    lastX: 0,
    lastY: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close: function() {
      this.setData({
        modalShow: false
      });
      this.triggerEvent('toggle', false)
    },
    playVideo: function() {
      this.setData({
        modalShow: true
      });
      this.triggerEvent('toggle', true)
      Timeout = setTimeout(() => {
        this.setData({
          hide: true
        });
      }, 5200);
    },
    handletouchmove: function() {},
    //滑动开始事件
    handletouchtart: function(event) {
    },
    //滑动结束事件
    handletouchend: function(event) {
    }
  }
});

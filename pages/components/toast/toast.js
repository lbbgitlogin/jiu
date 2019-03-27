// pages/components/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'type': {
      type: String, 
      value: "image"
    },
    attrCss:{
      type:String,
      value: 'transform:translateY(-20%);'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    promptShow: false,
    path: '../../assets/images/await1.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(_src) {
      let path = _src || '../../assets/images/await1.png'
      this.setData({
        path,
        promptShow: true
      })
    },
    promptClose() {
      this.hide()
    },
    hide() {
      this.setData({
        promptShow: false
      })
      this.triggerEvent('hide', {}, {})
    }
  }
})
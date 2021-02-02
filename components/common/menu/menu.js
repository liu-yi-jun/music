// components/common/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [{
        name: '生成二维码',
        open_type: '',
        functionName: 'test'
      }, {
        name: '分享',
        open_type: 'share',
        functionName: ''
      }]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showMenu: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        showMenu: true
      })
    },
    cancel() {
      this.setData({
        showMenu: false
      })
    },
    handle(e) {
      let functionName = e.currentTarget.dataset.functionname
      console.log('1111111',functionName)
      this.triggerEvent(functionName)
    }
  }
})
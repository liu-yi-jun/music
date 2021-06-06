// components/common/menu/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [{
        name: '分享',
        open_type: 'share',
        functionName: ''
      }, {
        name: '收藏',
        open_type: '',
        functionName: 'handleStore'
      }, {
        name: '举报',
        open_type: '',
        functionName: 'handleReport'
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
      this.triggerEvent('cancelMenu')
    },
    handle(e) {
      let functionName = e.currentTarget.dataset.functionname
      this.setData({
        showMenu: false
      })
      this.triggerEvent('showTabBarShow')
      this.triggerEvent(functionName)
    },
    cancelMove() {
      return
    }
  }
})
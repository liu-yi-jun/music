// components/common/msgAuthorization/msgAuthorizatio.js
const app = getApp()
const authorize = require('../../../assets/tool/authorize')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    requestId: {
      type: Array,
      value: [app.InfoId.like, app.InfoId.content, app.InfoId.reply]
    },
    msgAuthorizationShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogShow: true,
    allowLeft: -999,
    allowTop: -999,
    alwaysTop: -999,
    alwaysLeft: -999,
    type: 0
  },
  lifetimes: {
    ready() {
      this.init()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    guide() {
      let type = this.data.type + 1
      this.setData({
        type,
        dialogShow: type === 2 ? false : true
      })
      if (type === 2) {
        this.setData({
          msgAuthorizationShow: false
        })
        authorize.alwaysSubscription(this.data.requestId).then(res => {
          console.log(res);
          this.triggerEvent('completeMsgAuthorization', {
            res
          })
        })
      }
    },
    init() {
      this.createSelectorQuery().select('#always').boundingClientRect().exec(res => {
        this.setData({
          alwaysTop: res[0].top,
          alwaysLeft: res[0].left
        })
      })
      this.createSelectorQuery().select('#allow').boundingClientRect().exec(res => {
        this.setData({
          allowTop: res[0].top,
          allowLeft: res[0].left
        })
      })
    }
  }
})
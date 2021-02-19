// components/common/authorization/authorization.js

let socket = require('../../../assets/request/socket')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({
        dialogShow: false
      })
    },
    //获取用户点击的是允许还是拒绝
    handleGetUserInfo(data) {
      if (data.detail.rawData) {
        if (!app.userInfo) {
          app.post(app.Api.register, {
            userInfo: data.detail.userInfo
          }, {
            loading: false
          }).then(res => {
            app.userInfo = res.userInfo
            socket.initSocketEvent()
            this.setData({
              dialogShow: false
            })
            this.triggerEvent('handleGetUserInfo', data)
          })
        }
      }

    },

  }
})
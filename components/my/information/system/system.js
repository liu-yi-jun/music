// components/my/information/system/system.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    systems: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    systemMsg: []
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached: function () {
      let systemMsg = wx.getStorageSync('systemMsg')
      console.log(systemMsg);
      this.setData({
        systemMsg
      })
    },
    methods: {
      agreeApply(e) {
        let index = e.currentTarget.dataset.index
        let systemMsg = this.data.systemMsg
        let section = systemMsg[index]
        app.post(app.Api.agreeApply, {
          userId: section.form.userId
        }).then(() => {
          section.message.jsonDate.status  = 1
          this.setData({
            systemMsg
          }) 
          wx.setStorageSync('systemMsg', systemMsg)
        })
      },
      refuseApply(e) {
        
      }
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  }
})
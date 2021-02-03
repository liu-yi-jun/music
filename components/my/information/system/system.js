// components/my/information/system/system.js
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

    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  }
})
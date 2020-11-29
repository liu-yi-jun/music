// components/square/performance/allianceList/allianceList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    alliances: {
      type: Array,
      value: []
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
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  
    goAllianceDetail(e) {
      console.log(e)
      let id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
         url: `/pages/square/performance/allianceDetail/allianceDetail?id=${id}`,
      })
    }
  }
})

// components/my/information/inform/inform.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    informs: {
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
    toDetail(e) {
      let index = e.currentTarget.dataset.index
      let informs = this.data.informs
      let detail = informs[index]
      if (detail.isNew) {
        app.post(app.Api.modifyInform, {
          id:detail.id
          // theme: detail.theme,
          // themeId: detail.themeId
        }).then((res) => {
          console.log(res)
          detail.isNew = 0
          this.setData({
            informs
          })
        })
      }
      if (detail.theme === 'groupdynamics' || detail.theme === 'squaredynamics') {
        let param = {
          id: detail.themeId,
          isLike: detail.isLike,
          isStore: detail.isStore,
          table: detail.theme
        }
        param = JSON.stringify(param)
        wx.navigateTo({
          url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
        })
      } else if (detail.theme === 'alliance') {
        wx.navigateTo({
          url: `/pages/square/performance/allianceDetail/allianceDetail?id=${detail.themeId}`,
        })
      } else if (detail.theme === 'groupcourse') {
        wx.navigateTo({
          url: `/pages/home/course/courseDetail/courseDetail?id=${detail.themeId}`,
        })
      } else if (detail.theme === 'band') {
        wx.navigateTo({
          url: `/pages/square/band/bandDetail/bandDetail?id=${detail.themeId}`,
        })
      } else if (detail.theme === 'second') {
        wx.navigateTo({
          url: `/pages/square/deal/secondDetail/secondDetail?id=${detail.themeId}`,
        })
      } else if (detail.theme === 'ticket') {
        wx.navigateTo({
          url: `/pages/square/deal/ticketDetail/ticketDetail?id=${detail.themeId}`,
        })
      } else if(detail.theme === 'bandmoment') {
        wx.navigateTo({
          url: `/pages/square/band/momentDetail/momentDetail?id=${detail.themeId}`,
        })
      }
      console.log(detail.theme);
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  }
})
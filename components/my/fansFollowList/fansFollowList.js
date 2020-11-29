// components/my/fansFollowList/fansFollowList.js
const app = getApp()
const core = require('.././../../assets/tool/core')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
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
    toFollow(e) {
      let {
        followtype: followType,
        otherid: otherId,
        index
      } = e.currentTarget.dataset
      let list = this.data.list
      if (followType === 1) {
        // 你关注我  =》 互关
        list[index].followType = 3
      } else {
        // 无关系 =》 关注
        list[index].followType = 2
      }
      this.setData({
        list
      }, () => {
        core.operateMultiple(app.Api.followUser, {
          operate: true,
          relation: {
            userId: app.userInfo.id,
            otherId,
          }
        }, index)
      })
    },
    cancelFollow(e) {
      let {
        followtype: followType,
        otherid: otherId,
        index
      } = e.currentTarget.dataset
      let list = this.data.list
      if (followType === 3) {
        // 互关  =》 你关注我
        list[index].followType = 1
      } else {
        // 已关注 =》 无关系
        list[index].followType = undefined
      }
      this.setData({
        list
      }, () => {
        core.operateMultiple(app.Api.followUser, {
          operate: false,
          relation: {
            userId: app.userInfo.id,
            otherId,
          }
        }, index)
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  }
})
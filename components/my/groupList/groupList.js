// components/my/groupList/groupList.js
const app = getApp()
const core = require('../../../assets/tool/core')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groups: {
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
      let index = e.target.dataset.index
      let groups = this.data.groups
      groups[index].isFollow = !groups[index].isFollow
      this.setData({
        groups
      }, () => {
        core.operateFollow(app.Api.followGroup, {
          operate: this.data.groups[index].isFollow,
          relation: {
            userId: app.userInfo.id,
            groupId: this.data.groups[index].id,
          }
        })
      })
    },
    goOtherHome(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
      })
    },
  }
})

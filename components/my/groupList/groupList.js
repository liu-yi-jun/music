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
    },
    isSettleGroup: {
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
      let group = this.data.groups[e.currentTarget.dataset.index]
      if (group.isJoin === -1  || group.isJoin === 1 ) {
        app.switchData.isSwitchGroup = true
        app.post(app.Api.switchGroup, {
          groupId: group.id,
          groupName: group.groupName,
          groupDuty: group.groupDuty,
          userId: app.userInfo.id
        }).then((res) => {
          wx.navigateBack({
            delta: 2,
          })
        })
      } else {
        wx.navigateTo({
          url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
        })
      }
    },
  }
})
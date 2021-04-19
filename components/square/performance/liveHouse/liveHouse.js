// components/square/performance/liveHouse/liveHouse.js
const app = getApp()
const core = require('../../../../assets/tool/core')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    tableName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toLike(e) {
      let index = e.currentTarget.dataset.index
      let tableName = this.properties.tableName
      let list = this.properties.list
      let content = list[index]
      content.isLike = !content.isLike
      content.isLike ? ++content.likes : --content.likes
      this.setData({
        list
      }, () => {
        core.operateLike(app.Api[tableName + 'Like'], {
          operate: content.isLike,
          relation: {
            userId: app.userInfo.id,
            themeId: content.id
          },
        })
      })
    },
    toStore(e) {
      let index = e.currentTarget.dataset.index
      let tableName = this.properties.tableName
      let list = this.properties.list
      let content = list[index]
      content.isStore = !content.isStore
      content.isStore ? ++content.store : --content.store
      this.setData({
        list
      }, () => {
        core.operateLike(app.Api[tableName + 'Store'], {
          operate: content.isStore,
          relation: {
            userId: app.userInfo.id,
            themeId: content.id
          },
        })
      })
    },
    goLiveHouseDetail(e) {
      let id = e.currentTarget.dataset.id
      this.index = e.currentTarget.dataset.index
      let item = this.data.list[this.index]
      let tableName = ''
      if (item.tableName) {
        tableName = item.tableName
      } else {
        tableName = this.properties.tableName
      }
      console.log(111111,item.tableName);
      wx.navigateTo({
        url: `/pages/square/performance/liveHouseDetail/liveHouseDetail?id=${id}&tableName=${tableName}`,
      })
    },
    completeLike(commenetBarData) {
      let list = this.properties.list
      let content = list[this.index]
      content.isLike = commenetBarData.isLike
      content.likes = commenetBarData.likes
      this.setData({
        list
      })
    },
    completeStore(commenetBarData) {
      let list = this.properties.list
      let content = list[this.index]
      content.isStore = commenetBarData.isStore
      content.store = commenetBarData.store
      this.setData({
        list
      })
    }
  }
})
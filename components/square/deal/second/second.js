// components/square/deal/second/second.js
const app = getApp()
const core = require('../../../../assets/tool/core')
let tool = require('../../../../assets/tool/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    seconds: {
      type: Array,
      value: []
    },
    isShowAdd: {
      type: Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // images: [
    //   [{
    //       src: 'http://cdn.eigene.cn/deal/guitar1.png',
    //       index: 0,
    //       store: false,
    //     },
    //     {
    //       src: 'http://cdn.eigene.cn/deal/guitar2.png',
    //       index: 1,
    //       store: false,
    //     },
    //     {
    //       src: 'http://cdn.eigene.cn/deal/guitar1.png',
    //       index: 4,
    //       store: false,
    //     }
    //   ],
    //   [{
    //       src: 'http://cdn.eigene.cn/deal/guitar3.png',
    //       index: 2,
    //       store: false,
    //     },
    //     {
    //       src: 'http://cdn.eigene.cn/deal/guitar4.png',
    //       index: 3,
    //       store: false,
    //     },
    //     {
    //       src: 'http://cdn.eigene.cn/deal/guitar2.png',
    //       index: 4,
    //       store: false,
    //     }
    //   ]
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSecondDetail(e) {
      let id = e.currentTarget.dataset.id
      this.i = e.currentTarget.dataset.i
      this.j = e.currentTarget.dataset.j
      wx.navigateTo({
        url: `/pages/square/deal/secondDetail/secondDetail?id=${id}`,
      })
    },
    completeStore(commenetBarData) {
      let seconds = this.properties.seconds
      seconds[this.i][this.j].isStore = commenetBarData.isStore
      this.setData({
        seconds
      })
    },
    goSecondIssue() {
      wx.navigateTo({
        url: '/pages/square/deal/secondIssue/secondIssue',
      })
    },

    switchSecondStore(e) {
      let {
        i,
        j
      } = e.currentTarget.dataset
      let seconds = this.data.seconds
      seconds[i][j].isStore = !seconds[i][j].isStore
      this.setData({
        seconds
      }, () => {
        core.operateMultiple(app.Api.followSecond, {
          operate: seconds[i][j].isStore,
          relation: {
            userId: app.userInfo.id,
            secondId: seconds[i][j].id,
          }
        }, seconds[i][j].id)
      })
    },
    goPersonal(e) {
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
    pre(e) {
      let url = e.currentTarget.dataset.url
      let urls = e.currentTarget.dataset.urls
      tool.previewImage(urls,url)
    }
  }
})
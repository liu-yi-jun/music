// components/square/deal/second/second.js
const app = getApp()
const core = require('../../../../assets/tool/core')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    seconds: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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
    }
  }
})
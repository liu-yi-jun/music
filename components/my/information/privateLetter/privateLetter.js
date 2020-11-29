// components/my/information/privateLetter/privateLetter.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userMessage: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // // x轴方向的偏移
    // x: 0,
    // Xlist: [],
    // 当前x的值
    list: [],
    currentX: 0,
  },

  /**
   * 组件的方法列表
   */
  lifetimes: {
    attached() {

    },
    detached() {
     
    }
  },
  methods: {
 
    // 去私信
    goPrivateLetter(e) {
      let item = e.currentTarget.dataset.item
      let to = {
        userId: item.userId,
        avatarUrl: item.avatarUrl,
        nickName: item.nickName
      }
      to = JSON.stringify(to)
      wx.navigateTo({
        url: `/pages/my/privateLetter/privateLetter?to=${to}`,
      })
    },

    handleTouchStart(e) {
      let index = e.currentTarget.dataset.index
      let list = this.data.list
      console.log(index)
      if (!list[index]) {
        list[index] = {}
      }
      list[index].startX = e.changedTouches[0].clientX
      list[index].startY = e.changedTouches[0].clientY
      this.setData({
        list
      })
    },
    handleTouchend(e) {
      let index = e.currentTarget.dataset.index
      let list = this.data.list
      let endX = e.changedTouches[0].clientX
      let endY = e.changedTouches[0].clientY
      let startX = list[index].startX
      let startY = list[index].startY
      if (Math.abs(endY - startY) > 90) return

      if (startX - endX > 40 || (startX - endX > -40 && startX - endX < -1)) {
        list[index].x = -180
        this.setData({
          list
        });
      }
      if ((startX - endX < 40 && startX - endX > 1) || startX - endX < -40) {
        list[index].x = 0
        this.setData({
          list
        });
      }
    },
    handleMovebleChange(event) {
      // let currentX = event.detail.x
      // console.log(currentX)
      // let startTime = Date.now()
      // this.setData({
      //   currentX
      // }, () => {
      //   let endTime = Date.now()
      //   console.log(endTime - startTime, '渲染时长')
      // })
    },
  }
})
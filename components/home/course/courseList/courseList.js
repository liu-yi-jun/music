// components/home/course/courseList/courseList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courses: {
      type: Array,
      value: []
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
    goLearnGuitarDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/home/course/courseDetail/courseDetail?id=${id}`,
      })
    },
    goPersonal(e) {
      console.log(e)
      let userId = e.currentTarget.dataset.userid
      wx.navigateTo({
        url: `/pages/my/invitation/invitation?userId=${userId}`,
      })
    },
  }
})

// components/common/guidMsgAuthor/guidMsgAuthor.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msgAuthorizationShow: {
      type: Boolean,
      value: false
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

  }
})
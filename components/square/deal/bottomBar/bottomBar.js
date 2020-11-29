// components/square/deal/bottomBar/bottomBar.js
const app = getApp()
const common = require('../../../../assets/tool/common')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogShow: false,
    money: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseImg() {
      common.chooseImage(9).then(res => {
        this.triggerEvent('chooseImage', {
          tempImagePaths: res.tempFilePaths
        })
      })
    },
    chooseVideo() {
      common.chooseVideo().then(res => {
        this.triggerEvent('chooseVideo', {
          tempVideoPath: res.tempFilePath
        })
      })
    },
    popupMoney() {
      this.setData({
        dialogShow: true
      })
    },
    cancel() {
      this.setData({
        dialogShow: false
      })
    },
    confirm() {
      this.setData({
        dialogShow: false
      })
      if (this.data.money) {
        this.triggerEvent('inputMoney', {
          money: this.data.money
        })
      }
    },
    bindinput(event) {
      this.setData({
        money: event.detail.value
      })

    }
  }
})
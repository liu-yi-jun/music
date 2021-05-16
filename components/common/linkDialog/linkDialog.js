const common = require("../../../assets/tool/common")

// components/common/link/link.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    linkDialogShow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    linkUrl: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputLinkUrl(e) {
      clearTimeout(this.point)
      this.point = setTimeout(() => {
        this.setData({
          linkUrl: e.detail.value
        })
      }, 200)
    },
    complete() {
      let linkUrl = this.data.linkUrl
      let patt1 = /^vid=/;
      let patt2 =  /(http|https):\/\/([\w.]+\/?)\S*.mp4$/;
      let isVid = false
      if (!patt1.test(linkUrl) && !patt2.test(linkUrl)) {
       return common.Tip('请输入正确的格式')
      }
      if(patt1.test(linkUrl)) {
        isVid = true
        linkUrl = linkUrl.split('=')[1]
      }
      this.setData({
        linkUrl:''
      })
      this.triggerEvent('completeInput',{linkUrl,isVid})
    },
    howObtainVid(){
      wx.navigateTo({
        url: '/pages/common/howObtainVid/howObtainVid',
      })
    },
    cancelPopup() {
      this.setData({
        linkUrl:'',
        linkDialogShow:false
      })
    }
  },

})
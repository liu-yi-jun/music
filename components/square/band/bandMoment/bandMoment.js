// components/square/band/bandMoment/bandMoment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    moments: {
      type: Array,
      value: []
    }
  },
  lifetimes: {
    attached: function() {
      console.log(1111111111);
      console.log(this.data.seconds);
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
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
    toMomentDetail(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/square/band/momentDetail/momentDetail?id=${id}`,
      })
    },
    startPlay(e) {
      let id = e.currentTarget.dataset.id
      if (this.videoId && (this.videoId !== id)) {
        let videoContext = wx.createVideoContext(`video${this.videoId}`, this)
        videoContext.pause()
      }
      this.videoId = id
    }
  }
})

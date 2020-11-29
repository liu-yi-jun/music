// components/home/course/courseDatum/courseDatum.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datumUrls: {
      type:Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // src:'http://cdn.eigene.cn/courseDetail/data.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    preview(e) {
      let src = e.currentTarget.dataset.src
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
      })
    }
  }
})
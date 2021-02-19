// components/common/bar/bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    barList: {
      type: Array,
      value: [{
          name: '动态',
        },
        {
          name: '课程'
        }
      ]
    },
    actIndex: {
      type: Number,
      value: 0
    },
    gap: {
      type: Number,
      // 单位rpx
      value: 36
    },
    size: {
      type: Number,
      // rpx
      value: 32
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    switchBtn: 'dynamic'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchBtn(e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent('switchBtn', {
        actIndex: index
      })
    }
  }
})
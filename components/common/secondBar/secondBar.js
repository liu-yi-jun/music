// components/common/secondBar/secondBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    barList: {
      type: Array,
      value: [{
          name: '动态',
          children: [{
              name: '小组'
            },
            {
              name: '广场'
            }
          ]
        },
        {
          name: '发布',
          children: [{
              name: '小组活动'
            },
            {
              name: 'livehouse'
            },
            {
              name: '音乐节'
            },
            
          ]
        }
      ]
    },
    actIndexArr: {
      type: Array,
      value: [0, 0]
    },
    gap: {
      type: Number,
      // 单位rpx
      value: 32
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
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    switchBtn(e) {
      let {
        index,
        type
      } = e.currentTarget.dataset
      let actIndexArr
      if(type === 'first'){
        actIndexArr = [index,0]
      }else {
        console.log(this.data.actIndexArr[0],index);
        actIndexArr = [this.data.actIndexArr[0],index]
      }
      this.triggerEvent('switchBtn', {
        actIndexArr: actIndexArr
      })
    }
  }
})
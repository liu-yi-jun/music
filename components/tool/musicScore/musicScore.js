// components/tool/musicScore/musicScore.js
let tool = require('../../../assets/tool/tool')
let common = require('../../../assets/tool/common')
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    excludeHeight:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    // excludeHeight: 0,
    // 控制右下角三角show
    tabBarBtnShow: false,
    circulars: [],
    limit: 50,
    isNotData: false,
    value: '',
    taPPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false
    },
  },
  lifetimes: {
    created: function () {
      // 获取去除上面导航栏，剩余的高度
      // tool.navExcludeHeight(this)
      // this.getRandomTap()
      this.gettaps(this.data.value)
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },

  },
  /**
   * 组件的方法列表
   */
  methods: {
    gettaps(tapTitle) {
      let taPPaging = this.data.taPPaging
      app.get(app.Api.getTaps, {
        tapTitle,
        ...taPPaging
      }).then(res => {
        if (res.length < taPPaging.pageSize) {
          this.setData({
            'taPPaging.isNotData': true
          })
        }
        this.setData({
          'taPPaging.pageIndex': taPPaging.pageIndex + 1
        })
        this.init(res)
      })
    },
    getRandomTap() {
      app.get(app.Api.getRandomTap, {
        limit: this.data.limit
      }).then(res => {
        this.init(res)
      })
    },
    init(circulars) {
      const deviceW = 750
      let randomWH, deg, delay, duration, circularLeft
      let direction, translate
      circulars.forEach((item, index) => {
          deg = tool.randomNumber(0, 360)
          duration = tool.randomNumber(1500, 2500)
          randomWH = tool.randomNumber(30, 180)
          circularLeft = tool.randomNumber(0, deviceW - randomWH)

          if (randomWH / 2 + circularLeft <= deviceW / 2) {
            direction = 'left'
          } else {
            direction = 'right'
          }
          translate = 50 / (deviceW / 2 - randomWH / 2) * circularLeft
          if (direction === 'left') {
            translate = -translate
          } else {
            translate = 100 - translate
          }


          item.style = `
      width: ${randomWH}rpx;
      height: ${randomWH}rpx;
      background: linear-gradient(${deg}deg, rgba(226, 145, 227, 1), rgba(0, 69, 207, 1));
      left: ${circularLeft}rpx;
      top: 0rpx;
      animation-duration: ${duration}ms;
      animation-name: shake;`

          item.TextStyle = `
      ${direction}: 50%;
      transform: translateX(${translate}%);
      `
        }),
        this.setData({
          circulars: this.data.circulars.concat(circulars)
        })
    },
    goTapPractice(e) {
      let circulars = this.data.circulars
      let index = e.currentTarget.dataset.index
      let id = circulars[index].id
      wx.navigateTo({
        url: `/pages/tool/tapPractice/tapPractice?id=${id}`,
      })
    },
    confirm(event) {
      this.setData({
        value: event.detail.value,
        circulars: [],
        taPPaging: {
          pageSize: 50,
          pageIndex: 1,
          isNotData: false
        },
      }, () => [
        this.gettaps(event.detail.value)
      ])

    },
    search(value) {
      app.get(app.Api.searchTap, {
        tapTitle: value,
        limit: this.data.limit
      }).then(res => {
        if (res.length < this.data.limit) {
          isNotData: true
        }
        this.init(res)
      })
    },
    scrolltolower() {
      let value = this.data.value
      let isNotData = this.data.taPPaging.isNotData
      if (!isNotData) {
        this.gettaps(value)
      }
    },
  }
})
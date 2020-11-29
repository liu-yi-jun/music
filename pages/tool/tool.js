// pages/tool/tool.js
let tool = require('../../assets/tool/tool')
let common = require('../../assets/tool/common')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 控制右下角三角show
    tabBarBtnShow: false,
    position: [{
      left: 58,
      top: 26.9,
      WH: 57,
    }, {
      left: 225,
      top: 32,
      WH: 59,
    }, {
      left: 154,
      top: 44,
      WH: 100,
    }, {
      left: 495,
      top: 52.9,
      WH: 129,
    }, {
      left: 624,
      top: 68.5,
      WH: 30,
    }, {
      left: 424,
      top: 75.9,
      WH: 100,
    }, {
      left: 58,
      top: 85.1,
      WH: 54,
    }, {
      left: 308,
      top: 90.5,
      WH: 68,
    }, {
      left: 147,
      top: 76.01,
      WH: 81,
    }, {
      left: 431,
      top: 77.36,
      WH: 185,
    }],
    circulars: [{
        id: 1,
        groupName: '宝贝',
        author: '张悬',
        src: 'http://www.echangwang.com//up/imgs/2011/5-201126102Z3.png'
        // <img alt="解忧邵帅《写给黄淮》吉他谱1" src=""/>
      },
      {
        id: 2,
        groupName: '夏天的风',
        author: '阿琦',
        src: 'http://www.echangwang.com//up/imgs/2011/5-201126092319.png'
      },
      {
        id: 3,
        groupName: '认真地老去',
        author: '曹方/张希',
        src:'http://www.echangwang.com//up/imgs/2011/5-201125114614.png'
      }, {
        id: 4,
        groupName: '七月上',
        author: 'JAM',
        src:'http://www.echangwang.com//up/imgs/2011/5-201125095554.png'
      }, {
        id: 5,
        groupName: '下一站茶山刘',
        author: '房东的猫',
        src:'http://www.echangwang.com//up/imgs/2011/5-20111PU236.png'
      }, {
        id: 6,
        groupName: '我会在每个有意义的时辰',
        author: '黄楚桐',
        src: 'http://www.echangwang.com//up/imgs/2011/5-201124141223.png'
      },
      {
        id: 8,
        groupName: '种种',
        author: '张悬',
        src: 'http://www.echangwang.com//up/imgs/2011/5-201124134204.png'
      },
      {
        id: 9,
        groupName: '去看星星好不好',
        author: '开心',
        src: 'http://www.echangwang.com//up/imgs/2011/5-201124114438.png'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  init() {
    let circulars = this.data.circulars
    let position = this.data.position
    let randomWH, deg, delay, duration
    circulars.forEach((item, index) => {
        // randomWH = tool.randomNumber(27, 185)
        deg = tool.randomNumber(0, 360)
        // delay = tool.randomNumber(0, 500)
        duration = tool.randomNumber(1500, 2500)
        item.style = `
    width: ${position[index].WH}rpx;
    height: ${position[index].WH}rpx;
    background: linear-gradient(${deg}deg, rgba(226, 145, 227, 1), rgba(0, 69, 207, 1));
    left: ${position[index].left}rpx;
    top: ${position[index].top}%;
    animation-duration: ${duration}ms;
    animation-name: shake;`
      }),
      this.setData({
        circulars
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
      // app.getNotice(this, app.userInfo.id)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 控制bar栏
  tap() {
    this.setData({
      tabBarBtnShow: true
    })
    this.getTabBar().setData({
      show: false
    })
  },
  previewImage(e) {
    let src = e.currentTarget.dataset.src
    common.previewImage([src], src)
  }
})
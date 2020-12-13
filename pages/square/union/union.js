// pages/square/union/union.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const common = require('../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    position: [{
      left: 333,
      top: 9.9,
      WH: 137,
    }, {
      left: 69,
      top: 22,
      WH: 127,
    }, {
      left: 341,
      top: 33.8,
      WH: 73,
    }, {
      left: 582,
      top: 28.6,
      WH: 74,
    }, {
      left: 295,
      top: 47.75,
      WH: 27,
    }, {
      left: 512,
      top: 46.77,
      WH: 86,
    }, {
      left: 109,
      top: 55.32,
      WH: 126,
    }, {
      left: 446,
      top: 63.71,
      WH: 50,
    }, {
      left: 147,
      top: 76.01,
      WH: 81,
    }, {
      left: 431,
      top: 77.36,
      WH: 185,
    }],
    circulars: [],
    unionGuide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getRandomGroup()
  },

  getRandomGroup(){
    app.get(app.Api.getRandomGroup,{
      limit: 10
    },{
      loading:false
    }).then(res=> {
      this.setData({
        circulars: res,
        // unionGuide: app.globalData.guide.union,
      },()=> {
        this.init()
      })
    })
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
    tool.shake(() => {
      this.click()
      this.getRandomGroup()
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
    wx.offAccelerometerChange()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    wx.offAccelerometerChange()
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
  handlerGobackClick: app.handlerGobackClick,
  goOtherHome (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/home/otherHome/otherHome?showGroupId=${id}`,
    })
  },
  click() {
    let guide =  wx.getStorageSync('guide')
    if(guide.union) {
      guide.union = false
      wx.setStorageSync('guide', guide)
      this.setData({
        unionGuide: false
      })
    }
   }
})
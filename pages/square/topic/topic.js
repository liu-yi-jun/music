// pages/square/topic/topic.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    dynamicsPaging: {
      pageSize: 20,
      pageIndex: 1,
      isNotData: false,
    },
    dynamics: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getTopicDynamic(options.topicId)
  },
  getTopicDynamic(topicId){
    let dynamicsPaging = this.data.dynamicsPaging
    app.get(app.Api.topicDynamic,{
      ...dynamicsPaging,
      userId: app.userInfo.id,
      topicId
    }).then(res=> {
      if (res.length < dynamicsPaging.pageSize) {
        this.setData({
          'dynamicsPaging.isNotData': true
        })
      }
      this.setData({
        dynamics: this.data.dynamics.concat(res),
        'dynamicsPaging.pageIndex': dynamicsPaging.pageIndex + 1
      })
    })
  },
  completeLike(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeLike(commenetBarData)

  },
  completeStore(commenetBarData) {
    const dynamicList = this.selectComponent('#dynamicList');
    dynamicList.completeStore(commenetBarData)
  },
  scrolltolower() {
    if (!this.data.dynamicsPaging.isNotData) {
      this.getTopicDynamic()
    }
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
  handlerGobackClick: app.handlerGobackClick
})
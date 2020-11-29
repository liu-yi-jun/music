// pages/home/alliance/alliance.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:'advance'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 控制不同bar
  active(ev) {
    const current = ev.currentTarget.dataset.current
    if (current == this.data.current) {
      return false
    } else {
      this.setData({
        current
      })
    }
  },
  // 跳转到issue
  goIssue() {
    wx.navigateTo({
      url: './issue/issue',
    })
  }
})
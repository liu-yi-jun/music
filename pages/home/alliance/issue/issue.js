// pages/home/alliance/issue/issue.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '活动时间',
    first: true,
    keyBoardHeight: '0px',
    id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.onKeyboardHeightChange(res => {
    //   console.log(res.height, '1111')

    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  keyBoardChange(height) {
    //键盘高度改变时调用
    // bindkeyboardheightchange="keyBoardChange"安卓不能使用，因为点击空白处没有监听到
    // console.log(e.detail.height, '2222')
    //键盘收起,修改showTextara
    //注意keyBoardChange刚开始时调用了多次，第一次高度为不正确,这时不应该设置showTextara为false
    if (this.data.first) {
      this.setData({
        first: false
      })
    } else {
      let keyBoardHeight = height + 'px'
      this.setData({
        keyBoardHeight,
        id: 'textarea'
      })
    }
  },

  boardheightchange(even) {
    // this.keyBoardChange(even.detail.height)

  },
  // 日期选择器
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
})
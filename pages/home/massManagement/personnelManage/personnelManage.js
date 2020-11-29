// pages/home/massManagement/personnelManage/personnelManage.js
const app = getApp()
const tool = require('../../../../assets/tool/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    admini: [{
        id: 0,
        avatarSrc: "http://cdn.eigene.cn/avatar14.png",
        userName: 'Desperado',
        sex: '♂',
        constellation: '双鱼座',
        age: 22,
        position: '社长'
      },
      {
        id: 1,
        avatarSrc: "http://cdn.eigene.cn/avatar15.png",
        userName: 'Raymond',
        sex: '♂',
        constellation: '双子座',
        age: 24,
        position: '管理员'
      },
      {
        id: 2,
        avatarSrc: "http://cdn.eigene.cn/avatar16.png",
        userName: 'Potato',
        sex: '♂',
        constellation: '水瓶座',
        age: 22,
        position: '管理员'
      },
      {
        id: 3,
        avatarSrc: "http://cdn.eigene.cn/avatar17.png",
        userName: 'LonerApaul',
        sex: '♂',
        constellation: '双鱼座',
        age: 22,
        position: '管理员'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
 
  },
  getGroupAdmini() {
    app.get(app.Api.groupAdmini, {
      groupId: app.groupInfo.id
    },{
      loading:false
    }).then((res)=>{
      // console.log(res)
      this.setData({
        admini:res
      })
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
    this.getGroupAdmini()
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
  handlerGobackClick: app.handlerGobackClick,
  goAddManage() {
    wx.navigateTo({
      url: '/pages/home/massManagement/personnelManage/addManage/addManage',
    })
  }
})
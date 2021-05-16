// pages/home/massManagement/personnelManage/addManage/addManage.js
const app = getApp()
const tool = require('../../../../../assets/tool/tool.js')
const common = require('../../../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    member: [],
    tempValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getGroupMember()
  },
  getGroupMember() {
    app.get(app.Api.groupMember, {
      groupId: app.groupInfo.id
    }, {
      loading: false
    }).then((res) => {
      console.log(res)
      this.setData({
        member: res
      })
    })
  },
  searchInput(event){
    this.setData({
      tempValue: event.detail.value,
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
  confirm(event) {
    let value = event.detail.value
    this.searchGroupMember(value?value:this.data.tempValue)
  },
  searchGroupMember(nickName) {
    app.get(app.Api.searchGroupMember, {
      nickName,
      groupId: app.groupInfo.id
    }).then(res => {
      this.setData({
        member: res
      })
      console.log(res)
    })
  },
  toAddManage(e) {
    common.Tip('是否将该成员设置为管理员', '提示', '确定', true).then(res => {
      if (res.confirm) {
        let userid = e.currentTarget.dataset.userid
        app.post(app.Api.addManage, {
          userId: userid,
          groupId: app.groupInfo.id
        }).then(res => {
          // this.setData({
          //   member:res
          // })
          if (res.changedRows) {
            common.Toast('添加成功')
            this.getGroupMember()
          }
        })
      }
    })

  }
})
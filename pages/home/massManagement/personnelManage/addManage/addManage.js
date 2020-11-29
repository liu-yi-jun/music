// pages/home/massManagement/personnelManage/addManage/addManage.js
const app = getApp()
const tool = require('../../../../../assets/tool/tool.js')
const common = require('../../../../../assets/tool/common')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    member: [{
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
      },
      {
        id: 4,
        avatarSrc: "http://cdn.eigene.cn/avatar18.png",
        userName: 'Tomato',
        sex: '♀',
        constellation: '双鱼座',
        age: 22,
        position: ''
      },
      {
        id: 5,
        avatarSrc: "http://cdn.eigene.cn/avatar19.png",
        userName: 'Orange',
        sex: '♀',
        constellation: '白羊座',
        age: 22,
        position: ''
      }
    ]
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
    this.searchGroupMember(value)
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
          userId: userid
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
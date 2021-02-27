// pages/home/massManagement/massManagement.js
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
    tempFilePaths: [],
    groupInfo: [],
    describe: '',
    privates: 0,
    examine: 0,
    groupDuty: 0,
    newNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    this.getNewNumber()
    // 将小组信息存储到data
    this.setData({
      groupInfo: app.groupInfo,
      privates: app.groupInfo.privates,
      examine: app.groupInfo.examine,
      tempFilePaths: [app.groupInfo.groupLogo],
      describe: app.groupInfo.introduce,
      groupDuty: app.userInfo.groupDuty
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getNewNumber() {
    app.get(app.Api.newNumber,{
      groupId:app.groupInfo.id
    },{loading:false}).then(res=> {
    console.log(res);
    this.setData({
      newNumber: res.newNumber
    })
    })
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
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  save: async function() {
    console.log(1);
    const params = await this.validate()
    if (params) {
      let modifyResult = await this.modifyGroup(params)
      modifyResult.myGrouList = app.groupInfo.myGrouList
      app.groupInfo = modifyResult
      if(modifyResult) {
        common.Toast('已保存',1500,'success')
        setTimeout(()=> {
          wx.navigateBack()
        },1500)
        
      }else {
        common.Toast('保存失败,请稍后重试')
    }
    }else {
      common.Toast('已保存',1500,'success')
      setTimeout(()=> {
        wx.navigateBack()
      },1500)
    }

  },
  onUnload: async function () {
    console.log('onUnload')
  
  },
  // 修改小组
  modifyGroup(data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      app.post(app.Api.modifyGroup, data, {
        loading: ['保存中...']
      }).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  // 进行校验
  validate() {
    let oldPrivate = app.groupInfo.privates
    let oldExamine = app.groupInfo.examine
    let introduce = app.groupInfo.introduce
    let {
      tempFilePaths,
      describe,
      privates,
      examine
    } = this.data
    return new Promise((resolve, reject) => {
      if (tempFilePaths[0] != app.groupInfo.groupLogo || describe != introduce || oldPrivate != privates || oldExamine != examine) {
        resolve({
          groupLogo: tempFilePaths[0],
          privates,
          examine,
          introduce: describe,
          id: app.groupInfo.id
        })
      } else {
        resolve()
      }
    })
  },
  inputDescribe(event) {
    console.log(event.detail.value)
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.setData({
        describe: event.detail.value
      })
    }, 500);
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
  chooseGroupLogo() {
    common.chooseImage(1).then(res => {
      this.setData({
        tempFilePaths: res.tempFilePaths
      })
    })
  },
  previewImage() {
    common.previewImage(this.data.tempFilePaths)
  },
  goMassManagement() {
    wx.navigateTo({
      url: '/pages/home/massManagement/personnelManage/personnelManage',
    })
  },
  changeExamine(event) {
    this.setData({
      examine: Number(event.detail.value)
    })
  },
  changePrivate(event) {
    this.setData({
      privates: Number(event.detail.value)
    })

  },
  toDissolution() {
    common.Tip('是否解散该小组', '提示', '确定', true).then(res => {
      if (res.confirm) {
        app.post(app.Api.dissolutionGroup, {
          groupId: app.userInfo.groupId,
          userId: app.userInfo.id
        }).then(res => {
          if (res.result.affectedRows) {
            // common.Tip('小组已解散，请选择要加入的小组或重建小组').then(res => {
              this.goIndex()
            // })
          }
        }).catch(err => console.log(err))
      }
    })
  },
  toSignOut() {
    common.Tip('是否退出该小组', '提示', '确定', true).then(res => {
      if (res.confirm) {
        app.post(app.Api.signOutGroup, {
          groupId: app.groupInfo.id,
          userId: app.userInfo.id
        }).then(res => {
          if (res.result.changedRows) {
            app.groupInfo.myGrouList = res.myGrouList
            // common.Tip('已退出小组，请选择要加入的小组或重建小组').then(res => {
            this.goIndex()
            // })
          }
        }).catch(err => common.Toast(err))
      }
    })
  },
  goIndex() {
    app.switchData.isSwitchGroup = true
    wx.navigateBack({
      delta: 1,
    })
  }
})
// pages/home/otherHome/otherHome.js
let app = getApp()
let common = require('../../../assets/tool/common')
let tool = require('../../../assets/tool/tool')
let core = require('../../../assets/tool/core')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      // 点击第一个头像后显示光圈
      dynamicIsShow: false,
    // 打卡、课程功能板块
    functionBarShow: false,
    // 控制弹出框
    dialogShow: false,
    // 是否关注
    isFollow: false,
    // 小组信息
    groupInfo: {},
    groupNameTop: '',
    groupNamebuttom: '',
    style: [{
        index: 0,
        bottom: 85,
        scaleX: 0.2,
        scaleY: 0.1,
        opacity: 0,
      },
      {
        index: 1,
        bottom: 79,
        scaleX: 0.4,
        scaleY: 0.2,
        opacity: 1,
      },
      {
        index: 2,
        bottom: 68,
        scaleX: 0.5,
        scaleY: 0.3,
        opacity: 1,
      },
      {
        index: 3,
        bottom: 54,
        scaleX: 0.6,
        scaleY: 0.4,
        opacity: 1,
      },
      {
        index: 4,
        bottom: 34,
        scaleX: 0.8,
        scaleY: 0.6,
        opacity: 1,
      },
      {
        index: 5,
        bottom: 4,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
      },
      {
        index: 6,
        bottom: -50,
        scaleX: 1,
        scaleY: 1,
        opacity: 0,
      },
    ],
    isNotData: false,
    styleLeight: 7,
    ableIndex: 1,
    pointer: 0,
    showMember: [],
    pageSize: 28,
    pageIndex: 1,
    reqFirst: true,
    member: [],
    showContent: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.userInfo)
    let showGroupId = options.showGroupId
    let {
      groupId: myGroupId,
    } = app.userInfo
    this.getGroupInfo(showGroupId)
    this.groupPagingGetGroupdynamics(showGroupId).then(() => {
      this.urlPush()
    })
    if (!myGroupId) {
      this.setData({
        dialogShow: true
      })
    }
  },
  groupPagingGetGroupdynamics(groupId) {
    return new Promise((resolve, reject) => {
      console.log('groupPagingGetGroupdynamics')
      let pageSize = this.data.pageSize
      let pageIndex = this.data.pageIndex
      app.get(app.Api.groupPagingGetGroupdynamics, {
        pageSize,
        pageIndex,
        groupId,
        userId:app.userInfo.id
      }).then(res => {
        console.log('res.length', res.length)
        if (res.length < pageSize) {
          this.setData({
            isNotData: true
          })
          // return resolve()
        }
        this.setData({
          member: this.data.member.concat(res),
          pageSize: pageSize,
          pageIndex: this.data.pageIndex + 1
        }, () => {
          resolve()
        })
      }).catch(err => reject(err))
    })
  },
  getGroupInfo(groupId) {
    console.log(groupId)
    app.get(app.Api.getGroupInfo, {
      groupId,
      userId: app.userInfo.id
    }, {
      loading: false
    }).then((res) => {
      console.log(res)
      let groupNameTop, groupNamebuttom
      if (res.groupName.length > 7) {
        groupNameTop = res.groupName.substr(0, 7)
        groupNamebuttom = res.groupName.substr(7)
      } else {
        groupNameTop = res.groupName
      }
      console.log(groupNameTop, groupNamebuttom)
      this.setData({
        groupInfo: res,
        groupNameTop,
        groupNamebuttom
      })
      app.groupInfo = res
    }).catch(err => err)
  },


  urlPush() {
    let i = 0
    const showMember = this.data.showMember
    const styleLeight = this.data.styleLeight
    const member = this.data.member
    for (i; i < styleLeight; i++) {
      showMember.push(member[i])
    }
    this.setData({
      showMember,
      pointer: styleLeight - 1
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getmoveDistance()
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
    let playRecord = this.selectComponent('#playRecord')
    playRecord.endSound()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  handlerGobackClick: app.handlerGobackClick,
  touchstart(e) {
    this.tap(e)
    this.startY = e.changedTouches[0].clientY
    this.startX = e.changedTouches[0].clientX
    this.index = e.mark.index
    // if (!scrollArea) {
    //   fixedindex = e.instance.getDataset().fixedindex
    // }

  },

  touchend(e) {
    this.endX = e.changedTouches[0].clientX
    this.endY = e.changedTouches[0].clientY
    this.moveRealize().then(() => {
      let {
        ableIndex,
        styleLeight,
        showMember
      } = this.data
      let memberLeight = this.data.member.length
      let showContent = showMember[(ableIndex - 1) % styleLeight]
      this.setData({
        dynamicIsShow: true,
        showContent
      },()=> {
        setTimeout(()=> {
          this.setData({
            showVideo: true
          })
        },500)
      })
      console.log('(ableIndex + styleLeight*2 >= memberLeight', ableIndex + styleLeight * 2 >= memberLeight)
      console.log('!this.data.isNotData', !this.data.isNotData)
      if (ableIndex + styleLeight * 2 >= memberLeight && !this.data.isNotData) {
        this.groupPagingGetGroupdynamics(this.data.groupInfo.id)
      }
    })
  },
  moveRealize() {
    return new Promise((resolve, reject) => {
      let endX = this.endX
      let endY = this.endY
      let startX = this.startX
      let startY = this.startY
      let pointer = this.data.pointer
      let memberLength = this.data.member.length
      let styleLeight = this.data.styleLeight
      if (Math.abs(endY - startY) > 5 || Math.abs(endX - startX) > 5) {
        // 滑
        if (startY - endY > 50 && pointer != styleLeight - 1) {
          this.upSilde()
          return
          // this.setData({
          //   dynamicIsShow: 'showDynamic'
          // })
        } else if (endY - startY > 50 && pointer !== memberLength + styleLeight - 2) {
          this.downSilde().then(() => resolve())
        }
      } else {
        // 点
        var i = 0
        let index = Number(this.index)
        let ableIndex = this.data.ableIndex
        console.log(index, ableIndex)
        if (!this.index) return
        console.log('1111111111', this.data.ableIndex)
        if (index === ableIndex % styleLeight) {
          console.log('点击第一个')
          return resolve()
        } else {
          console.log('点击了其他')
          let number = index
          while (number < ableIndex) {
            number = number + styleLeight
          }
          if (number > memberLength) return
          console.log(number)
          let p = Promise.resolve()
          let that = this
          for (i; i < number - ableIndex; i++) {
            (function (i) {
              p = p.then(() => that.downSilde()).then(() => {
                console.log('循环中')
                console.log(number - ableIndex - 1)
                console.log(i, 'i')
                if (i >= number - ableIndex - 1) {
                  console.log('出来了')
                  resolve()
                }
                return
              }).catch(err => reject(err))
            })(i)
          }
        }
      }
    })
  },
  upSilde() {
    console.log('向上滑')
    var i = 0
    var temp
    let style = this.data.style
    let pointer = this.data.pointer
    let showMember = this.data.showMember
    let member = this.data.member
    let styleLeight = this.data.styleLeight
    temp = style[style.length - 1]
    i = style.length - 1
    for (i; i > 0; i--) {
      style[i] = style[i - 1]
    }
    style[i] = temp
    showMember[(pointer - styleLeight) % styleLeight] = member[pointer - styleLeight]
    this.setData({
      showMember,
      pointer: pointer - 1,
      ableIndex: this.data.ableIndex - 1,
      style
    }, () => {
      console.log('1111111111', this.data.ableIndex)
    })
  },
  downSilde() {
    return new Promise((resolve, reject) => {
      var i = 0
      var temp
      let style = this.data.style
      let pointer = this.data.pointer
      let showMember = this.data.showMember
      let member = this.data.member
      let styleLeight = this.data.styleLeight
      console.log('向下滑')
      temp = style[0]
      for (i; i < style.length - 1; i++) {
        style[i] = style[i + 1]
      }
      style[i] = temp
      if (!member[pointer]) {
        showMember[pointer % styleLeight] = 0;
      } else {
        showMember[pointer % styleLeight] = member[pointer]
      }
      this.setData({
        showMember,
        pointer: pointer + 1,
        ableIndex: this.data.ableIndex + 1,
        style
      }, () => resolve())
    })
  },
  switchFunctionBar() {
    this.setData({
      functionBarShow: !this.data.functionBarShow
    })
  },
  tap(e) {
    let district = e.mark.district
    if (district) return;
    this.setData({
      dynamicIsShow: false,
      functionBarShow: false,
      showContent: {}
    })
    let playRecord = this.selectComponent('#playRecord')
    playRecord.endSound()

  },
  dynamicDetail(e) {
    let operation = e.mark.operation
    if (operation === "No") return
    let {
      isLike,
      isStore,
      id,
    } = this.data.showContent
    let param = {
      id,
      isLike,
      isStore,
      table:'groupdynamics'
    }
    param = JSON.stringify(param)
    wx.navigateTo({
      url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
    })
  },

  noJoin() {
    this.setData({
      dialogShow: false
    })
  },
  joinGroup() {
    let {
      groupName,
      id: groupId,
      examine,
      introduce
    } = this.data.groupInfo
    let userId = app.userInfo.id
    console.log(groupId)
    app.post(app.Api.joinGroup, {
      groupId,
      groupName,
      userId,
      examine
    }).then(res => {
      app.userInfo = res
      wx.switchTab({
        url: '/pages/home/home',
      })
      // if (examine === 1) {
      //   let tip = '请求1小时后自动失效，可重新选择小组'
      //   common.Tip(tip, '等待审核中')
      if(examine == 0) {
        let tip = '欢迎您，加入这个大家庭'
        common.Tip(tip, '加入成功')
      }

    }).catch(err => err)
  },
  yesJoin() {
    this.joinGroup()
    this.setData({
      dialogShow: false
    })
  },
  completeLike(commenetBarData) {
    let showContent = this.data.showContent
    showContent.isLike = commenetBarData.isLike 
    showContent.likes = commenetBarData.likes 
    this.setData({
      showContent
    })
  },
  completeStore(commenetBarData){
    let showContent = this.data.showContent
    showContent.isStore = commenetBarData.isStore 
    showContent.store = showContent.store
    this.setData({
      showContent
    })
  },
  toLike() {
    let showContent = this.data.showContent
    showContent.isLike = !showContent.isLike
    showContent.isLike?++showContent.likes:--showContent.likes
    this.setData({
      showContent
    },()=> {
      core.operateLike(app.Api.groupdynamicsLike,{
        operate: showContent.isLike,
        relation: {
          userId: app.userInfo.id,
          themeId: showContent.id
        }
      })
    })
  },
  follow() {
    let fansNumber = this.data.groupInfo.fansNumber
    let isFollow = this.data.groupInfo.isFollow 
    this.setData({
      'groupInfo.isFollow': !isFollow,
      'groupInfo.fansNumber': !isFollow?fansNumber + 1:fansNumber - 1
    },()=> {
      core.operateFollow(app.Api.followGroup,{
        operate: this.data.groupInfo.isFollow,
        relation: {
          userId: app.userInfo.id,
          groupId: this.data.groupInfo.id,
        }
      })
    })
    
  },
  goComment() {
    let {
      isLike,
      isStore,
      id
    } = this.data.showContent
    let param = {
      id,
      isLike,
      isStore,
      isComment: true,
      table:'groupdynamics'
    }
    param = JSON.stringify(param)
    wx.navigateTo({
      url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
    })
  },
  goCourse() {
    wx.navigateTo({
      url: `/pages/home/course/course?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  goPuchCard() {
    wx.navigateTo({
      url: `/pages/home/puchCard/puchCard?showGroupId=${this.data.groupInfo.id}`,
    })
  }
})
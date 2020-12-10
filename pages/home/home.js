// pages/home/home.js
let app = getApp()
let common = require('../../assets/tool/common')
let tool = require('../../assets/tool/tool')
let core = require('../../assets/tool/core')
let io = require('../../assets/tool/weapp.socket.io')
let Style = [{
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
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 点击第一个头像后显示光圈
    dynamicIsShow: false,
    // 控制右下角三角show
    tabBarBtnShow: false,
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
    style: JSON.parse(JSON.stringify(Style)),
    isNotData: false,
    styleLeight: 7,
    ableIndex: 1,
    pointer: 0,
    switchIssue: false,
    showMember: [],
    pageSize: 28,
    pageIndex: 1,
    member: [],
    showContent: {},
    showVideo: false,
    homeGuide: false,
    leftGuide: true,
    bottomGuide: true
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    let {
      groupId: myGroupId,
      groupDuty
    } = app.userInfo
    this.setData({
      myId: app.userInfo.id
    })
    this.initSocketEvent()
    this.getGroupInfo(myGroupId)
    this.groupPagingGetGroupdynamics(myGroupId).then(() => {
      this.urlPush()

    })
    if (groupDuty === -1) {
      let tip = '请求1小时后自动失效，可重新选择小组'
      common.Tip(tip, '等待审批')
    }
  },
  initOnMessage(socket) {

    socket.on("message", (from, to, message) => {
      resolve()
      console.log(from, to, message)
      let threas = wx.getStorageSync('threas')
      console.log(threas)
      if (!threas) {
        threas = {}
      }
      if (!threas[from.userId]) {
        threas[from.userId] = {
          userId: from.userId,
          avatarUrl: from.avatarUrl,
          nickName: from.nickName,
          messages: []
        }
      }
      threas[from.userId].messages.push({
        fromId: from.userId,
        toId: to.userId,
        message
      })
      wx.setStorage({
        data: threas,
        key: 'threas',
      })
      return resolve
    })

  },
  initSocketEvent() {
    const socket = (app.socket = io(app.socketUrls.baseUrl))
    this.socket = socket
    socket.on('connect', () => {
      console.log('连接成功')
      let user = {
        userId: app.userInfo.id,
      }
      socket.emit("login", user);
      socket.emit("getmessage");
    })
    socket.on("message", (from, to, message) => {
      console.log('okok')
      for (let key in app.cbObj) {
        app.cbObj[key] && app.cbObj[key](from, to, message)
      }
    })
    app.onMessage('messageMain', (from, to, message) => {
      let threas = wx.getStorageSync('threas')
      console.log('收到', threas)
      if (!threas) {
        threas = {}
      }
      if (!threas[from.userId]) {
        threas[from.userId] = {
          userId: from.userId,
          avatarUrl: from.avatarUrl,
          nickName: from.nickName,
          newNum: 0,
          lastMessage: '',
          messages: []
        }
      }
      threas[from.userId].newNum++
      threas[from.userId].lastMessage = message
      threas[from.userId].messages.push({
        fromId: from.userId,
        toId: to.userId,
        message
      })
      wx.setStorage({
        data: threas,
        key: 'threas',
      })
    })


  },
  groupPagingGetGroupdynamics(groupId) {
    let {
      pointer,
      member
    } = this.data
    return new Promise((resolve, reject) => {
      console.log('groupPagingGetGroupdynamics')
      let pageSize = this.data.pageSize
      let pageIndex = this.data.pageIndex
      app.get(app.Api.groupPagingGetGroupdynamics, {
        pageSize,
        pageIndex,
        groupId,
        userId: app.userInfo.id
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
    let member = this.data.member
    if (member.length >= 5 && member.length < styleLeight) {
      member = member.concat(member)
    }
    for (i; i < styleLeight; i++) {
      showMember.push(member[i])
    }

    if (app.globalData.guide.home) {
      this.getTabBar().setData({
        show: false
      })
      this.setData({
        showMember,
        member,
        pointer: styleLeight - 1,
        homeGuide: app.globalData.guide.home,
        tabBarBtnShow: true
      })
    } else {
      this.setData({
        showMember,
        member,
        showContent: showMember[0],
        pointer: styleLeight - 1,
        dynamicIsShow: member.length ? true : false
      }, () => {
        if (showMember[0].mold === 1) {
          setTimeout(() => {
            this.setData({
              showVideo: true
            })
          }, 500)
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getmoveDistance()

    setTimeout(() => {
      this.socket.emit("getmessage");
    }, 8000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
      // app.getNotice(this, app.userInfo.id)
    }
    console.log('app.switchData.refresh', app.switchData.refresh)
    if (app.switchData.refresh) {
      this.setData({
        dynamicIsShow: false,
        showMember: [],
        pageIndex: 1,
        ableIndex: 1,
        member: [],
        style: JSON.parse(JSON.stringify(Style)),
        isNotData: false,
        showVideo: false,
      }, () => {
        this.groupPagingGetGroupdynamics(this.data.groupInfo.id).then(() => {
          this.urlPush()
        })
      })
      app.switchData.refresh = false
    }
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
  dynamicTouchstart(e) {
    this.dynamicStartY = e.changedTouches[0].clientY
    this.dynamicStartX = e.changedTouches[0].clientX
  },
  dynamicTouchend(e) {
    this.dynamicEndX = e.changedTouches[0].clientX
    this.dynamicEndY = e.changedTouches[0].clientY
    this.dynamicMoveRealize(e).then(() => {
      let {
        ableIndex,
        styleLeight,
        showMember,
      } = this.data
      let memberLeight = this.data.member.length
      let showContent = showMember[(ableIndex - 1) % styleLeight]
      this.setData({
        dynamicIsShow: true,
        showContent
      }, () => {
        if (showContent.mold === 1) {
          setTimeout(() => {
            this.setData({
              showVideo: true
            })
          }, 500)
        }
      })
      console.log('(ableIndex + styleLeight*2 >= memberLeight', ableIndex + styleLeight * 2 >= memberLeight)
      console.log('!this.data.isNotData', !this.data.isNotData)
      if (ableIndex + styleLeight * 2 >= memberLeight && !this.data.isNotData) {
        this.groupPagingGetGroupdynamics(this.data.groupInfo.id)
      }
    })
  },
  dynamicMoveRealize(e) {
    return new Promise((resolve, reject) => {
      let dynamicEndX = this.dynamicEndX
      let dynamicEndY = this.dynamicEndY
      let dynamicStartX = this.dynamicStartX
      let dynamicStartY = this.dynamicStartY
      let pointer = this.data.pointer
      let memberLength = this.data.member.length
      let styleLeight = this.data.styleLeight
      console.log('dynamicEndY', dynamicEndY)
      console.log('dynamicStartY', dynamicStartY)
      console.log('dynamicEndX', dynamicEndX)
      console.log('dynamicStartX', dynamicStartX)
      if (Math.abs(dynamicEndY - dynamicStartY) > 5 || Math.abs(dynamicEndX - dynamicStartX) > 5) {
        if (Math.abs(dynamicEndX - dynamicStartX) > 50) return
        this.setData({
          dynamicIsShow: false
        }, () => {
          setTimeout(() => {
            // 滑
            if (dynamicStartY - dynamicEndY > 50 && pointer != styleLeight - 1) {
              this.upSilde().then(() => resolve())
              return
            } else if (dynamicEndY - dynamicStartY > 50 && pointer !== memberLength + styleLeight - 2) {
              this.downSilde().then(() => resolve())
            }
          }, 210)
        })
      } else {
        this.dynamicDetail(e)
      }
    })
  },
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
        showMember,
      } = this.data
      let memberLeight = this.data.member.length
      let showContent = showMember[(ableIndex - 1) % styleLeight]
      this.setData({
        dynamicIsShow: true,
        showContent
      }, () => {
        if (showContent.mold === 1) {
          setTimeout(() => {
            this.setData({
              showVideo: true
            })
          }, 500)
        }
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
          this.upSilde().then(() => resolve())
          return
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
    return new Promise((resolve, reject) => {
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
      console.log(pointer, 'pointerpointerpointerpointerpointerpointer')
      showMember[(pointer - styleLeight - 1) % styleLeight] = member[pointer - styleLeight - 1]
      this.setData({
        showMember,
        pointer: pointer - 1,
        ableIndex: this.data.ableIndex - 1,
        style
      }, () => resolve())
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
      if (member.length >= 5 && pointer + 1 >= member.length) {
        console.log('进来了')
        this.setData({
          member: member.concat(member)
        })
      }

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
      }, () => {
        console.log('pointerpointerpointer', pointer)

        resolve()
      })
    })
  },
  // 拖动过程中触发的事件
  handleMovable(event) {
    let y = event.detail.y
    //  
    let translateZ = 1140 + 2.5 * y
    let rotateX = 50 - y / 28;
    this.setData({
      translateZ,
      rotateX
    })
  },

  switchIssue() {
    if (app.userInfo.groupDuty === -1) {
      common.Tip('你还未成为该小组成员，暂不能发布动态')
    } else {
      this.setData({
        switchIssue: !this.data.switchIssue
      })
    }

  },
  switchFunctionBar() {
    this.setData({
      functionBarShow: !this.data.functionBarShow
    })
  },
  putIssueBtn() {
    this.setData({
      switchIssue: false,
    })
  },

  tap(e) {
    let district = e.mark.district
    if (district) return;

    this.setData({
      dynamicIsShow: false,
      switchIssue: false,
      functionBarShow: false,
      tabBarBtnShow: true,
      showContent: {}
    })
    let playRecord = this.selectComponent('#playRecord')
    playRecord.endSound()
    this.getTabBar().setData({
      show: false
    })
    console.log(e)
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
      table: 'groupdynamics'
    }
    param = JSON.stringify(param)
    wx.navigateTo({
      url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
    })
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
      table: 'groupdynamics'
    }
    param = JSON.stringify(param)
    wx.navigateTo({
      url: `/pages/home/dynamicDetail/dynamicDetail?param=${param}`
    })
  },
  follow() {
    let fansNumber = this.data.groupInfo.fansNumber
    let isFollow = this.data.groupInfo.isFollow
    this.setData({
      'groupInfo.isFollow': !isFollow,
      'groupInfo.fansNumber': !isFollow ? fansNumber + 1 : fansNumber - 1
    }, () => {
      core.operateFollow(app.Api.followGroup, {
        operate: this.data.groupInfo.isFollow,
        relation: {
          userId: app.userInfo.id,
          groupId: this.data.groupInfo.id,
        }
      })
    })

  },
  goCourse() {
    wx.navigateTo({
      url: `/pages/home/course/course?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  goMassManagement() {
    wx.navigateTo({
      url: '/pages/home/massManagement/massManagement',
    })
  },
  goUploadVideo() {
    common.chooseVideo().then(res => {
      let tempFilePath = JSON.stringify(res.tempFilePath)
      wx.navigateTo({
        url: `/pages/home/uploadVideo/uploadVideo?tempFilePath=${tempFilePath}`,
      })
    })

  },

  goIssueImg() {
    common.chooseImage(9).then(res => {
      let tempFilePaths = JSON.stringify(res.tempFilePaths)
      wx.navigateTo({
        url: `/pages/home/issueImg/issueImg?tempFilePaths=${tempFilePaths}`,
      })
    })
  },
  goUploadVoice() {
    wx.navigateTo({
      url: '/pages/home/uploadVoice/uploadVoice',
    })
  },
  goPuchCard() {
    wx.navigateTo({
      url: `/pages/home/puchCard/puchCard?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  toLike() {
    let showContent = this.data.showContent
    showContent.isLike = !showContent.isLike
    showContent.isLike ? ++showContent.likes : --showContent.likes
    this.setData({
      showContent
    }, () => {
      core.operateLike(app.Api.groupdynamicsLike, {
        operate: showContent.isLike,
        relation: {
          userId: app.userInfo.id,
          themeId: showContent.id
        },
        extra: {
          otherId: showContent.userId,
          avatarUrl: app.userInfo.avatarUrl,
          nickName: app.userInfo.nickName,
          themeTitle: showContent.introduce
        }
      })
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
  completeStore(commenetBarData) {
    let showContent = this.data.showContent
    showContent.isStore = commenetBarData.isStore
    showContent.store = showContent.store
    this.setData({
      showContent
    })
  },
  delete(e) {
    common.Tip('是否删除该动态', '提示', '确认', true).then(res => {
      if (res.confirm) {
        console.log('用户点击确定')
        this.deleteDynamic(e)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    })
  },
  deleteDynamic(e) {
    console.log(Style, '1111111111111')
    common.showLoading('删除中')
    let {
      showMember,
      member,
      styleLeight,
      ableIndex,
      pointer
    } = this.data

    // showMember(ableIndex - 1) % styleLeight]
    app.post(app.Api.groupdynamicsDelete, {
      tableName: 'groupdynamics',
      id: this.data.showContent.id
    }, {
      loading: false
    }).then(res => {
      if (res.affectedRows) {
        // showMember.splice(ableIndex - 1, 1)
        // member.splice(pointer - 6, 1)
        // common.Toast('已删除')
        this.setData({
          dynamicIsShow: false,
          showMember: [],
          pageIndex: 1,
          ableIndex: 1,
          member: [],
          style: JSON.parse(JSON.stringify(Style)),
          isNotData: false,
          showVideo: false
        }, () => {
          this.groupPagingGetGroupdynamics(this.data.groupInfo.id).then(() => {
            this.urlPush()
          })
        })

        // return

        // showMember[pointer % styleLeight] = member[pointer]
        // this.setData({
        //   showMember,
        //   member,
        //   showContent: showMember[(ableIndex - 1) % styleLeight]
        // })
        common.Toast('已删除')
      }
    })
  },
  stopBubbling() {
    return
  },
  click(e) {
    let click = e.currentTarget.dataset.click
    if (click === 'leftGuide') {
      this.setData({
        leftGuide: false,
        functionBarShow: true
      })
    } else {
      this.getTabBar().setData({
        show: true
      })
      this.setData({
        bottomGuide: false,
        tabBarBtnShow: false
      })
    }
    if (!this.data.leftGuide && !this.data.bottomGuide) {
      const showMember = this.data.showMember
      let member = this.data.member
      let guide = wx.getStorageSync('guide')
      guide.home = false
      wx.setStorageSync('guide', guide)
      this.setData({
        homeGuide: false,
      },()=> {
        setTimeout(() => {
          this.setData({
            functionBarShow: false,
            showContent: showMember[0],
            dynamicIsShow: member.length ? true : false
          })
        }, 1000);
      })
    }

  }
})
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
    qiniuUrl: app.qiniuUrl,
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
        bottom: 36,
        scaleX: 0.8,
        scaleY: 0.6,
        opacity: 1,
      },
      {
        index: 5,
        bottom: 8,
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
    SM_UpPointer: 0,
    SM_DownPointer: 0,
    MB_UpPointer: 0,
    MB_DownPointer: 0,
    MB_Index: 0,
    showMember: [],
    pageSize: 28,
    pageIndex: 1,
    reqFirst: true,
    isLoop: false,
    lessMember: false,
    member: [],
    showContent: {},
    // list: [{
    //   name: '分享',
    //   open_type: 'share',
    //   functionName: ''
    // }, {
    //   name: '收藏',
    //   open_type: '',
    //   functionName: 'handleStore'
    // }, {
    //   name: '举报',
    //   open_type: '',
    //   functionName: 'handleReport'
    // }],
    showVideo: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let showGroupId = options.showGroupId
    this.getGroupInfo(showGroupId)
    this.groupPagingGetGroupdynamics(showGroupId).then(() => {
      this.urlPush()
    })
  },
  // 视频加载完成
  loadedmetadata(e) {
    this.setData({
      'showContent.videoLoad': true
    })
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
      userId: app.userInfo.id,
      visit: true
    }, {
      loading: false
    }).then((res) => {
      if (res === null) {
        common.Tip('很抱歉，该小组已被解散').then(() => {
          wx.navigateBack()
        })
        return
      }
      let groupNameTop, groupNamebuttom
      if (res.groupName.length > 7) {
        groupNameTop = res.groupName.substr(0, 7)
        groupNamebuttom = res.groupName.substr(7)
      } else {
        groupNameTop = res.groupName
      }
      this.setData({
        groupInfo: res,
        groupNameTop,
        groupNamebuttom
      })
      // app.groupInfo = res
    }).catch(err => err)
  },


  urlPush() {
    let i = 0
    const showMember = this.data.showMember
    const styleLeight = this.data.styleLeight
    let member = this.data.member
    let SM_UpPointer = this.data.SM_UpPointer
    let SM_DownPointer = this.data.SM_DownPointer
    let MB_UpPointer = this.data.MB_UpPointer
    let MB_DownPointer = this.data.MB_DownPointer
    if (member.length < styleLeight - 2) {
      this.data.lessMember = true
    }
    if (member.length - 5 <= this.data.MB_Index) {
      // 但倒数第一个出现时开启循环
      if (!this.data.isLoop && !this.data.lessMember) {
        // wx.showToast({
        //   title: '为您开启循环模式',
        //   icon: 'none',
        // })
        this.data.isLoop = true
      }
    }
    for (i; i < styleLeight - 1; i++) {
      if (this.data.lessMember) {
        showMember.push(member[i])
        MB_DownPointer = MB_DownPointer + 1
      } else {
        showMember.push(member[i % member.length])
        MB_DownPointer = (MB_DownPointer + 1) % member.length
      }
    }
    if (!this.data.lessMember) {
      showMember[i] = member[member.length - 1]
    } else {
      showMember[i] = null
    }
    SM_UpPointer = i - 1
    MB_UpPointer = member.length - 2
    SM_DownPointer = i
    this.setData({
      showMember,
      member,
      showContent: showMember[0],
      showContent: showMember[0],
      SM_UpPointer,
      SM_DownPointer,
      MB_DownPointer,
      MB_UpPointer,
      dynamicIsShow: member.length ? true : false
    }, () => {
      if (showMember[0] && showMember[0].mold === 1) {
        setTimeout(() => {
          this.setData({
            showVideo: true
          })
        }, 500)
      }
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.stopPlayRecord()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  handlerGobackClick: app.handlerGobackClick,
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
        MB_Index,
        isNotData
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
      if (MB_Index + styleLeight * 2 >= memberLeight && !isNotData) {
        this.groupPagingGetGroupdynamics(this.data.groupInfo.id)
      }
    })
  },
  // 动态显示时-触碰结果
  dynamicMoveRealize(e) {
    return new Promise((resolve, reject) => {
      let dynamicEndX = this.dynamicEndX
      let dynamicEndY = this.dynamicEndY
      let dynamicStartX = this.dynamicStartX
      let dynamicStartY = this.dynamicStartY
      let memberLength = this.data.member.length
      let direction = tool.GetSlideDirection(dynamicStartX, dynamicStartY, dynamicEndX, dynamicEndY)
      if (direction === 1 || direction === 2) {
        this.setData({
          dynamicIsShow: false
        }, () => {
          setTimeout(() => {
            this.stopPlayRecord()
            // 滑
            if (direction === 1) {
              if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == 0) {
                return
              }
              this.upSilde().then(() => resolve())
              return
            } else if (direction === 2) {
              if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == memberLength - 1) {
                return
              }
              this.downSilde().then(() => resolve())
            }
          }, 210)
        })
      } else if (direction === 0) {
        this.dynamicDetail(e)
      }
    })
  },
  touchstart(e) {
    this.tap(e)
    this.startY = e.changedTouches[0].clientY
    this.startX = e.changedTouches[0].clientX
    this.index = e.mark.index
  },
  touchend(e) {
    this.endX = e.changedTouches[0].clientX
    this.endY = e.changedTouches[0].clientY
    this.moveRealize().then(() => {
      let {
        ableIndex,
        styleLeight,
        showMember,
        MB_Index,
        isNotData
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
              showVideo: true,
            })
          }, 500)
        }
      })
      if (MB_Index + styleLeight * 2 >= memberLeight && !isNotData) {
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
      let memberLength = this.data.member.length
      let styleLeight = this.data.styleLeight
      if (Math.abs(endY - startY) > 5 || Math.abs(endX - startX) > 5) {
        // 滑
        if (startY - endY > 50) {
          if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == 0) {
            return
          }
          this.upSilde().then(() => resolve())
          return
        } else if (endY - startY > 50) {
          if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == memberLength - 1) {
            return
          }
          this.downSilde().then(() => resolve())
        }
      } else {
        // 点
        var i = 0
        let index = Number(this.index)
        let ableIndex = this.data.ableIndex
        console.log(index, ableIndex)
        if (!this.index) return
        if (index === ableIndex % styleLeight) {
          console.log('点击第一个')
          return resolve()
        } else {
          console.log('点击了其他')
          let number = index
          while (number < ableIndex) {
            number = number + styleLeight
          }
          // 超过不让点,改
          // if (number > memberLength) return
          // console.log(number)
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
      let {
        style,
        showMember,
        member,
        styleLeight,
        SM_UpPointer,
        SM_DownPointer,
        MB_UpPointer,
        MB_DownPointer
      } = this.data
      temp = style[style.length - 1]
      i = style.length - 1
      for (i; i > 0; i--) {
        style[i] = style[i - 1]
      }
      style[i] = temp
      showMember[SM_UpPointer] = member[MB_UpPointer]
      let ableIndex = this.data.ableIndex
      if (ableIndex == 1) {
        ableIndex = styleLeight + 1
      }
      this.data.MB_Index = this.data.MB_Index - 1
      this.setData({
        showMember,
        SM_DownPointer: (SM_DownPointer - 1 == -1) ? styleLeight - 1 : (SM_DownPointer - 1) % styleLeight,
        SM_UpPointer: (SM_UpPointer - 1 == -1) ? styleLeight - 1 : (SM_UpPointer - 1) % styleLeight,
        MB_DownPointer: (MB_DownPointer - 1 == -1) ? member.length - 1 : (MB_DownPointer - 1) % member.length,
        MB_UpPointer: (MB_UpPointer - 1 == -1) ? member.length - 1 : (MB_UpPointer - 1) % member.length,
        ableIndex: ableIndex - 1,
        style
      }, () => resolve())
    })
  },
  // 下滑实现
  downSilde() {
    return new Promise((resolve, reject) => {
      var i = 0
      var temp
      let {
        style,
        showMember,
        member,
        styleLeight,
        SM_UpPointer,
        SM_DownPointer,
        MB_UpPointer,
        MB_DownPointer
      } = this.data
      console.log('向下滑')
      temp = style[0]
      for (i; i < style.length - 1; i++) {
        style[i] = style[i + 1]
      }
      style[i] = temp
      if (member.length - 5 <= this.data.MB_Index) {
        if (!this.data.isLoop && !this.data.lessMember) {
          wx.showToast({
            title: '为您开启循环模式',
            icon: 'none',
          })
          this.data.isLoop = true
        }
      }
      if (this.data.lessMember) {
        showMember[SM_DownPointer] = 0
      } else {
        showMember[SM_DownPointer] = member[MB_DownPointer]
      }
      let ableIndex = this.data.ableIndex
      if (ableIndex == styleLeight) {
        ableIndex = 0
      }
      this.data.MB_Index = this.data.MB_Index + 1
      this.setData({
        showMember,
        SM_DownPointer: (SM_DownPointer + 1) % styleLeight,
        SM_UpPointer: (SM_UpPointer + 1) % styleLeight,
        MB_DownPointer: (MB_DownPointer + 1) % member.length,
        MB_UpPointer: (MB_UpPointer + 1) % member.length,
        ableIndex: ableIndex + 1,
        style
      }, () => {
        resolve()
      })
    })
  },
  switchFunctionBar() {
    this.setData({
      functionBarShow: !this.data.functionBarShow,
      dynamicIsShow: false,
    })
    this.stopPlayRecord()
  },
  tap(e) {
    let district = e.mark.district
    if (district) return;
    this.setData({
      dynamicIsShow: false,
      functionBarShow: false,
      showContent: {}
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
          themeId: showContent.id,
          nickName: app.userInfo.nickName,
        },
        extra: {
          otherId: showContent.userId,
          themeTitle: showContent.introduce
        }
      })
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
  goCourse() {
    wx.navigateTo({
      url: `/pages/home/course/course?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  goPuchCard() {
    wx.navigateTo({
      url: `/pages/home/puchCard/puchCard?showGroupId=${this.data.groupInfo.id}`,
    })
  },
  showMenu(e) {
    if (app.userInfo.id === this.data.showContent.userId) {
      let list = this.data.list
      list[2] = {
        name: '删除',
        open_type: '',
        functionName: 'hadleDelete'
      }
      this.setData({
        list
      }, () => {
        this.selectComponent('#menu').show();
      })

    } else {
      this.selectComponent('#menu').show();
    }
  },
  handleStore() {
    let showContent = this.data.showContent
    core.operateStore(app.Api['groupdynamicsStore'], {
      operate: true,
      relation: {
        userId: app.userInfo.id,
        themeId: showContent.id
      },
    }).then(res => {
      if (res.modify) {
        common.Toast('收藏成功')
      } else {
        common.Toast('动态已存在')
      }
    })
  },
  handleReport() {
    core.handleReport()
  },
  hadleDelete(e) {
    common.Tip('是否删除该动态', '提示', '确认', true).then(res => {
      if (res.confirm) {
        console.log('用户点击确定')
        this.deleteDynamic(e)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    })
  },
  stopPlayRecord() {
    let playRecord = this.selectComponent('#playRecord')
    playRecord && playRecord.endSound()
  },
  goMassManagement() {
    let groupInfo = JSON.stringify(this.data.groupInfo)
    wx.navigateTo({
      url: `/pages/home/massManagement/massManagement?groupInfo=${groupInfo}`,
    })
  },
})
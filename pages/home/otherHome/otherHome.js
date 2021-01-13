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
        wx.showToast({
          title: '为您开启循环模式',
          icon: 'none',
        })
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
    let playRecord = this.selectComponent('#playRecord')
    playRecord.endSound()
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
  dynamicMoveRealize(e) {
    return new Promise((resolve, reject) => {
      let dynamicEndX = this.dynamicEndX
      let dynamicEndY = this.dynamicEndY
      let dynamicStartX = this.dynamicStartX
      let dynamicStartY = this.dynamicStartY
      let memberLength = this.data.member.length
      if (Math.abs(dynamicEndY - dynamicStartY) > 5 || Math.abs(dynamicEndX - dynamicStartX) > 5) {
        if (Math.abs(dynamicEndX - dynamicStartX) > 50) return
        this.setData({
          dynamicIsShow: false
        }, () => {
          setTimeout(() => {
            // 滑
            if (dynamicStartY - dynamicEndY > 50) {
              if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == 0) {
                return
              }
              this.upSilde().then(() => resolve())
              return
            } else if (dynamicEndY - dynamicStartY > 50) {
              if ((this.data.lessMember || !this.data.isLoop) && this.data.MB_Index == memberLength - 1) {
                return
              }
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
          this.upSilde()
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
      table: 'groupdynamics'
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
      if (examine == 0) {
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
  }
})
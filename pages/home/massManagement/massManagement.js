// pages/home/massManagement/massManagement.js
const app = getApp()
const tool = require('../../../assets/tool/tool.js')
const common = require('../../../assets/tool/common')
const upload = require('../../../assets/request/upload')
const authorize = require('../../../assets/tool/authorize')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.qiniuUrl,
    // 去除上面导航栏，剩余的高度
    excludeHeight: 0,
    tempFilePaths: [],
    groupInfo: [],
    describe: '',
    privates: 0,
    examine: 0,
    groupDuty: 0,
    newNumber: 0,
    posterUrl: '',
    showQRcode: false,
    msgAuthorizationShow: false,
    requestId: [app.InfoId.joinGroup]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取去除上面导航栏，剩余的高度
    tool.navExcludeHeight(this)
    // this.getNewNumber()
    // 将小组信息存储到data
    if (options.groupInfo) {
      let groupInfo = JSON.parse(options.groupInfo)
      this.setData({
        groupInfo,
        groupDuty: 3,
        tempFilePaths: [groupInfo.groupLogo]
      })
    } else {
      this.setData({
        groupInfo: app.groupInfo,
        privates: app.groupInfo.privates,
        examine: app.groupInfo.examine,
        tempFilePaths: [app.groupInfo.groupLogo],
        describe: app.groupInfo.introduce,
        groupDuty: app.userInfo.groupDuty
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getCanvasPoster()
  },
  getCanvasPoster() {
    wx.createSelectorQuery()
      .select('#canvasPoster')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        this.width = res[0].width
        this.height = res[0].height
        this.rpx = wx.getSystemInfoSync().windowWidth / 375
        this.ctx = wx.createCanvasContext('canvasPoster')
      })
  },
  canvasPoster(paths) {
    return new Promise((resolve, reject) => {
      let ctx = this.ctx
      ctx.beginPath()
      ctx.setFillStyle('#000000')
      ctx.rect(0, 0, this.width, this.height)
      ctx.fill()
      ctx.beginPath()
      ctx.setFillStyle('#ffffff')
      ctx.rect(0, 0.7815 * this.height, this.width, this.height)
      ctx.fill()
      ctx.drawImage(paths[0].path, 10, 10, this.width - 20, this.width - 20)
      const grd = ctx.createLinearGradient(0, 0.7815 * this.height, 0, 0)
      grd.addColorStop(0, 'rgba(0,0,0,1)')
      grd.addColorStop(0.4, 'rgba(0,0,0,0.5)')
      grd.addColorStop(0.6, 'rgba(0,0,0,0)')
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.setFillStyle(grd)
      ctx.fillRect(0, 0, this.width, 0.7815 * this.height)
      ctx.setFillStyle('#ffffff')
      ctx.setFontSize(19)
      ctx.fillText(this.data.groupInfo.groupName, 0.04466 * this.width, 0.64044 * this.height)
      let introduce = this.data.groupInfo.introduce
      if (introduce) {
        ctx.setFillStyle('#B7B7B7')
        ctx.setFontSize(12)
        if (introduce.length <= 16) {
          ctx.fillText(introduce, 0.04466 * this.width, 0.69064 * this.height)
        } else {
          ctx.fillText(introduce.slice(0, 16), 0.04466 * this.width, 0.69064 * this.height)
          let str = introduce.slice(16)
          if (str.length > 14) {
            str = str.slice(0, 14) + '…'
          }
          ctx.fillText(str, 0.04466 * this.width, 0.69064 * this.height + 16)
        }
      }
      ctx.setFontSize(16)
      ctx.setFillStyle('#7C7C7C')
      ctx.fillText('长按识别/手机扫码进入小组：', 0.04466 * this.width, 0.87788 * this.height)
      ctx.fillText('期待你的加入~', 0.04466 * this.width, 0.87788 * this.height + 24)
      ctx.drawImage(paths[1].path, 0.724215 * this.width, 0.79863 * this.height, 0.229213 * this.width, 0.229213 * this.width)
      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          canvasId: 'canvasPoster',
          x: 0,
          y: 0,
          fileType: 'png',
          width: this.width,
          height: this.height,
          quality: 1,
          success: (res) => resolve(res),
          fail: err => reject(err)
        });
      })
    })
  },
  getUnlimited() {
    return new Promise((resolve, reject) => {
      app.get(app.Api.getUnlimited, {
        groupId: this.data.groupInfo.id
      }, {
        loading: false
      }).then(res => {
        resolve(res)
        // this.setData({
        //   QRcode: res,
        //   showQRcode: true
        // })
      })
    })
  },
  cancel(e) {
    if (e.mark.stop) return
    this.setData({
      showQRcode: false
    })
  },
  previewPoster() {
    common.previewImage([this.data.posterUrl])
  },
  generate() {
    wx.showLoading({
      title: '生成中...',
    })
    this.getImgPath().then((paths) => {
      this.canvasPoster(paths).then((res) => {
        console.log(res);
        this.setData({
          posterUrl: res.tempFilePath,
          showQRcode: true
        })
        wx.hideLoading()
      })
    })
  },
  getImgPath() {
    return new Promise((resolve, reject) => {
      this.getUnlimited().then(async (QRcode) => {
        console.log(this.data.groupInfo.groupLogo);
        let p1 = wx.getImageInfo({
          src: this.data.groupInfo.groupLogo
        })
        var reg = new RegExp('^data:image/jpeg;base64,', 'g');
        QRcode = QRcode.replace(reg, '');
        let fsm = wx.getFileSystemManager();
        let filePath = wx.env.USER_DATA_PATH + '/QRcode.jpeg';
        fsm.writeFileSync(filePath, QRcode, 'base64')
        let p2 = wx.getImageInfo({
          src: filePath
        })
        Promise.all([p1, p2]).then(result => {
          resolve(result)
        }).catch(err => {
          reject(err)
          console.log(err)
        })
      })
    })
  },

  getNewNumber() {
    app.get(app.Api.newNumber, {
      groupId: app.groupInfo.id
    }, {
      loading: false
    }).then(res => {
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
  // 上传图片
  uploadImg(tempImgParhs) {
    return new Promise((resolve, reject) => {
      let option = {
          userId: app.userInfo.id,
          type: 'image',
          module: 'groups'
        },
        conf = {
          loading: false,
          toast: false
        }
      upload.uploadManyImg(app.Api.uploadImg, tempImgParhs, option, conf).then(res => resolve(res)).catch(err => reject(err))
    })
  },
  save: async function () {
    console.log(1);
    const params = await this.validate()
    if (params) {
      if (this.tempFilePaths) {
        let tempFilePaths = await this.uploadImg(this.data.tempFilePaths)
        params.groupLogo = tempFilePaths[0]
      }
      let modifyResult = await this.modifyGroup(params)

      modifyResult.myGrouList = app.groupInfo.myGrouList
      app.groupInfo = modifyResult
      if (modifyResult) {
        common.Toast('已保存', 1500, 'success')
        app.switchData.isModifyGroup = true
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)

      } else {
        common.Toast('保存失败,请稍后重试')
      }
    } else {
      common.Toast('已保存', 1500, 'success')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
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
    return {
      title: `"${this.data.groupInfo.groupName}"邀请您加入！`,
      path: `/pages/home/welcome/welcome?groupId=${this.data.groupInfo.id}`,
      imageUrl: this.data.posterUrl
    }
  },
  handlerGobackClick: app.handlerGobackClick,
  // 选择图片
  chooseGroupLogo() {
    // {isCompress:false}
    common.chooseImage(1).then(res => {
      wx.createSelectorQuery()
        .select('#canvasLogo')
        .fields({
          node: true,
          size: true,
        })
        .exec(this.canvasLogo.bind(this))
      this.tempFilePaths = res.tempFilePaths
      // this.setData({
      //   tempUrls: res.tempFilePaths
      // })
    })
  },

  canvasLogo(res) {

    const width = res[0].width
    const height = res[0].height
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // 画大圆
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2, -Math.PI / 6, 5 * Math.PI / 3)
    // ctx.stroke();
    // A点
    let radius = width / 2
    let Ax = radius + radius * Math.sin(Math.PI / 6)
    let Ay = radius - radius * Math.cos(Math.PI / 6)
    let Bx = radius + radius * Math.cos(Math.PI / 6)
    let By = radius - radius * Math.sin(Math.PI / 6)
    let Cx = (Bx - Ax) / 2 + Ax
    let Cy = (By - Ay) / 2 + Ay
    let Cradius = Math.sqrt((Bx - Ax) ** 2 + (By - Ay) ** 2) / 2
    let horn = Math.asin((By - Cy) / Cradius)
    ctx.lineTo(Ax, Ay)
    ctx.arc(Cx, Cy, Cradius, horn + Math.PI, horn, true)
    ctx.closePath()
    // ctx.stroke();
    let logo = canvas.createImage()
    logo.src = this.tempFilePaths[0]
    logo.onload = (res) => {
      wx.getImageInfo({
        src: this.tempFilePaths[0],
        success: imgInfo => {
          console.log(imgInfo, 'imgInfo')
          let originWh
          if (imgInfo.height > imgInfo.width) {
            originWh = imgInfo.width
            ctx.clip()
            ctx.drawImage(logo, 0, (imgInfo.height - imgInfo.width) / 2, originWh, originWh, 0, 0, width, height)
            wx.canvasToTempFilePath({
              canvas,
              width,
              height,
              destWidth: width,
              destHeight: height,
              success: res => {
                console.log(res.tempFilePath)
                this.setData({
                  tempFilePaths: [res.tempFilePath]
                })
              }
            })
          } else {
            originWh = imgInfo.height
            ctx.clip()
            ctx.drawImage(logo, (imgInfo.width - imgInfo.height) / 2, 0, originWh, originWh, 0, 0, width, height)
            wx.canvasToTempFilePath({
              canvas,
              width,
              height,
              destWidth: width,
              destHeight: height,
              success: res => {
                console.log(res.tempFilePath)
                this.setData({
                  tempFilePaths: [res.tempFilePath]
                })
              }
            })
          }
        }
      })
    }
  },
  previewImage() {
    common.previewImage(this.data.tempFilePaths)
  },
  goMassManagement() {
    wx.navigateTo({
      url: '/pages/home/massManagement/personnelManage/personnelManage',
    })
  },
  async changeExamine(event) {
    if (Number(event.detail.value)) {
      authorize.newSubscription(this.data.requestId).then((res) => {
        wx.hideLoading()
        if (res.type === 1) {
          this.setData({
            msgAuthorizationShow: true
          })
        }
      })
    }
    this.setData({
      examine: Number(event.detail.value)
    })
  },
  completeMsgAuthorization() {
    this.setData({
      msgAuthorizationShow: false
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
          if (res.result === 'ok') {
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
  },
  savePoster() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterUrl,
      success(res) {
        common.Toast('已保存到您的相册', 1500, 'success')
      },
      fail() {
        common.Toast('保存失败，请授权保存图片权限')
      }
    })
  },
  stopMove() {
    return
  }
})
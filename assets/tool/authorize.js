// 获取定位位置
function getLocation(callback) {
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userLocation']) {
        // 没有授权过进入授权
        wx.authorize({
          scope: 'scope.userLocation',
          success() {
            // 用户点击同意
            wxGetLocation(callback)
          },
          fail() {
            callback({
              warning: true,
              msg: '用户拒绝位置信息授权'
            })
          }
        })
      } else {
        console.log('已授权过直接获取')
        wxGetLocation(callback)
      }
    },
    fail(err) {
      callback(err || {
        err: true,
        msg: '获取用户的当前设置失败'
      })
    }
  })

}

function wxGetLocation(callback) {
  wx.showLoading({
    title: '定位中',
  })
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      res.success = true
      callback(res)
    },
    fail(err) {
      callback(err || {
        err: true,
        msg: '微信获取位置失败'
      })
    }
  })
}
// 获取用户信息
// function isAuthorUserInfo() {

//   wx.getSetting({
//     success(res) {
//       if (res.authSetting['scope.userInfo']) {

//       } else {
//       }
//     }
//   })
// }

module.exports = {
  getLocation: getLocation,
  // getUserInfo: getUserInfo
}
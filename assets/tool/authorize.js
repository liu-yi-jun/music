const common = require('../../assets/tool/common')
const InfoName = require('../../assets/request/config').InfoName
const tool = require('../../assets/tool/tool')
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
async function isAuthorUserInfo() {
  return await new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权')
          return resolve(true)
        } else {
          console.log('未授权')
          return resolve(false)
        }
      }
    })
  })
}
async function authSettingRecord() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: (success) => {
              resolve(success)
            },
            fail: (err) => {
              reject(err)
              common.Tip('请点击右上角“•••”，在设置中打开麦克风权限')
            }
          })
        } else {
          resolve()
        }
      }
    })
  })
}

// 信息订阅
function infoSubscribe(tmplIds) {
  return new Promise((resolve, reject) => {
    if (!tmplIds || !tmplIds.length) return resolve()
    wx.requestSubscribeMessage({
      tmplIds,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function isSubscription() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        resolve(res.subscriptionsSetting)
      },
      fail: err => reject(err)
    })
  })
}
// 有需要的权限，则传参。不传参则获取已经总是的子权限次数
function alwaysSubscription(requestId = []) {
  return new Promise(async (resolve, reject) => {
    let subscriptionsSetting = await isSubscription()
    if (!subscriptionsSetting.mainSwitch) {
      if (requestId.length) {
        common.Tip('请点击右上角“•••”，在设置中开启订阅消息权限').then(result => {
          return resolve('主开关被关闭')
        })
      } else {
        return resolve('主开关被关闭')
      }

    } else {
      if (subscriptionsSetting.itemSettings) {
        //  勾选了总是
        if (requestId.length) {
          //需要这个子权限
          // 已授权的/不存在：说明重来没有获取过，或者是一次性的
          let rejectId = []
          let needId = []
          requestId.forEach(item => {
            for (let key in subscriptionsSetting.itemSettings) {
              if (String(key) === item && subscriptionsSetting.itemSettings[key] === "reject") {
                return rejectId.push(key + '')
              }
            }
            if (rejectId[rejectId.length - 1] !== item) {
              needId.push(item + '')
            }
          })
          infoSubscribe(needId).then(res => {
            // 已拒绝的,弹出提示
            for (let key in res) {
              if (res[key] === 'reject') {
                rejectId.push(key + '')
              }
            }
            let InfoList = ''
            rejectId.forEach(item => {
              console.log(item);
              !InfoList ? (InfoList = InfoName[item]) : (InfoList = InfoList + '、' + InfoName[item])
            })
            console.log(InfoList);
            if (InfoList) {
              common.Tip(`“${InfoList}”通知授权失败，将无法进行消息推送，如果之前勾选过“总是保持以上选择,不再询问”，将不会再弹出相应的授权请求，需要时请自行点击右上角“•••”，在设置的订阅消息中开启`).then(result => {
                resolve({
                  msg: '触发所有子权限授权',
                  res
                })
              })
              return
            }
            console.log('rejectId = ', rejectId, 'needId = ', needId);
            resolve({
              msg: '增加已授权子权限次数 || 不存在弹出授权',
              res
            })
          }).catch(err => {
            // 其他错误
            reject(err)
          })
        } else {
          // 获取已经勾选了总是的子权限,增加次数
          let gainId = []
          for (let key in subscriptionsSetting.itemSettings) {
            if (subscriptionsSetting.itemSettings[key] === "accept") {
              gainId.push(key + '')
            }
          }

          if (gainId.length > 3) {
           
            let random = tool.randomNumber(0, gainId.length - 1)
            gainId = gainId.concat(gainId)
            let newGainId = gainId.slice(random, random + 3);
            gainId = newGainId
          }
          console.log(gainId);
          infoSubscribe(gainId).then(res => {                                                                               
            resolve({
              msg: '增加已授权子权限次数',
              res
            })
          }).catch(err => {
            // 其他错误
            reject(err)
          })
        }
      } else {
        //  没有勾选总是
        if (requestId.length) {
          infoSubscribe(requestId).then(res => {
            // let rejectId = []
            // for (let key in res) {
            //   if (res[key] === 'reject') {
            //     rejectId.push(key + '')
            //   }
            // }
            // let InfoList = ''
            // rejectId.forEach(item => {
            //   console.log(item);
            //   !InfoList ? (InfoList = InfoName[item]) : (InfoList = InfoList + '、' + InfoName[item])
            // })
            // if (InfoList) {
            //   common.Tip(`${InfoList}通知授权失败，将无法进行消息推送，需要时点击右上角“•••”，在设置的订阅消息中开启`).then(result => {
            //     resolve({
            //       active: true,
            //       msg: '触发所有子权限授权',
            //       res
            //     })
            //   })
            //   return
            // }
            resolve({
              msg: '触发所有子权限授权',
              res
            })
          }).catch(err => {
            // 其他错误
            reject(err)
          })
        } else {
          resolve('不做任何动作')
        }
      }
    }

  })

}



module.exports = {
  getLocation: getLocation,
  isAuthorUserInfo: isAuthorUserInfo,
  authSettingRecord: authSettingRecord,
  infoSubscribe: infoSubscribe,
  isSubscription: isSubscription,
  alwaysSubscription: alwaysSubscription
}
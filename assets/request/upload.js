    //一张或多张图片上传
    function uploadManyImg(url, tempFilePaths, option, conf) {
      return new Promise((resolve, reject) => {
        let imgUrls = []
        if(!tempFilePaths.length) resolve(tempFilePaths)
        let p = Promise.resolve()
        tempFilePaths.forEach((item, index) => {
          p = p.then(() => uploadFile(url, item, option, conf)).then(res => {
            imgUrls.push(res)
            if (tempFilePaths.length === index + 1) {
              resolve(imgUrls)
            }
            return
          }).catch(err => reject(err))
        });
      })
    }
    /**
     * 上传图片、视频、音频
     * @param { String } url  上传资源的路径
     * @param { Number } tempFilePath  资源本地路径tempFilePath
     * @param { object } option {
     *  { Number } id  用户的id,用来创建存储路径
     *  { String } type 'image','video','voice'
     *  { String } module  要上传图片属于哪个功能模块，用来创建存储路径
     * }
     * @param { object } conf {
     * { Array || Boolean } loading 显示加载，自定义文字用数组，取消加载用false
     * { Array || Boolean } toast 服务器有返回成功或者错误是否提示,如果是请求错误的那么还是会提示
     * }
     */
    function uploadFile(url, tempFilePath, option, conf = {}) {
      let {
        loading = ['上传中...'], toast = ['上传成功']
      } = conf
      return new Promise((resolve, reject) => {
        if (loading.length) {
          wx.showLoading({
            title: loading[0],
            mask: true
          })
        }
        if(tempFilePath.includes('/image/')) return resolve(tempFilePath)
        let env = App.requestUrls.baseUrl;
        wx.uploadFile({
          url: env + url,
          header: {
            "token": wx.getStorageSync('wx-token')
          },
          filePath: tempFilePath,
          name: 'file',
          formData: option,
          success(res) {
            let result = JSON.parse(res.data)
            console.log(result)
            if (result.code === -2) {
              // 无效token
              wx.login({
                success: res => {
                  App.getToken(res.code).then(res => {
                    uploadFile(url, tempFilePath, option, conf).then(res => resolve(res)).catch(err => reject(err))
                  })
                }
              })
              return
            }
            result.code == 0 ? resolve(result.data) : reject(result.message)
            if (toast.length) {
              wx.showToast({
                mask: true,
                title: result.message || toast[0],
                icon: "none"
              })
            } else {
              if (loading) wx.hideLoading();
            }
          },
          fail: err => {
            let msg = err.errMsg;
            wx.showToast({
              mask: true,
              title: msg,
              icon: "none"
            })
            reject(err.errMsg)
          }
        })
      })
    }

    module.exports = {
      uploadFile: uploadFile,
      uploadManyImg: uploadManyImg
    }
const app = getApp()

const fileUpload = (uploadURL, filePath) => {
  let uerid = app.globalData.userid

  return new Promise((reslove, reject) => {
    wx.uploadFile({
      url: uploadURL,
      filePath,
      name: 'fileName',
      formData: uerid,
      success: reslove,
      fail: reject,
    })
  })
}




module.exports = fileUpload


/**
 

let app = getApp();
module.exports =function (url, filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${app.globalData.apiUrl}sys/${url}`,
            filePath,
            name:'file',
            formData: {
                'user':'test'
            },
            method:'POST',
            header: {
                'Authorization': `Bearer${app.globalData.userToken}`
            },
            success: resolve,
            fail: reject
        })
    })
}



const uploadFile = require('../../utils/uploadFile.js');



let files =this.data.files;



let uploads = [];
files.forEach(ele => {
  uploads.push(uploadFile('upload', ele))
})


Promise.all(uploads).then(res=>{
//todo
})
 */
/**
 * 
 * Promise 形式的getSetting
 */
export const getSetting = ()=>{
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}
/**
 * 
 * Promise 形式的chooseAddress
 */
export const chooseAddress = ()=>{
  return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}

/**
 * 
 * Promise openSetting
 */
export const openSetting = ()=>{
  return new Promise((resolve,reject)=>{
    wx.openSetting({
      success: (res) => {
        resolve(res)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}
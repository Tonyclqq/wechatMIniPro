//导出基础路径
export  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1/'
export const request = (params)=>{
  //显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  return new Promise((resolve,reject)=>{
    wx.request({
        ...params,
        success:result=>{
          resolve(result)
        },
        err:(err)=>{
          reject(err)
        },
        complete:()=>{
          wx.hideLoading()
        }
    })
  })
}
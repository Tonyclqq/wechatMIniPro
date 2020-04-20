/*
  1.用户上滑页面滚动条触底开始加载下一页数据
    1.找到滚动条触底事件
    2.判断还有没有下一页数据
      1.获取到总页数
      2.获取到当前的页码
      3.判断当前的页码是否大于等于总页数
        表示没有下一页数据
    3.假如没有下一页数据 弹出一个提升
    4.假如还有下一页数据 来加载下一页数据
      当前页码 ++
      从新发送数据
*/
import {request,baseUrl} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {id:0,value:'综合',isActive:true},
      {id:1,value:'销量',isActive:false},
      {id:2,value:'价格',isActive:false}
    ],
    goodsList:[]
  },
  //接口要的参数
  qyeryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  onLoad: function (options) {
    this.qyeryParams.cid = options.cid
    this.getGoodsList()
  },
  //滚动条触底事件
  onReachBottom:function(){
    //1.判断还有没有下一页数据
    if(this.qyeryParams.pagenum>=this.totalPages){
      //没有下一页数据
     wx.showToast({
       title: '没有下一页数据了'
     })
    }else{
      //还有下一页数据
      this.qyeryParams.pagenum++
      this.getGoodsList();
    }
  },
  //下拉刷新
  /**
   * 1触发下拉刷新事件 
   *  page.json配置"enablePullDownRefresh": true,
   *               "backgroundTextStyle":"dark"
   * 添加监听事件   onPullDownRefresh(){}
   *            
   * 2重置数据
   * 3重置页码
   * 4重新发送请求
   * 5数据请求回来，关闭等待效果
   */
  onPullDownRefresh(){
    //重置数据，数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.qyeryParams.pagenum = 1
    // 重新发送请求
    this.getGoodsList()
  },
  //获取商品列表的数据
  async getGoodsList(){
    const res = await request({url:`${baseUrl}goods/search`,data:this.qyeryParams})
    const total = res.data.message.total;
    this.totalPages = Math.ceil(total/this.qyeryParams.pagesize)
    this.setData({
      //拼接的数组
      goodsList:[...this.data.goodsList,...res.data.message.goods],
    })
    //关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  //标题点击事件从子组件传递过来的
  handleTabsItemChange(e){
    //1.获取被点击标题索引
    const {index}=e.detail;
    //2.修改源数组
    let{tabs}= this.data
    tabs.forEach((v,i)=>{
      i===index?v.isActive=true:v.isActive=false
    })
    //3赋值到data中
    this.setData({
      tabs
    })
  }
})
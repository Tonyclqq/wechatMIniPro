## 页面间进行传参
页面A
```html
<navigator url="/pages/goods_list/index?cid={{item2.cat_id}}" ></navigator>
<!-- item2.cat_id为动态传的参，这个是遍历循环得来的item2，目的是往详情页传递个cat_id-->
```
页面B(详情页)
```js
Page({
  onLoad: function (options) {
    console.log(options);
    //在页面加载事件中获取到这个值
  },
})
```
## 父组件向子组件传值
```js
// 父组件
tabs:[
      {id:0,value:'综合',isActive:true},
      {id:1,value:'销量',isActive:false},
      {id:2,value:'价格',isActive:false}
    ]
```
```html
<!--tabs就是个组件，-->
<tabs tabs="{{tabs}}"></tabs>
<!--将js数据中的值传递到子组件里面-->
```
```js
//子组件接受父组件传递过来的值
Component({
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },
})
```

------------------------------
小程序如何渲染HTML代码字符串？ `<rich-text>`
小程序处理数据的时候，只处理自己需要的，否则会影响性能
小程序处理.webp格式手机，String.prototype.replace(/\.webp/g,'.jpg')


/**
  扩展一个test模块
**/      
 
layui.define(['jquery', 'element'], function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var element = layui.element;
  element.on('tab(layadmin-layout-tabs)', function(data){
    console.log(this); //当前Tab标题所在的原始DOM元素
    alert('切换');
  });

  element.on('tabDelete(layadmin-layout-tabs)', function(data){
    console.log(this); //当前Tab标题所在的原始DOM元素
    alert('删除');
    return false;
  });
  

  var obj = {
    hello: function(str){
      alert('Hello '+ (str||'mymod'));
    }
  };
  
  // 输出接口
  exports('pagetabs', obj);
});
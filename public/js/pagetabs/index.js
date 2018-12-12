/**
  扩展一个test模块
**/      
 
layui.define('jquery', function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var num = 0;
  var obj = {
    hello: function(str){
      alert('Hello '+ (str||'mymod') + num++);
    }
  };
  
  //输出接口
  exports('pagetabs', obj);
});
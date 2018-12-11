/**
  项目JS主入口
  以依赖layui的layer和form模块为例
**/
layui.define(['jquery', 'element', 'layer'], function (exports) {
  var layer = layui.layer;
  var $ = layui.$;

  $('#LAY_app_flexible').click(function () {
    const className = 'layui-layout-custom-shrink';
    var layApp = $('#LAY_app');
    if (layApp.hasClass(className)) {
      layApp.removeClass(className);
    } else {
      layApp.addClass(className);
    }

    layer.msg('Hello World');
  });

  exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
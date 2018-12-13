/**
  扩展一个test模块
**/

layui.define(['jquery', 'element'], function (exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var element = layui.element;
  var $ = layui.jquery;

  const showClassName = 'layui-this';
  var tabContainer = $('#LAY_app_tabsheader');
  var iframeContainer = $('#LAY_app_tabsbody');

  /*
    return null or element
   */
  function findTab(href) {
    var selector = `li[lay-attr="${href}"]`;
    return tabContainer.find(selector);
  }

  function addTab(title, href) {
    var element = findTab(href);
    if (element != null) {
      showTab(element);
      return;
    }

    var tab = `<li lay-attr="${href}"><span>${title}</span></li>`;
    var iframe = `<iframe src="${href}" frameborder="0" class="layadmin-iframe"></iframe>`;
  }

  function showTab(element) {
    element.addClass(showClassName).siblings().removeClass(showClassName);
    var index = tabContainer.find('li').index(element);
    iframeContainer.find('iframe').eq(index).addClass(showClassName).siblings().removeClass(showClassName);
  }

  function deleteTab(index) {
    iframeContainer.find('iframe').eq(index).remove();
  }

  element.on('tab(layadmin-layout-tabs)', function (data) {
    showTab($(this));
  });

  element.on('tabDelete(layadmin-layout-tabs)', function (data) {
    console.log(data);
    deleteTab(data.index);
  });

  // 输出接口
  exports('pagetabs', {
    addTab
  });
});
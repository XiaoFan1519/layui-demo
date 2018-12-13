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
    var elem = tabContainer.find(selector);
    return elem.length > 0 ? elem : null;
  }

  function showTab(elem) {
    elem.addClass(showClassName).siblings().removeClass(showClassName);
    var index = tabContainer.find('li').index(elem);
    iframeContainer.find('iframe').eq(index).addClass(showClassName).siblings().removeClass(showClassName);
  }

  function addTab(title, href) {

    if (href == null) {
      throw new Error('href cannot be null.');
    }

    title = title == null ? '默认标题' : title;

    var elem = findTab(href);
    if (elem != null) {
      showTab(elem);
      return;
    }

    var tab = $(`<li lay-attr="${href}"><span>${title}</span><i class="layui-icon layui-unselect layui-tab-close">ဆ</i></li>`);
    var iframe = $(`<iframe src="${href}" frameborder="0" class="layadmin-iframe"></iframe>`);
    tab.appendTo(tabContainer);
    iframe.appendTo(iframeContainer);
    showTab(tab);
    element.render('tab(layadmin-layout-tabs)');
  }

  function deleteTab(index) {
    iframeContainer.find('iframe').eq(index).remove();
  }

  element.on('tab(layadmin-layout-tabs)', function (data) {
    showTab($(this));
  });

  element.on('tabDelete(layadmin-layout-tabs)', function (data) {
    deleteTab(data.index);
  });

  // 刷新
  $('#LAY_app_refresh').click(function () {
    var iframe = iframeContainer.find('.layui-this');
    iframe.attr('src', iframe.attr('src'));
  });

  // 输出接口
  exports('pagetabs', {
    addTab
  });
});
/**
  扩展一个test模块
**/

layui.define(['jquery', 'element'], function (exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var element = layui.element;
  var $ = layui.jquery;

  // 自定义tab结构
  element.tab({
    headerElem: '#LAY_app_tabsheader>li' //指定tab头元素项
      ,
    bodyElem: '#LAY_app_tabsbody>iframe' //指定tab主体元素项
  });

  const showClassName = 'layui-show';
  const filterName = 'layadmin-layout-tabs';
  var tabContainer = $('#LAY_app_tabsheader');
  var iframeContainer = $('#LAY_app_tabsbody');

  /*
    return null or element
   */
  function findTab(href) {
    var selector = `li[lay-id="${href}"]`;
    var elem = tabContainer.find(selector);
    return elem.length > 0 ? elem : null;
  }

  function addTab(title, href) {

    if (href == null) {
      throw new Error('href cannot be null.');
    }

    title = title == null ? '默认标题' : title;

    var elem = findTab(href);
    if (elem != null) {
      element.tabChange(filterName, href);
      return;
    }

    var iframe = $(`<iframe src="${href}" frameborder="0" class="layadmin-iframe ${showClassName}"></iframe>`);
    element.tabAdd(filterName, {
      title: title,
      id: href
    });
    // 清除其他iframe的显示效果
    iframeContainer.find('iframe').removeClass(showClassName);
    iframe.appendTo(iframeContainer);
    element.tabChange(filterName, href);
  }

  function deleteTab(index) {
    iframeContainer.find('iframe').eq(index).remove();
  }

  element.on(`tab(${filterName})`, function (data) {
    // 展示对应的iframe
    var iframe = iframeContainer.find('iframe').eq(data.index);
    if (iframe.hasClass(showClassName)) {
      return;
    }
    iframe.addClass(showClassName).siblings().removeClass(showClassName);
  });

  element.on(`tabDelete(${filterName})`, function (data) {
    // 删除对应的iframe
    deleteTab(data.index);
  });

  // 刷新
  $('#LAY_app_refresh').click(function () {
    var iframe = iframeContainer.find(`.${showClassName}`);
    iframe.attr('src', iframe.attr('src'));
  });

  // 功能菜单
  (function (filter) {
    var nav = $(`ul[lay-filter="${filter}"]`);
    var dl = nav.find('li > dl');
    var needRemove = false;
    var ms = 500;

    // 鼠标离开事件处理
    function mouseleave() {
      needRemove = true;
      setTimeout(function () {
        if (needRemove) {
          dl.removeClass(showClassName);
        }
      }, ms);
    }

    nav.mouseenter(function () {
      needRemove = false;
      dl.addClass(showClassName);
    }).mouseleave(mouseleave);

    // 删除指定标签
    function closeTabs(filter) {
      var arr = tabContainer.find("> li").filter(filter).map((n, elem) => $(elem).attr('lay-id')).get();
      arr.forEach(layId => {
        element.tabDelete(filterName, layId);
      });
    }

    dl.find('dd').click(function () {
      var event = $(this).attr('layadmin-event');
      switch (event) {
        case 'closeThisTabs':
          closeTabs((n, elem) => n != 0 && $(elem).hasClass('layui-this'));
          break;
        case 'closeOtherTabs':
          closeTabs((n, elem) => n != 0 && !$(elem).hasClass('layui-this'));
          break;
        case 'closeAllTabs':
          closeTabs(n => n != 0);
          break;
        default:
          // 不做处理
      }
      dl.removeClass(showClassName);
    });

  })('pagetabs-function-nav');



  // 输出接口
  exports('pagetabs', {
    addTab
  });
});
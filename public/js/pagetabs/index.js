/**
  扩展一个test模块
**/

layui.define(['jquery', 'element'], function (exports) { //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var element = layui.element;
  var $ = layui.jquery;

  // 自定义tab结构
  element.tab({
    headerElem: '#LAY_app_tabsheader>li', //指定tab头元素项
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
    // 必要参数校验
    if (href == null) {
      throw new Error('href cannot be null.');
    }

    // 默认标题处理
    title = title == null ? '默认标题' : title;

    // 如果已存在，则高亮显示
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

  // 删除选项
  function deleteTab(index) {
    iframeContainer.find('iframe').eq(index).remove();
  }

  // 选项左移值
  var tabLeft = 0;
  // 调整选项位置
  function adjustTabLeft(elemClientWidth, elemoffsetLeft) {
    var tabClientWidth = tabContainer[0].clientWidth;
    var scrollWidth = tabContainer[0].scrollWidth;
    // 选项左边到容器左边的距离
    var offsetLeft = elemoffsetLeft + tabLeft;
    // 选项到容器左边的距离
    var offsetRight = offsetLeft + elemClientWidth;
    if (offsetLeft >= 0 && offsetRight <= tabClientWidth) {
      // 不需要调整
      return;
    }

    if (offsetLeft + tabLeft < 0) {
      tabLeft = 0;
    } else {
      tabLeft = offsetRight - tabClientWidth;
    }

    tabLeft = tabClientWidth - offsetRight;
    if (tabLeft > 0) tabLeft = 0;
    tabContainer.css('left', tabLeft + 'px');
  }

  $('#layadmin-pagetabs-leftPage').click(() => {
    var tabClientWidth = tabContainer[0].clientWidth;
    tabLeft += tabClientWidth / 3;
    tabLeft = tabLeft > 0 ? 0 : tabLeft;
    tabContainer.css('left', tabLeft + 'px');
  });

  $('#layadmin-pagetabs-rightPage').click(() => {
    var tabClientWidth = tabContainer[0].clientWidth;
    var scrollWidth = tabContainer[0].scrollWidth;

    if (tabClientWidth > scrollWidth) {
      return;
    }
    tabLeft -= tabClientWidth / 3;
    if (tabClientWidth + (tabLeft > 0 ? tabLeft : -tabLeft) > scrollWidth) {
      tabLeft = scrollWidth - tabClientWidth;
      tabLeft = -tabLeft;
    }
    tabContainer.css('left', tabLeft + 'px');
  });

  element.on(`tab(${filterName})`, function (data) {
    adjustTabLeft(this.clientWidth, this.offsetLeft);

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

  // 功能菜单设置
  (function (filter) {
    var nav = $(`ul[lay-filter="${filter}"]`);
    var dl = nav.find('li > dl');
    var needRemove = false;
    var ms = 618;

    // 显示功能菜单
    nav.mouseenter(function () {
      needRemove = false;
      dl.addClass(showClassName);
    }).mouseleave(function () {
      needRemove = true;
      setTimeout(() => {
        if (needRemove) {
          dl.removeClass(showClassName);
        }
      }, ms);
    });

    // 删除指定标签
    function closeTabs(filter) {
      var arr = tabContainer.find("> li").filter(filter).map((n, elem) => $(elem).attr('lay-id')).get();
      arr.forEach(layId => {
        element.tabDelete(filterName, layId);
      });
    }

    // 事件处理
    dl.find('dd').click(function (e) {
      e.stopPropagation();
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

  // 滚动条


  // 输出接口
  exports('pagetabs', {
    addTab
  });
});
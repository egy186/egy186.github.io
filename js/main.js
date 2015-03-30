/// <reference path="../lib/jquery/dist/jquery.js" />
/// <reference path="../lib/fullpage/jquery.fullPage.js" />

jQuery().ready(function () {
  jQuery(document.getElementById('page')).fullpage({
    anchors: ['top', 'color-converter', 'icojs', 'about'],
    easing: 'swing',
    navigation: true,
    navigationPosition: 'left',
    navigationTooltips: ['Top', 'Color Converter', 'ico.js', 'About'],
    autoScrolling: true,
    css3: true,
    continuousVertical: true,
    resize: false,
    sectionsColor: ['#9ff', '#fff', '#fff', '#9f9'],
    recordHistory: false
  });
});

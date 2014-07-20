/**
 * @overview Freshman's Guidebook of Zhejiang University. 
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

var Doc = function(md) {
    var that = this, html = markdown.toHTML(md);
    // 匹配子标题，与电脑版略有不同请注意。
    html = html.replace(/<h2>(.*)——(.*)<\/h2>/g, "<h2>$1</h2><div class=\"subtitle\">$2<br>$3</div>");
    html = html.replace(/<p>@@[ ]*([^<]+)<\/p>/g, '<div class="hide-element"><div class="hide-element-title">$1</div><div class="hide-element-content">');
    html = html.replace(/<p>@@<\/p>/g, '/</div></div>/');
    html = html.replace(/\\n/g, '<br>'); // 替换 \n 为 <br>
    html = html.replace(/<p>[ ]+/, '<p>'); // 去除 <p> 标签开头的空白
    html = html.replace(/<p>(<img alt="cover".*>)<\/p>/g, '$1'); 
    // 对图片的预处理，不一次全部加载完毕，希望用户不是用流量。
    html = html.replace(/(<img.*?) src=/, '<p>$1 data-src=');
    var $html = $(html);
    $html.find('img[alt=cover]').addClass('img-cover');
    window.$html = $html;
    window.mdhtml = html;
};

$(document).ready(function() {
    $.get('share/freshman.md', function(data) {
        doc = new Doc(data);
        
    }, 'text');
});


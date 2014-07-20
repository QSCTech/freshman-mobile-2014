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
    // 另外先行隐藏，等适当时机（依次preload而后部分lazyload再显示、赋src）
    html = html.replace(/(<img.*?) src=/g, '$1 style="display: none" data-src=');
    var $html = $(html);
    $html.find('img[alt=cover]').addClass('img-cover');
    window.$html = $html;
    window.mdhtml = html;
    this.$content = $('#content').html($html);
    var index = $html.clone().filter('h1, h2');
    $('#cover-btn').html(index);
    this.pages = {
        cover: $('#cover'),
        content: $('#content'),
        downloads: $('#downloads')
    };
    this.initFunc();
    this.parseSections();
    // tap or click
    this.bindLinkKeys();
    
};
Doc.prototype.initFunc = function() {
    var that = this;

    this.parseSections = function() {
        var titleObject = $('h1, h2'), 
            lastChapter = '';
        for (var i = 0; i < titleObject.length; i++) {
            if ($(titleObject[i]).attr('tagName').toLowerCase() == 'h1') {
                // 大章节标题
                lastChapter = $(titleObject[i]).html();
            } else {
                // 必为小节
                $(titleObject[i]).attr('data-chapter', lastChapter);
            }
        }
    };
    this.bindLinkKeys = function() {
        var h1callback = function() {
            var url = '#!/' + $(this).html();
            that.updateUrl(url);
            that.applyUrl(url);
        };
        var h2callback = function() {
            var url = '#!/' + $(this).attr('data-chapter') + '/' + $(this).text();
            that.updateUrl(url);
            that.applyUrl(url);
        };
        var eventFunc = 'click';
        if (window.supportsTouch) {
            eventFunc = 'tap';
        }
        $('h1')[eventFunc](h1callback);
        $('h2')[eventFunc](h2callback);
    };
    this.updateUrl = function(url) {
        url = location.href.split('#!/')[0] + url;
        window.history.pushState('浙江大学新生手册', '浙江大学新生手册', url);
    };
    this.applyUrl = function(url) {
        if (!url) {
            url = decodeURIComponent(window.location.href);
        }
        var path = url.split('#!/');
        path = path.pop().split('/');
        that.applyPath(path);
    };
    this.applyPath = function(path) {
        // 一共可能有三层path，分为chapter / section / subsection
        if (console && console.log) {
            console.log(path);
        }
        if (path[0]) {
            if (path[0] == '下载') {
                that.switchPage('downloads');
            } else {
                that.switchPage('content');
                that.switchChapter(path[0]);
                if (path[1]) {
                    that.switchSection(path[1]);
                }
                if (path[2]) {
                    that.switchSubsection(path[3]);
                }
            }
        }
    };
};

$(document).ready(function() {
    $.get('share/freshman.md', function(data) {
        doc = new Doc(data);
        
    }, 'text');
});


/**
 * @overview Freshman's Guidebook of Zhejiang University. 
 * @author Senorsen <sen@senorsen.com>
 * @copyright Qiu Shi Chao
 */

var binFind = function(a, n, f) {
    var left, right, mid;
    left = 0;
    right = n;
    mid = parseInt(right / 2);
    while (left <= mid && right >= mid) {
        if (f == a[mid] || (f > a[mid] && f < a[mid+1])) {
            return mid;
        } else if (f < a[mid]) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
        mid = parseInt((left + right) / 2);
    }
    return -1;
};

var Doc = function(md) {
    var that = this, html = markdown.toHTML(md);
    // 匹配子标题，与电脑版略有不同请注意。
    html = html.replace(/<h2>(.*)——(.*) (.*)<\/h2>/g, "<h2>$1</h2><div class=\"subtitle\">$2<br>$3</div>");
    html = html.replace(/<p>@@[ ]*([^<]+)<\/p>/g, '<div class="hide-element"><div class="hide-element-title">$1</div><div class="hide-element-content">');
    html = html.replace(/<p>@@<\/p>/g, '</div></div>');
    html = html.replace(/\\n/g, '<br>'); // 替换 \n 为 <br>
    html = html.replace(/<p>[ ]+/, '<p>'); // 去除 <p> 标签开头的空白
    html = html.replace(/<p>(<img alt="cover".*>)<\/p>/g, '$1'); 
    // 对图片的预处理，不一次全部加载完毕，希望用户不是用流量。
    // 另外先行隐藏，等适当时机（依次preload而后部分lazyload再显示、赋src）
    html = html.replace(/(<img.*?) src=/g, '$1 style="display: none" data-src=');
    var $html = $(html);
    $html.find('img[alt=cover]').addClass('img-cover');
    window.$html = $html;
    $html.find('h1, h2').addClass('title-in-content');
    this.$content = $('#content-layer').html($html);
    var index = $html.clone().filter('h1, h2');
    index.removeClass('title-in-content').addClass('title-in-index');
    $('#cover-btn').html(index);
    this.pages = {
        cover: $('#cover'),
        content: $('#content'),
        downloads: $('#downloads'),
        about: $('#about')
    };
    this.positionTable = [];
    this.nameTable = [];
    this.chapterTree = [];
    this.chapterPositionTable = [];
    this.themeColors = window.themeColors;
    this.defaultColor = 'rgba(255,132,0,0.5)';
    this.currentThemeColor = this.defaultColor;
    this.currentChapter = '';
    this.currentChapterID = -1;
    this.initFunc();
    this.parseSections();
    // tap or click
    this.bindLinkKeys();

    this.currentTitleID = 0;
    this.currentTitle = '';
    this.handleScroll = function() {
        // 需不需要二分法捏。。。
        // 虽然似乎不太需要，不过好久没写了……写一个吧～
        var currentTop = document.body.scrollTop || window.scrollY,
            currentTitle = '',
            currentTitleID = -1,
            currentChapter = '',
            currentChapterID = -1;
        currentTop += 50 + that.topOffset;
        currentChapterID = binFind(that.chapterPositionTable, that.chapterPositionTable.length, currentTop);
        if (currentChapterID != that.currentChapterID) {
            // 切换新的chapter了，庆祝一下？
            if (currentChapterID == -1) {
                currentChapter = '';
            } else {
                currentChapter = that.chapterTree[currentChapterID];
            }
            that.currentChapterID = currentChapterID;
            that.currentChapter = currentChapter;
            that.updateChapter(currentChapter);
        } else {
            currentChapter = that.currentChapter;
        }
        
        currentTitleID = binFind(that.positionTable, that.positionTable.length, currentTop);
        if (currentTitleID == that.currentTitleID) return; // no change
        that.currentTitleID = currentTitleID;
        if (currentTitleID == -1 || typeof that.nameTable[currentTitleID] == 'undefined') {
            that.updateTitle('');
            that.updateUrl('');
            return;
        }
        currentTitle = that.nameTable[currentTitleID];
        that.updateTitle(currentTitle, currentChapter);
        that.updateUrl($('.title-' + that.nameTable[currentTitleID]).attr('data-url'));
        that.currentTitleID = currentTitleID;
        that.currentTitle = currentTitle;
    };
    //window.onscroll = that.handleScroll;
    setInterval(that.handleScroll, 500);
};
Doc.prototype.initFunc = function() {
    var that = this;

    this.getElementTitle = function(ele) {
        return $(ele).text().trim(); // 去除两边的空格
    };
    this.parseSections = function() {
        var titleObject = $('h1, h2'), 
            lastChapter = '';
        $('#content').find('h1, h2, h3, h4').addClass('title-in-content');
        $('#cover').find('h1, h2, h3, h4').addClass('title-in-cover');
        for (var i = 0; i < titleObject.length; i++) {
            if ($(titleObject[i]).attr('tagName').toLowerCase() == 'h1') {
                // 大章节标题
                lastChapter = that.getElementTitle(titleObject[i]);
                $(titleObject[i]).attr('data-url', '#!/' + lastChapter);
                if ($(titleObject[i]).hasClass('title-in-content')) {
                    that.chapterTree.push(that.getElementTitle(titleObject[i]));
                    that.chapterPositionTable.push($(titleObject[i]).offset().top);
                }
            } else {
                // 必为小节
                $(titleObject[i]).attr('data-chapter', lastChapter)
                                 .attr('data-url', '#!/' + lastChapter + '/' + that.getElementTitle(titleObject[i]));
            }
            $(titleObject[i]).attr('data-title', that.getElementTitle(titleObject[i]))
                             .addClass('title-' + that.getElementTitle(titleObject[i]));
            if ($(titleObject[i]).hasClass('title-in-content')) {
                that.positionTable.push($(titleObject[i]).offset().top);
                that.nameTable.push(that.getElementTitle(titleObject[i]));
                console.log('[' + that.getElementTitle(titleObject[i]) + '] -> ' + $(titleObject[i]).offset().top);
            }
        }
    };
    this.bindLinkKeys = function() {
        var h1callback = function() {
            var url = '#!/' + that.getElementTitle(this);
            that.updateUrl(url);
            that.applyUrl(url);
        };
        var h2callback = function() {
            var url = '#!/' + $(this).attr('data-chapter') + '/' + that.getElementTitle(this);
            that.updateUrl(url);
            that.applyUrl(url);
        };
        var eventFunc = 'click';
        if (window.supportsTouch) {
            eventFunc = 'tap';
        }
        $('h1')[eventFunc](h1callback);
        $('h2')[eventFunc](h2callback);

        // tap or click bind for nav-btn
        $('.page-tap')[eventFunc](function() {
            that.switchPage($(this).attr('data-page'));
        });
    };
    this.updateUrl = function(url) {
        if (url == '') {
            url = location.href.split('#!/')[0];
        } else {
            url = location.href.split('#!/')[0] + url;
        }
        window.history.pushState(document.title, document.title, url);
    };
    this.applyUrl = function(url) {
        if (!url) {
            url = decodeURIComponent(window.location.href);
        }
        if (!/[#][!]\//.test(url)) {
            that.applyPath([]); // 首页
        } else {
            var path = url.split('#!/');
            path = path.pop().split('/');
            that.applyPath(path);
        }
    };
    this.applyPath = function(path) {
        // 一共可能有三层path，分为chapter / section / subsection
        if (console && console.log) {
            console.log('Apply path: ', path);
        }
        if (path[0]) {
            if (path[0] == '下载') {
                that.switchPage('downloads');
            } else if (path[0] == '搜索') {
                that.switchPage('search');
            } else {
                that.switchPage('content');
                that.switchChapter(path[0]);
                if (path[1]) {
                    that.switchSection(path[1], path[0]);
                }
                if (path[2]) {
                    that.switchSubsection(path[3]);
                }
            }
        } else {
            that.switchPage('cover');
        }
    };
    this.updateChapter = function(title) {
        bgimg.stopDeviceOrientation();
        if (title == '') {
            that.currentThemeColor = that.defaultColor;
            bgimg.setBackground(that.pages.cover, 'img/cover_mobile.jpg');
            bgimg.startDeviceOrientation();
        } else {
            for (var i in that.chapterTree) {
                if (that.chapterTree[i] == title) {
                    // i为标号
                    that.currentThemeColor = that.themeColors[i];
                    break;
                }
            }
        }
        that.currentChapter = title;
        console.log('current chapter: ' + title);
        console.log('current theme color: ' + that.currentThemeColor);
        $('#nav-bar').css({
            'background-color': that.currentThemeColor,
            'box-shadow': '0 0 5px ' + that.currentThemeColor
        }); 
        $(document.body).css({
            'background-color': (that.currentThemeColor).hexRgba(0.1)
        });
    };
    this.updateTitle = function(title, chapter) {
        var pageTitle = '浙江大学新生手册移动版';
        if (title == '') {
            document.title = pageTitle;
            title = '';
        } else {
            document.title = title + ' - ' + pageTitle;
        }
        var showTitle = title == '' ? '浙江大学新生手册' : title;
        if (chapter && chapter != title) {
            showTitle = chapter + ' - ' + title;
        }
        $('#nav-title').text(showTitle);
        console.log('update title: ' + document.title);
    };
    this.topOffset = 60;
    this.currentPage = 'cover';
    this.switchPage = function(page, gesture) {
        // gesture 用于判断是否为用户滑动。如果是，那么将采用其他动画。
        that.currentPage = page;
        document.body.scrollTop = 50 -that.topOffset + that.pages[page].offset().top;
    };
    this.switchChapter = function(title, gesture) {
        that.currentChapter = title;
        document.body.scrollTop = -that.topOffset + that.pages[that.currentPage].find('h1.title-' + title).offset().top;
        that.updateTitle(title);
        that.updateChapter(title);
    };
    this.switchSection = function(title, chapter) {
        document.body.scrollTop = -that.topOffset + that.pages[that.currentPage].find('h2.title-' + title).offset().top;
        that.updateTitle(title, chapter);
        if (that.currentChapter != chapter) {
            that.updateChapter(chapter);
        }
    };
    this.switchSubsection = function(title) {
        $('h3').each(function() {
            if (that.getElementTitle(this) == title) {
                document.body.scrollTop = -that.topOffset + $(this).offset().top;
            }
        });
    };
};

$(document).ready(function() {
    bgimg = new Bgimg();
    $.get('share/freshman.md', function(data) {
        $('#nav-loading').fadeOut();
        doc = new Doc(data);
        // 打开的时候非常有可能带hash，所以检测一下
        doc.updateChapter('');
        doc.applyUrl();
    }, 'text');

    // 劫持链接点击
    // [ATTENTION] window.open() will not open in new tab if it is not happening on actual click event. In the example given the url is being opened on actual click event.
    $('body').on('click', 'a', function(e) {
        var href = $(this).attr('href');
        if (!href) return;
        e.preventDefault();
        e.stopPropagation();
        console.log('点击链接：' + href);
        var regexp = '/' + location.href.split('#!/')[0].replace(/\//g, '\\/') + '/';
        if (eval(regexp).test(href) || /#!\//.test(href)) {
            // 内部章节跳转
            // as like #!/入校 or #!/入校/懂得浙大 or #!/入校/懂得浙大/两大学院三大学园
            console.log('判定为内部链接');
            doc.applyUrl(href);
        } else {
            // 新窗口中打开其他链接
            console.log('判定为外部链接');
            window.open(href, '_blank');
        }
    });

    window.onhashchange = function() {
        console.log('hashchange');
        doc.applyUrl();
    };

    // Device Orientation Test
    // 测试表明，gamma为左右翻转手机，beta为上下翻转。
    /*
    $('#orientation-test').css('display', 'none');
    window.addEventListener('deviceorientation', function(event) {
        $('#event-alpha').text(event.alpha);
        $('#event-beta').text(event.beta);
        $('#event-gamma').text(event.gamma);
    }, true);
    */
});


var title = {
    focus: '(づ￣ ³￣)づ („• ֊ •„) ～♡',
    blur: '( • )( • )ԅ(≖‿≖ԅ)',
}

function print_version(){
    var copyright = `
        ██████╗ ██╗███████╗██╗  ██╗██╗
        ██╔══██╗██║╚══███╔╝██║ ██╔╝██║
        ██████╔╝██║  ███╔╝ █████╔╝ ██║
        ██╔══██╗██║ ███╔╝  ██╔═██╗ ██║
        ██║  ██║██║███████╗██║  ██╗██║
        ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝
    `
    copyright = copyright.split('\n').map(line => line.trim()).join('\n')
    console.log(copyright)
}

print_version()

// Fungsi atur Title
function window_title() {
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            document.title = title.blur;
            clearTimeout(titleTime);
        } else {
            document.title = title.focus;
            titleTime = setTimeout(function () {
                document.title = OriginTitile;
            }, 3000);
        }
    });
}

// Tombol scroll ke atas
(function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return
    }

    var isShow = false, lock = false;
    var $btn = $('.back-to-top');

    $(document).scroll(function () {
        if (lock) return

        if ($(this).scrollTop() >= 1000) {
            if (!isShow) $btn.addClass('load')
            isShow = true
        } else {
            if (isShow) {
                $btn.removeClass('load')
                isShow = false
            }
        }
    })

    $btn.click(function () {
        lock = true
        $btn.addClass('ani-leave')

        $("html, body").animate({ scrollTop: 0 }, 800);

        setTimeout(function () {
            $btn.removeClass('ani-leave').addClass('leaved')
        }, 390)

        setTimeout(function () {
            $btn.addClass('ending')
        }, 120)

        setTimeout(function () {
            $btn.removeClass('load')
        }, 1500);

        setTimeout(function () {
            lock = false
            isShow = false
            $btn.removeClass('leaved ending')
        }, 2000);
    })
})();

// Klik link anchor untuk scroll ke tampilan dengan efek smooth scrolling
$(document).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault();
    var id = $(this).attr('href');
    var $el = $(id);
    if ($el.length > 0) $el[0].scrollIntoView({
        behavior: 'smooth'
    })
});

// Langsung loncat ke komentar yang diinginkan
(function () {
    var hash = location.hash
    if (hash && hash.startsWith('#')) {
        setTimeout(function () {
            var $el = $(hash);
            if ($el.length > 0) $el[0].scrollIntoView({
                behavior: 'smooth'
            })
        }, 1500);
    }
})();



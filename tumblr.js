var loc,
    api_key = "I6qPBdMFPuu0xsHTeqSEzSlJ1MMj5BQWncdN93MMpNiXLEPuLO",
    api_endpoint =
        "//api.tumblr.com/v2/blog/allthisstuffrighthere.tumblr.com/posts/?cb=" +
        Math.random() + "&",
    loading_additional = false,
    click_time = 0;
var data = {
    sections: {
        home: {
            type: "single",
            style:
                "max-width: 800px; font-size: 13px; text-align: right;color: #A8A8A8;",
            tumblr_tag: "home",
        },
        about: {
            type: "single",
            style: "max-width: 800px;",
            tumblr_tag: "about",
        },
        worklife: {
            type: "column",
            style: "max-width: 800px;",
            tumblr_tag: "life",
        },
        worklifestyle: {
            type: "column",
            style: "max-width: 800px;",
            tumblr_tag: "lifestyle",
        },
        workreality: { type: "grid", tumblr_tag: "reality" },
        contact: {
            type: "single",
            style: "max-width: 800px;",
            tumblr_tag: "contact",
        },
        africa: { type: "column_reverse", tumblr_tag: "africa" },
        drones: { type: "column_reverse", tumblr_tag: "drones" },
    },
};
function set_links() {
    $("a").unbind("click");
    $("a").click(function (e) {
        if (!(/#|http/.test($(this).attr("href")))) {
            window.stop();
            document.execCommand("Stop");
            window.history.pushState("Object", "title", $(this).attr("href"));
            ga("send", "pageview");
            load_location();
            e.preventDefault();
        }
    });
    $(".toggle-menu").click(function (e) {
        $(".sub").toggleClass("closed");
        e.preventDefault();
    });
}
set_links();
function load_location() {
    click_time = Date.now();
    loading_additional = false;
    $(".content").html("");
    loc = window.location.pathname.replace(/\//g, "") ||
        window.location.hash.replace(/\//g, "").replace("#", "") || "home";
    loadSection();
}
window.onpopstate = load_location;
load_location();
function loadSection() {
    var offset = "";
    if (!!arguments[0]) offset = "&offset=" + arguments[0];
    if (!!data.sections[loc]) {
        $(".content").attr("style", data.sections[loc].style || " ");
        var section = data.sections[loc];
        $("body").append(
            unescape(
                '%3Cscript src="' + api_endpoint + "api_key=" + api_key +
                    "&callback=tumblrCallback&tag=" + section.tumblr_tag +
                    offset + '"%3E%3C/script%3E',
            ),
        );
    }
}
function tumblrCallback(response) {
    var section = data.sections[loc];
    var posts = response.response.posts;
    if (response.response.total_posts > 20 && !loading_additional) {
        loading_additional = true;
        for (var n = 20; n < response.response.total_posts; n = n + 20) {
            loadSection(n);
        }
    }
    if (section.type === "single") {
        if (posts[0].type === "photo") {
            $(".content").html(
                '<img src="' + posts[0].photos[0].alt_sizes[0].url + '"><br>' +
                    posts[0].caption,
            );
        } else $(".content").html(posts[0].body);
    } else {if (section.type === "column") {
            for (var i = 0; i < posts.length; i++) {
                if (posts[i].type === "photo") {
                    $(".content").append(
                        '<img src="' + posts[i].photos[0].alt_sizes[0].url +
                            '"><br>' + posts[i].caption + "<br>",
                    );
                } else $(".content").prepend(posts[0].body);
            }
        } else {if (section.type === "grid") {
                if (!$(".content .grid").length) {
                    $(".content").append(
                        '<div class="grid"><div class="col1"></div><div class="col2"></div></div>',
                    );
                }
                var col1height = 0, col2height = 0;
                for (var z = 0; z < posts.length; z++) {
                    var width = $(".col1").width();
                    if (posts[z].type === "photo") {
                        if (posts[z].photos[0].alt_sizes[0].width < width) {
                            height = posts[z].photos[0].alt_sizes[0].height;
                        } else {height =
                                (width /
                                    posts[z].photos[0].alt_sizes[0].width) *
                                posts[z].photos[0].alt_sizes[0].height;}
                        if (col1height < col2height) {
                            className = "col1";
                            col1height = col1height + height;
                        } else {
                            className = "col2";
                            col2height = col2height + height;
                        }
                        console.log(col1height, col2height);
                        $("." + className).append(
                            '<div class="item"><img src="' +
                                posts[z].photos[0].alt_sizes[0].url + '"><br>' +
                                posts[z].caption + "</div>",
                        );
                    } else $(".content").prepend(posts[z].body);
                }
            } else {if (section.type === "column_reverse") {
                    for (var x = posts.length - 1; x > -1; x = x - 1) {
                        if (posts[x].type === "photo") {
                            $(".content").append(
                                '<img src="' +
                                    posts[x].photos[0].alt_sizes[0].url +
                                    '"><br>' + posts[x].caption + "<br>",
                            );
                        } else $(".content").prepend(posts[0].body);
                    }
                }}}}
    set_links();
}

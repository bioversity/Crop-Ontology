import os

import cropontology.resources as r


def create_resources(apppath, config):
    r.add_library("main_library", os.path.join(apppath, "jsandcss"), config)

    # ----------------------------Basic CSS-----------------------
    r.add_css_resource(
        "main_library", "font-awesome", "plugins/fontawesome-free/css/all.min.css"
    )
    r.add_css_resource("main_library", "adminlte", "css/adminlte.css")
    r.add_css_resource("main_library", "cropontology", "css/cropontology.css")
    r.add_css_resource(
        "main_library", "sweetalert", "css/plugins/sweetalert/sweetalert.css", None
    )

    # ----------------------------Basic JS----------------------------------------------------
    r.add_js_resource("main_library", "jquery", "plugins/jquery/jquery.min.js")
    r.add_js_resource(
        "main_library", "bootstrap", "plugins/bootstrap/js/bootstrap.bundle.min.js"
    )
    r.add_js_resource("main_library", "adminlte", "js/adminlte.min.js")
    r.add_js_resource("main_library", "ckeditor", "plugins/ckeditor5/ckeditor.js", None)
    r.add_js_resource(
        "main_library", "ckeditor4", "plugins/ckeditor4/ckeditor.js", None
    )
    r.add_js_resource(
        "main_library", "sweetalert", "js/plugins/sweetalert/sweetalert.min.js", None
    )

    # Graph CSS
    r.add_css_resource("main_library", "graph_style", "plugins/graph/style.css", None)
    r.add_css_resource("main_library", "graph_svg", "plugins/graph/svg.css")
    r.add_css_resource("main_library", "d3-tip", "plugins/graph/d3-tip.min.css")

    # Graph JS
    r.add_js_resource(
        "main_library", "browser", "plugins/graph/jquery/jquery.browser.js", "jquery"
    )
    r.add_js_resource("main_library", "d3", "plugins/graph/d3/d3.min.js")
    r.add_js_resource("main_library", "colorbrewer", "plugins/graph/colorbrewer.js")
    r.add_js_resource("main_library", "geometry", "plugins/graph/libs/geometry.js")
    r.add_js_resource("main_library", "d3-v6-tip", "plugins/graph/d3-v6-tip.js")
    r.add_js_resource(
        "main_library", "canvas-to-blob", "plugins/graph/canvas-to-blob.min.js"
    )
    r.add_js_resource("main_library", "fileSaver", "plugins/graph/FileSaver.min.js")
    r.add_js_resource("main_library", "graph", "plugins/graph/script.js")

    r.add_js_resource("main_library", "neovis", "plugins/neovis/neovis.js", None)

    # Search
    r.add_css_resource("main_library", "slick", "css/slick/slick.css", None)
    r.add_css_resource("main_library", "slick-theme", "css/slick/slick-theme.css")
    r.add_css_resource("main_library", "select2", "css/select2/select2.css")
    r.add_css_resource("main_library", "search", "css/search.css")

    r.add_js_resource("main_library", "circles", "js/circles.min.js", None)
    r.add_js_resource("main_library", "slick", "js/slick/slick.min.js")
    r.add_js_resource("main_library", "ias", "js/jquery-ias.min.js")
    r.add_js_resource("main_library", "select2", "js/select2/select2.js")
    r.add_js_resource("main_library", "co", "js/co.js")

    # JSTree
    r.add_css_resource(
        "main_library", "jstree", "plugins/jstree/css/default/style.min.css", None
    )
    # r.add_css_resource("main_library", "jstree-throbber", "plugins/jstree/css/default/throbber.gif", None)
    # r.add_css_resource("main_library", "jstree-40", "plugins/jstree/css/default/40px.png", None)
    # r.add_css_resource("main_library", "jstree-32", "plugins/jstree/css/default/32px.png", None)
    r.add_js_resource("main_library", "jstree", "plugins/jstree/js/jstree.min.js", None)

    # Search users
    r.add_css_resource("main_library", "select_users", "css/select2/select2.css", None)
    r.add_js_resource("main_library", "select_users", "js/select2/select2.js", None)

    r.add_css_resource(
        "main_library", "switchery", "css/plugins/switchery/switchery.css", None
    )
    r.add_js_resource(
        "main_library", "switchery", "js/plugins/switchery/switchery.js", None
    )

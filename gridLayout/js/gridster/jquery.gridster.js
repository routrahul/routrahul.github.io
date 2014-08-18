(function (e, t, n, r) {
    function i(t) {
        if (t[0] && e.isPlainObject(t[0])) {
            this.data = t[0]
        } else {
            this.el = t
        }
        this.isCoords = true;
        this.coords = {};
        this.init();
        return this
    }
    var s = i.prototype;
    s.init = function () {
        this.set();
        this.original_coords = this.get()
    };
    s.set = function (e, t) {
        var n = this.el;
        if (n && !e) {
            this.data = n.offset();
            this.data.width = n.width();
            this.data.height = n.height()
        }
        if (n && e && !t) {
            var r = n.offset();
            this.data.top = r.top;
            this.data.left = r.left
        }
        var i = this.data;
        this.coords.x1 = i.left;
        this.coords.y1 = i.top;
        this.coords.x2 = i.left + i.width;
        this.coords.y2 = i.top + i.height;
        this.coords.cx = i.left + i.width / 2;
        this.coords.cy = i.top + i.height / 2;
        this.coords.width = i.width;
        this.coords.height = i.height;
        this.coords.el = n || false;
        return this
    };
    s.update = function (t) {
        if (!t && !this.el) {
            return this
        }
        if (t) {
            var n = e.extend({}, this.data, t);
            this.data = n;
            return this.set(true, true)
        }
        this.set(true);
        return this
    };
    s.get = function () {
        return this.coords
    };
    e.fn.coords = function () {
        if (this.data("coords")) {
            return this.data("coords")
        }
        var e = new i(this, arguments[0]);
        this.data("coords", e);
        return e
    }
})(jQuery, window, document);
(function (e, t, n, r) {
    function s(t, n, r) {
        this.options = e.extend(i, r);
        this.$element = t;
        this.last_colliders = [];
        this.last_colliders_coords = [];
        if (typeof n === "string" || n instanceof jQuery) {
            this.$colliders = e(n, this.options.colliders_context).not(this.$element)
        } else {
            this.colliders = e(n)
        }
        this.init()
    }
    var i = {
        colliders_context: n.body
    };
    var o = s.prototype;
    o.init = function () {
        this.find_collisions()
    };
    o.overlaps = function (e, t) {
        var n = false;
        var r = false;
        if (t.x1 >= e.x1 && t.x1 <= e.x2 || t.x2 >= e.x1 && t.x2 <= e.x2 || e.x1 >= t.x1 && e.x2 <= t.x2) {
            n = true
        }
        if (t.y1 >= e.y1 && t.y1 <= e.y2 || t.y2 >= e.y1 && t.y2 <= e.y2 || e.y1 >= t.y1 && e.y2 <= t.y2) {
            r = true
        }
        return n && r
    };
    o.detect_overlapping_region = function (e, t) {
        var n = "";
        var r = "";
        if (e.y1 > t.cy && e.y1 < t.y2) {
            n = "N"
        }
        if (e.y2 > t.y1 && e.y2 < t.cy) {
            n = "S"
        }
        if (e.x1 > t.cx && e.x1 < t.x2) {
            r = "W"
        }
        if (e.x2 > t.x1 && e.x2 < t.cx) {
            r = "E"
        }
        return n + r || "C"
    };
    o.calculate_overlapped_area_coords = function (t, n) {
        var r = Math.max(t.x1, n.x1);
        var i = Math.max(t.y1, n.y1);
        var s = Math.min(t.x2, n.x2);
        var o = Math.min(t.y2, n.y2);
        return e({
            left: r,
            top: i,
            width: s - r,
            height: o - i
        }).coords().get()
    };
    o.calculate_overlapped_area = function (e) {
        return e.width * e.height
    };
    o.manage_colliders_start_stop = function (t, n, r) {
        var i = this.last_colliders_coords;
        for (var s = 0, o = i.length; s < o; s++) {
            if (e.inArray(i[s], t) === -1) {
                n.call(this, i[s])
            }
        }
        for (var u = 0, a = t.length; u < a; u++) {
            if (e.inArray(t[u], i) === -1) {
                r.call(this, t[u])
            }
        }
    };
    o.find_collisions = function (t) {
        var n = this;
        var r = [];
        var i = [];
        var s = this.colliders || this.$colliders;
        var o = s.length;
        var u = n.$element.coords().update(t || false).get();
        while (o--) {
            var a = n.$colliders ? e(s[o]) : s[o];
            var f = a.isCoords ? a : a.coords();
            var l = f.get();
            var c = n.overlaps(u, l);
            if (!c) {
                continue
            }
            var h = n.detect_overlapping_region(u, l);
            if (h === "C") {
                var p = n.calculate_overlapped_area_coords(u, l);
                var d = n.calculate_overlapped_area(p);
                var v = {
                    area: d,
                    area_coords: p,
                    region: h,
                    coords: l,
                    player_coords: u,
                    el: a
                };
                if (n.options.on_overlap) {
                    n.options.on_overlap.call(this, v)
                }
                r.push(f);
                i.push(v)
            }
        }
        if (n.options.on_overlap_stop || n.options.on_overlap_start) {
            this.manage_colliders_start_stop(r, n.options.on_overlap_start, n.options.on_overlap_stop)
        }
        this.last_colliders_coords = r;
        return i
    };
    o.get_closest_colliders = function (e) {
        var t = this.find_collisions(e);
        t.sort(function (e, t) {
            if (e.region === "C" && t.region === "C") {
                if (e.coords.y1 < t.coords.y1 || e.coords.x1 < t.coords.x1) {
                    return -1
                } else {
                    return 1
                }
            }
            if (e.area < t.area) {
                return 1
            }
            return 1
        });
        return t
    };
    e.fn.collision = function (e, t) {
        return new s(this, e, t)
    }
})(jQuery, window, document);
(function (e, t) {
    e.delay = function (e, t) {
        var n = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function () {
            return e.apply(null, n)
        }, t)
    };
    e.debounce = function (e, t, n) {
        var r;
        return function () {
            var i = this,
                s = arguments;
            var o = function () {
                r = null;
                if (!n) e.apply(i, s)
            };
            if (n && !r) e.apply(i, s);
            clearTimeout(r);
            r = setTimeout(o, t)
        }
    };
    e.throttle = function (e, t) {
        var n, r, i, s, o, u;
        var a = debounce(function () {
            o = s = false
        }, t);
        return function () {
            n = this;
            r = arguments;
            var f = function () {
                i = null;
                if (o) e.apply(n, r);
                a()
            };
            if (!i) i = setTimeout(f, t);
            if (s) {
                o = true
            } else {
                u = e.apply(n, r)
            }
            a();
            s = true;
            return u
        }
    }
})(window);
(function (e, t, n, r) {
    function a(t, r) {
        this.options = e.extend({}, i, r);
        this.$body = e(n.body);
        this.$container = e(t);
        this.$dragitems = e(this.options.items, this.$container);
        this.is_dragging = false;
        this.player_min_left = 0 + this.options.offset_left;
        this.init()
    }
    var i = {
        items: "li",
        distance: 1,
        limit: true,
        offset_left: 0,
        autoscroll: true,
        ignore_dragging: ["INPUT", "TEXTAREA", "SELECT", "BUTTON"],
        handle: null,
        container_width: 0,
        move_element: true,
        helper: false
    };
    var s = e(t);
    var o = !! ("ontouchstart" in t);
    var u = {
        start: o ? "touchstart.gridster-draggable" : "mousedown.gridster-draggable",
        move: o ? "touchmove.gridster-draggable" : "mousemove.gridster-draggable",
        end: o ? "touchend.gridster-draggable" : "mouseup.gridster-draggable"
    };
    var f = a.prototype;
    f.init = function () {
        this.calculate_positions();
        this.$container.css("position", "relative");
        this.disabled = false;
        this.events();
        e(t).bind("resize.gridster-draggable", throttle(e.proxy(this.calculate_positions, this), 200))
    };
    f.events = function () {
        this.$container.on("selectstart.gridster-draggable", e.proxy(this.on_select_start, this));
        this.$container.on(u.start, this.options.items, e.proxy(this.drag_handler, this));
        this.$body.on(u.end, e.proxy(function (e) {
            this.is_dragging = false;
            if (this.disabled) {
                return
            }
            this.$body.off(u.move);
            if (this.drag_start) {
                this.on_dragstop(e)
            }
        }, this))
    };
    f.get_actual_pos = function (e) {
        var t = e.position();
        return t
    };
    f.get_mouse_pos = function (e) {
        if (o) {
            var t = e.originalEvent;
            e = t.touches.length ? t.touches[0] : t.changedTouches[0]
        }
        return {
            left: e.clientX,
            top: e.clientY
        }
    };
    f.get_offset = function (e) {
        e.preventDefault();
        var t = this.get_mouse_pos(e);
        var n = Math.round(t.left - this.mouse_init_pos.left);
        var r = Math.round(t.top - this.mouse_init_pos.top);
        var i = Math.round(this.el_init_offset.left + n - this.baseX);
        var s = Math.round(this.el_init_offset.top + r - this.baseY + this.scrollOffset);
        if (this.options.limit) {
            if (i > this.player_max_left) {
                i = this.player_max_left
            } else if (i < this.player_min_left) {
                i = this.player_min_left
            }
        }
        return {
            position: {
                left: i,
                top: s
            },
            pointer: {
                left: t.left,
                top: t.top,
                diff_left: n,
                diff_top: r + this.scrollOffset
            }
        }
    };
    f.get_drag_data = function (e) {
        var t = this.get_offset(e);
        t.$player = this.$player;
        t.$helper = this.helper ? this.$helper : this.$player;
        return t
    };
    f.manage_scroll = function (e) {
        var t;
        var n = s.scrollTop();
        var r = n;
        var i = r + this.window_height;
        var o = i - 50;
        var u = r + 50;
        var a = e.pointer.left;
        var f = r + e.pointer.top;
        var l = this.doc_height - this.window_height + this.player_height;
        if (f >= o) {
            t = n + 30;
            if (t < l) {
                s.scrollTop(t);
                this.scrollOffset = this.scrollOffset + 30
            }
        }
        if (f <= u) {
            t = n - 30;
            if (t > 0) {
                s.scrollTop(t);
                this.scrollOffset = this.scrollOffset - 30
            }
        }
    };
    f.calculate_positions = function (e) {
        this.window_height = s.height()
    };
    f.drag_handler = function (t) {
        var n = t.target.nodeName;
        if (this.disabled || t.which !== 1 && !o) {
            return
        }
        if (this.ignore_drag(t)) {
            return
        }
        var r = this;
        var i = true;
        this.$player = e(t.currentTarget);
        this.el_init_pos = this.get_actual_pos(this.$player);
        this.mouse_init_pos = this.get_mouse_pos(t);
        this.offsetY = this.mouse_init_pos.top - this.el_init_pos.top;
        this.$body.on(u.move, function (e) {
            var t = r.get_mouse_pos(e);
            var n = Math.abs(t.left - r.mouse_init_pos.left);
            var s = Math.abs(t.top - r.mouse_init_pos.top);
            if (!(n > r.options.distance || s > r.options.distance)) {
                return false
            }
            if (i) {
                i = false;
                r.on_dragstart.call(r, e);
                return false
            }
            if (r.is_dragging === true) {
                r.on_dragmove.call(r, e)
            }
            return false
        });
        if (!o) {
            return false
        }
    };
    f.on_dragstart = function (t) {
        t.preventDefault();
        if (this.is_dragging) {
            return this
        }
        this.drag_start = this.is_dragging = true;
        var r = this.$container.offset();
        this.baseX = Math.round(r.left);
        this.baseY = Math.round(r.top);
        this.doc_height = e(n).height();
        if (this.options.helper === "clone") {
            this.$helper = this.$player.clone().appendTo(this.$container).addClass("helper");
            this.helper = true
        } else {
            this.helper = false
        }
        this.scrollOffset = 0;
        this.el_init_offset = this.$player.offset();
        this.player_width = this.$player.width();
        this.player_height = this.$player.height();
        var i = this.options.container_width || this.$container.width();
        this.player_max_left = i - this.player_width + this.options.offset_left;
        if (this.options.start) {
            this.options.start.call(this.$player, t, this.get_drag_data(t))
        }
        return false
    };
    f.on_dragmove = function (e) {
        var t = this.get_drag_data(e);
        this.options.autoscroll && this.manage_scroll(t);
        if (this.options.move_element) {
            (this.helper ? this.$helper : this.$player).css({
                position: "absolute",
                left: t.position.left,
                top: t.position.top
            })
        }
        var n = this.last_position || t.position;
        t.prev_position = n;
        if (this.options.drag) {
            this.options.drag.call(this.$player, e, t)
        }
        this.last_position = t.position;
        return false
    };
    f.on_dragstop = function (e) {
        var t = this.get_drag_data(e);
        this.drag_start = false;
        if (this.options.stop) {
            this.options.stop.call(this.$player, e, t)
        }
        if (this.helper) {
            this.$helper.remove()
        }
        return false
    };
    f.on_select_start = function (e) {
        if (this.disabled) {
            return
        }
        if (this.ignore_drag(e)) {
            return
        }
        return false
    };
    f.enable = function () {
        this.disabled = false
    };
    f.disable = function () {
        this.disabled = true
    };
    f.destroy = function () {
        this.disable();
        this.$container.off(".gridster-draggable");
        this.$body.off(".gridster-draggable");
        e(t).off(".gridster-draggable");
        e.removeData(this.$container, "drag")
    };
    f.ignore_drag = function (t) {
        if (this.options.handle) {
            return !e(t.target).is(this.options.handle)
        }
        return e(t.target).is(this.options.ignore_dragging.join(", "))
    };
    e.fn.drag = function (e) {
        return new a(this, e)
    }
})(jQuery, window, document);
(function (e, t, n, r) {
    function s(t, n) {
        this.options = e.extend(true, i, n);
        this.$el = e(t);
        this.$wrapper = this.$el.parent();
        this.$widgets = this.$el.children(this.options.widget_selector).addClass("gs-w");
        this.widgets = [];
        this.$changed = e([]);
        this.wrapper_width = this.$wrapper.width();
        this.min_widget_width = this.options.widget_margins[0] * 2 + this.options.widget_base_dimensions[0];
        this.min_widget_height = this.options.widget_margins[1] * 2 + this.options.widget_base_dimensions[1];
        this.$style_tags = e([]);
        this.init()
    }
    var i = {
        namespace: "",
        widget_selector: "li",
        widget_margins: [10, 10],
        widget_base_dimensions: [400, 225],
        extra_rows: 0,
        extra_cols: 0,
        min_cols: 1,
        max_cols: null,
        min_rows: 15,
        max_size_x: false,
        autogenerate_stylesheet: true,
        avoid_overlapped_widgets: true,
        serialize_params: function (e, t) {
            return {
                col: t.col,
                row: t.row,
                size_x: t.size_x,
                size_y: t.size_y
            }
        },
        collision: {},
        draggable: {
            items: ".gs-w",
            distance: 4
        },
        resize: {
            enabled: false,
            axes: ["x", "y", "both"],
            handle_append_to: "",
            handle_class: "gs-resize-handle",
            max_size: [Infinity, Infinity]
        }
    };
    s.generated_stylesheets = [];
    var o = s.prototype;
    o.resize_widget_dimensions = function (t) {
        if (t.widget_margins) {
            this.options.widget_margins = t.widget_margins
        }
        if (t.widget_base_dimensions) {
            this.options.widget_base_dimensions = t.widget_base_dimensions
        }
        this.min_widget_width = this.options.widget_margins[0] * 2 + this.options.widget_base_dimensions[0];
        this.min_widget_height = this.options.widget_margins[1] * 2 + this.options.widget_base_dimensions[1];
        this.$widgets.each(e.proxy(function (t, n) {
            var r = e(n);
            var i = r.data();
            this.resize_widget(r, i.sizex, i.sizey)
        }, this));
        this.generate_grid_and_stylesheet();
        this.get_widgets_from_DOM();
        this.set_dom_grid_height();
        return false
    };
    o.init = function () {
        this.options.resize.enabled && this.setup_resize();
        this.generate_grid_and_stylesheet();
        this.get_widgets_from_DOM();
        this.set_dom_grid_height();
        this.$wrapper.addClass("ready");
        this.draggable();
        this.options.resize.enabled && this.resizable();
        e(t).bind("resize.gridster", throttle(e.proxy(this.recalculate_faux_grid, this), 200))
    };
    o.disable = function () {
        this.$wrapper.find(".player-revert").removeClass("player-revert");
        this.drag_api.disable();
        return this
    };
    o.enable = function () {
        this.drag_api.enable();
        return this
    };
    o.disable_resize = function () {
        this.$el.addClass("gs-resize-disabled");
        this.resize_api.disable();
        return this
    };
    o.enable_resize = function () {
        this.$el.removeClass("gs-resize-disabled");
        this.resize_api.enable();
        return this
    };
    o.add_widget = function (t, n, r, i, s, o) {
        var u;
        n || (n = 1);
        r || (r = 1);
        if (!i & !s) {
            u = this.next_position(n, r)
        } else {
            u = {
                col: i,
                row: s
            };
            this.empty_cells(i, s, n, r)
        }
        var a = e(t).attr({
            "data-col": u.col,
            "data-row": u.row,
            "data-sizex": n,
            "data-sizey": r
        }).addClass("gs-w").appendTo(this.$el).hide();
        this.$widgets = this.$widgets.add(a);
        this.register_widget(a);
        this.add_faux_rows(u.size_y);
        if (o) {
            this.set_widget_max_size(a, o)
        }
        this.set_dom_grid_height();
        return a.fadeIn()
    };
    o.set_widget_max_size = function (e, t) {
        e = typeof e === "number" ? this.$widgets.eq(e) : e;
        if (!e.length) {
            return this
        }
        var n = e.data("coords").grid;
        n.max_size_x = t[0];
        n.max_size_y = t[1];
        return this
    };
    o.add_resize_handle = function (t) {
        var n = this.options.resize.handle_append_to;
        e(this.resize_handle_tpl).appendTo(n ? e(n, t) : t);
        return this
    };
    o.resize_widget = function (e, t, n, r, i) {
        var s = e.coords().grid;
        r !== false && (r = true);
        t || (t = s.size_x);
        n || (n = s.size_y);
        if (t > this.cols) {
            t = this.cols
        }
        var o = s.size_y;
        var u = s.col;
        var a = u;
        if (r && u + t - 1 > this.cols) {
            var f = u + (t - 1) - this.cols;
            var l = u - f;
            a = Math.max(1, l)
        }
        if (n > o) {
            this.add_faux_rows(Math.max(n - o, 0))
        }
        var c = {
            col: a,
            row: s.row,
            size_x: t,
            size_y: n
        };
        this.mutate_widget_in_gridmap(e, s, c);
        this.set_dom_grid_height();
        if (i) {
            i.call(this, c.size_x, c.size_y)
        }
        return e
    };
    o.mutate_widget_in_gridmap = function (t, n, r) {
        var i = n.size_x;
        var s = n.size_y;
        var o = this.get_cells_occupied(n);
        var u = this.get_cells_occupied(r);
        var a = [];
        e.each(o.cols, function (t, n) {
            if (e.inArray(n, u.cols) === -1) {
                a.push(n)
            }
        });
        var f = [];
        e.each(u.cols, function (t, n) {
            if (e.inArray(n, o.cols) === -1) {
                f.push(n)
            }
        });
        var l = [];
        e.each(o.rows, function (t, n) {
            if (e.inArray(n, u.rows) === -1) {
                l.push(n)
            }
        });
        var c = [];
        e.each(u.rows, function (t, n) {
            if (e.inArray(n, o.rows) === -1) {
                c.push(n)
            }
        });
        this.remove_from_gridmap(n);
        if (f.length) {
            var h = [r.col, r.row, r.size_x, Math.min(s, r.size_y), t];
            this.empty_cells.apply(this, h)
        }
        if (c.length) {
            var p = [r.col, r.row, r.size_x, r.size_y, t];
            this.empty_cells.apply(this, p)
        }
        n.col = r.col;
        n.row = r.row;
        n.size_x = r.size_x;
        n.size_y = r.size_y;
        this.add_to_gridmap(r, t);
        t.removeClass("player-revert");
        t.data("coords").update({
            width: r.size_x * this.options.widget_base_dimensions[0] + (r.size_x - 1) * this.options.widget_margins[0] * 2,
            height: r.size_y * this.options.widget_base_dimensions[1] + (r.size_y - 1) * this.options.widget_margins[1] * 2
        });
        t.attr({
            "data-col": r.col,
            "data-row": r.row,
            "data-sizex": r.size_x,
            "data-sizey": r.size_y
        });
        if (a.length) {
            var d = [a[0], r.row, a.length, Math.min(s, r.size_y), t];
            this.remove_empty_cells.apply(this, d)
        }
        if (l.length) {
            var v = [r.col, r.row, r.size_x, r.size_y, t];
            this.remove_empty_cells.apply(this, v)
        }
        this.move_widget_up(t);
        return this
    };
    o.empty_cells = function (t, n, r, i, s) {
        var o = this.widgets_below({
            col: t,
            row: n - i,
            size_x: r,
            size_y: i
        });
        o.not(s).each(e.proxy(function (t, r) {
            var s = e(r).coords().grid;
            if (!(s.row <= n + i - 1)) {
                return
            }
            var o = n + i - s.row;
            this.move_widget_down(e(r), o)
        }, this));
        this.set_dom_grid_height();
        return this
    };
    o.remove_empty_cells = function (t, n, r, i, s) {
        var o = this.widgets_below({
            col: t,
            row: n,
            size_x: r,
            size_y: i
        });
        o.not(s).each(e.proxy(function (t, n) {
            this.move_widget_up(e(n), i)
        }, this));
        this.set_dom_grid_height();
        return this
    };
    o.next_position = function (e, t) {
        e || (e = 1);
        t || (t = 1);
        var n = this.gridmap;
        var r = n.length;
        var i = [];
        var s;
        for (var o = 1; o < r; o++) {
            s = n[o].length;
            for (var u = 1; u <= s; u++) {
                var a = this.can_move_to({
                    size_x: e,
                    size_y: t
                }, o, u);
                if (a) {
                    i.push({
                        col: o,
                        row: u,
                        size_y: t,
                        size_x: e
                    })
                }
            }
        }
        if (i.length) {
            return this.sort_by_row_and_col_asc(i)[0]
        }
        return false
    };
    o.remove_widget = function (t, n, r) {
        var i = t instanceof jQuery ? t : e(t);
        var s = i.coords().grid;
        if (e.isFunction(n)) {
            r = n;
            n = false
        }
        this.cells_occupied_by_placeholder = {};
        this.$widgets = this.$widgets.not(i);
        var o = this.widgets_below(i);
        this.remove_from_gridmap(s);
        i.fadeOut(e.proxy(function () {
            i.remove();
            if (!n) {
                o.each(e.proxy(function (t, n) {
                    this.move_widget_up(e(n), s.size_y)
                }, this))
            }
            this.set_dom_grid_height();
            if (r) {
                r.call(this, t)
            }
        }, this));
        return this
    };
    o.remove_all_widgets = function (t) {
        this.$widgets.each(e.proxy(function (e, n) {
            this.remove_widget(n, true, t)
        }, this));
        return this
    };
    o.serialize = function (t) {
        t || (t = this.$widgets);
        var n = [];
        t.each(e.proxy(function (t, r) {
            n.push(this.options.serialize_params(e(r), e(r).coords().grid))
        }, this));
        return n
    };
    o.serialize_changed = function () {
        return this.serialize(this.$changed)
    };
    o.register_widget = function (t) {
        var n = {
            col: parseInt(t.attr("data-col"), 10),
            row: parseInt(t.attr("data-row"), 10),
            size_x: parseInt(t.attr("data-sizex"), 10),
            size_y: parseInt(t.attr("data-sizey"), 10),
            max_size_x: parseInt(t.attr("data-max-sizex"), 10) || false,
            max_size_y: parseInt(t.attr("data-max-sizey"), 10) || false,
            el: t
        };
        if (this.options.avoid_overlapped_widgets && !this.can_move_to({
            size_x: n.size_x,
            size_y: n.size_y
        }, n.col, n.row)) {
            e.extend(n, this.next_position(n.size_x, n.size_y));
            t.attr({
                "data-col": n.col,
                "data-row": n.row,
                "data-sizex": n.size_x,
                "data-sizey": n.size_y
            })
        }
        t.data("coords", t.coords());
        t.data("coords").grid = n;
        this.add_to_gridmap(n, t);
        this.options.resize.enabled && this.add_resize_handle(t);
        return this
    };
    o.update_widget_position = function (e, t) {
        this.for_each_cell_occupied(e, function (e, n) {
            if (!this.gridmap[e]) {
                return this
            }
            this.gridmap[e][n] = t
        });
        return this
    };
    o.remove_from_gridmap = function (e) {
        return this.update_widget_position(e, false)
    };
    o.add_to_gridmap = function (t, n) {
        this.update_widget_position(t, n || t.el);
        if (t.el) {
            var r = this.widgets_below(t.el);
            r.each(e.proxy(function (t, n) {
                this.move_widget_up(e(n))
            }, this))
        }
    };
    o.draggable = function () {
        var t = this;
        var n = e.extend(true, {}, this.options.draggable, {
            offset_left: this.options.widget_margins[0],
            container_width: this.container_width,
            ignore_dragging: ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "." + this.options.resize.handle_class],
            start: function (n, r) {
                t.$widgets.filter(".player-revert").removeClass("player-revert");
                t.$player = e(this);
                t.$helper = e(r.$helper);
                t.helper = !t.$helper.is(t.$player);
                t.on_start_drag.call(t, n, r);
                t.$el.trigger("gridster:dragstart")
            },
            stop: function (e, n) {
                t.on_stop_drag.call(t, e, n);
                t.$el.trigger("gridster:dragstop")
            },
            drag: throttle(function (e, n) {
                t.on_drag.call(t, e, n);
                t.$el.trigger("gridster:drag")
            }, 60)
        });
        this.drag_api = this.$el.drag(n);
        return this
    };
    o.resizable = function () {
        this.resize_api = this.$el.drag({
            items: "." + this.options.resize.handle_class,
            offset_left: this.options.widget_margins[0],
            container_width: this.container_width,
            move_element: false,
            start: e.proxy(this.on_start_resize, this),
            stop: e.proxy(function (t, n) {
                delay(e.proxy(function () {
                    this.on_stop_resize(t, n)
                }, this), 120)
            }, this),
            drag: throttle(e.proxy(this.on_resize, this), 60)
        });
        return this
    };
    o.setup_resize = function () {
        this.resize_handle_class = this.options.resize.handle_class;
        var t = this.options.resize.axes;
        var n = '<span class="' + this.resize_handle_class + " " + this.resize_handle_class + '-{type}" />';
        this.resize_handle_tpl = e.map(t, function (e) {
            return n.replace("{type}", e)
        }).join("");
        return this
    };
    o.on_start_drag = function (t, n) {
        this.$helper.add(this.$player).add(this.$wrapper).addClass("dragging");
        this.$player.addClass("player");
        this.player_grid_data = this.$player.coords().grid;
        this.placeholder_grid_data = e.extend({}, this.player_grid_data);
        this.$el.css("height", this.$el.height() + this.player_grid_data.size_y * this.min_widget_height);
        var r = this.faux_grid;
        var i = this.$player.data("coords").coords;
        this.cells_occupied_by_player = this.get_cells_occupied(this.player_grid_data);
        this.cells_occupied_by_placeholder = this.get_cells_occupied(this.placeholder_grid_data);
        this.last_cols = [];
        this.last_rows = [];
        this.collision_api = this.$helper.collision(r, this.options.collision);
        this.$preview_holder = e("<" + this.$player.get(0).tagName + " />", {
            "class": "preview-holder",
            "data-row": this.$player.attr("data-row"),
            "data-col": this.$player.attr("data-col"),
            css: {
                width: i.width,
                height: i.height
            }
        }).appendTo(this.$el);
        if (this.options.draggable.start) {
            this.options.draggable.start.call(this, t, n)
        }
    };
    o.on_drag = function (e, t) {
        if (this.$player === null) {
            return false
        }
        var n = {
            left: t.position.left + this.baseX,
            top: t.position.top + this.baseY
        };
        this.colliders_data = this.collision_api.get_closest_colliders(n);
        this.on_overlapped_column_change(this.on_start_overlapping_column, this.on_stop_overlapping_column);
        this.on_overlapped_row_change(this.on_start_overlapping_row, this.on_stop_overlapping_row);
        if (this.helper && this.$player) {
            this.$player.css({
                left: t.position.left,
                top: t.position.top
            })
        }
        if (this.options.draggable.drag) {
            this.options.draggable.drag.call(this, e, t)
        }
    };
    o.on_stop_drag = function (e, t) {
        this.$helper.add(this.$player).add(this.$wrapper).removeClass("dragging");
        t.position.left = t.position.left + this.baseX;
        t.position.top = t.position.top + this.baseY;
        this.colliders_data = this.collision_api.get_closest_colliders(t.position);
        this.on_overlapped_column_change(this.on_start_overlapping_column, this.on_stop_overlapping_column);
        this.on_overlapped_row_change(this.on_start_overlapping_row, this.on_stop_overlapping_row);
        this.$player.addClass("player-revert").removeClass("player").attr({
            "data-col": this.placeholder_grid_data.col,
            "data-row": this.placeholder_grid_data.row
        }).css({
            left: "",
            top: ""
        });
        this.$changed = this.$changed.add(this.$player);
        this.cells_occupied_by_player = this.get_cells_occupied(this.placeholder_grid_data);
        this.set_cells_player_occupies(this.placeholder_grid_data.col, this.placeholder_grid_data.row);
        this.$player.coords().grid.row = this.placeholder_grid_data.row;
        this.$player.coords().grid.col = this.placeholder_grid_data.col;
        if (this.options.draggable.stop) {
            this.options.draggable.stop.call(this, e, t)
        }
        this.$preview_holder.remove();
        this.$player = null;
        this.$helper = null;
        this.placeholder_grid_data = {};
        this.player_grid_data = {};
        this.cells_occupied_by_placeholder = {};
        this.cells_occupied_by_player = {};
        this.set_dom_grid_height()
    };
    o.on_start_resize = function (t, n) {
        this.$resized_widget = n.$player.closest(".gs-w");
        this.resize_coords = this.$resized_widget.coords();
        this.resize_wgd = this.resize_coords.grid;
        this.resize_initial_width = this.resize_coords.coords.width;
        this.resize_initial_height = this.resize_coords.coords.height;
        this.resize_initial_sizex = this.resize_coords.grid.size_x;
        this.resize_initial_sizey = this.resize_coords.grid.size_y;
        this.resize_last_sizex = this.resize_initial_sizex;
        this.resize_last_sizey = this.resize_initial_sizey;
        this.resize_max_size_x = Math.min(this.resize_wgd.max_size_x || this.options.resize.max_size[0], this.cols - this.resize_wgd.col + 1);
        this.resize_max_size_y = this.resize_wgd.max_size_y || this.options.resize.max_size[1];
        this.resize_dir = {
            right: n.$player.is("." + this.resize_handle_class + "-x"),
            bottom: n.$player.is("." + this.resize_handle_class + "-y")
        };
        // this.$resized_widget.css({
        //     "min-width": this.options.widget_base_dimensions[0],
        //     "min-height": this.options.widget_base_dimensions[1]
        // });
        var r = this.$resized_widget.get(0).tagName;
        this.$resize_preview_holder = e("<" + r + " />", {
            "class": "preview-holder resize-preview-holder",
            "data-row": this.$resized_widget.attr("data-row"),
            "data-col": this.$resized_widget.attr("data-col"),
            css: {
                width: this.resize_initial_width,
                height: this.resize_initial_height
            }
        }).appendTo(this.$el);
        this.$resized_widget.addClass("resizing");
        if (this.options.resize.start) {
            this.options.resize.start.call(this, t, n, this.$resized_widget)
        }
    };
    o.on_stop_resize = function (t, n) {
        this.$resized_widget.removeClass("resizing").css({
            width: "",
            height: ""
        });
        delay(e.proxy(function () {
            this.$resize_preview_holder.remove().css({
                "min-width": "",
                "min-height": ""
            })
        }, this), 300);
        if (this.options.resize.stop) {
            this.options.resize.stop.call(this, t, n, this.$resized_widget)
        }
    };
    o.on_resize = function (e, t) {
        var n = t.pointer.diff_left;
        var r = t.pointer.diff_top;
        var i = this.options.widget_base_dimensions[0];
        var s = this.options.widget_base_dimensions[1];
        var o = Infinity;
        var u = Infinity;
        var a = Math.ceil(n / (this.options.widget_base_dimensions[0] + this.options.widget_margins[0] * 2) - .2);
        var f = Math.ceil(r / (this.options.widget_base_dimensions[1] + this.options.widget_margins[1] * 2) - .2);
        var l = Math.max(1, this.resize_initial_sizex + a);
        var c = Math.max(1, this.resize_initial_sizey + f);
        l = Math.min(l, this.resize_max_size_x);
        o = this.resize_max_size_x * i + (l - 1) * this.options.widget_margins[0] * 2;
        c = Math.min(c, this.resize_max_size_y);
        u = this.resize_max_size_y * s + (c - 1) * this.options.widget_margins[1] * 2;
        if (this.resize_dir.right) {
            c = this.resize_initial_sizey
        } else if (this.resize_dir.bottom) {
            l = this.resize_initial_sizex
        }
        var h = {};
        !this.resize_dir.bottom && (h.width = Math.min(this.resize_initial_width + n, o));
        !this.resize_dir.right && (h.height = Math.min(this.resize_initial_height + r, u));
        this.$resized_widget.css(h);
        if (l !== this.resize_last_sizex || c !== this.resize_last_sizey) {
            this.resize_widget(this.$resized_widget, l, c, false);
            this.$resize_preview_holder.css({
                width: "",
                height: ""
            }).attr({
                "data-row": this.$resized_widget.attr("data-row"),
                "data-sizex": l,
                "data-sizey": c
            })
        }
        if (this.options.resize.resize) {
            this.options.resize.resize.call(this, e, t, this.$resized_widget)
        }
        this.resize_last_sizex = l;
        this.resize_last_sizey = c
    };
    o.on_overlapped_column_change = function (t, n) {
        if (!this.colliders_data.length) {
            return this
        }
        var r = this.get_targeted_columns(this.colliders_data[0].el.data.col);
        var i = this.last_cols.length;
        var s = r.length;
        var o;
        for (o = 0; o < s; o++) {
            if (e.inArray(r[o], this.last_cols) === -1) {
                (t || e.noop).call(this, r[o])
            }
        }
        for (o = 0; o < i; o++) {
            if (e.inArray(this.last_cols[o], r) === -1) {
                (n || e.noop).call(this, this.last_cols[o])
            }
        }
        this.last_cols = r;
        return this
    };
    o.on_overlapped_row_change = function (t, n) {
        if (!this.colliders_data.length) {
            return this
        }
        var r = this.get_targeted_rows(this.colliders_data[0].el.data.row);
        var i = this.last_rows.length;
        var s = r.length;
        var o;
        for (o = 0; o < s; o++) {
            if (e.inArray(r[o], this.last_rows) === -1) {
                (t || e.noop).call(this, r[o])
            }
        }
        for (o = 0; o < i; o++) {
            if (e.inArray(this.last_rows[o], r) === -1) {
                (n || e.noop).call(this, this.last_rows[o])
            }
        }
        this.last_rows = r
    };
    o.set_player = function (e, t, n) {
        var r = this;
        if (!n) {
            this.empty_cells_player_occupies()
        }
        var i = !n ? r.colliders_data[0].el.data : {
            col: e
        };
        var s = i.col;
        var o = t || i.row;
        this.player_grid_data = {
            col: s,
            row: o,
            size_y: this.player_grid_data.size_y,
            size_x: this.player_grid_data.size_x
        };
        this.cells_occupied_by_player = this.get_cells_occupied(this.player_grid_data);
        var u = this.get_widgets_overlapped(this.player_grid_data);
        var a = this.widgets_constraints(u);
        this.manage_movements(a.can_go_up, s, o);
        this.manage_movements(a.can_not_go_up, s, o);
        if (!u.length) {
            var f = this.can_go_player_up(this.player_grid_data);
            if (f !== false) {
                o = f
            }
            this.set_placeholder(s, o)
        }
        return {
            col: s,
            row: o
        }
    };
    o.widgets_constraints = function (t) {
        var n = e([]);
        var r;
        var i = [];
        var s = [];
        t.each(e.proxy(function (t, r) {
            var o = e(r);
            var u = o.coords().grid;
            if (this.can_go_widget_up(u)) {
                n = n.add(o);
                i.push(u)
            } else {
                s.push(u)
            }
        }, this));
        r = t.not(n);
        return {
            can_go_up: this.sort_by_row_asc(i),
            can_not_go_up: this.sort_by_row_desc(s)
        }
    };
    o.sort_by_row_asc = function (t) {
        t = t.sort(function (t, n) {
            if (!t.row) {
                t = e(t).coords().grid;
                n = e(n).coords().grid
            }
            if (t.row > n.row) {
                return 1
            }
            return -1
        });
        return t
    };
    o.sort_by_row_and_col_asc = function (e) {
        e = e.sort(function (e, t) {
            if (e.row > t.row || e.row === t.row && e.col > t.col) {
                return 1
            }
            return -1
        });
        return e
    };
    o.sort_by_col_asc = function (e) {
        e = e.sort(function (e, t) {
            if (e.col > t.col) {
                return 1
            }
            return -1
        });
        return e
    };
    o.sort_by_row_desc = function (e) {
        e = e.sort(function (e, t) {
            if (e.row + e.size_y < t.row + t.size_y) {
                return 1
            }
            return -1
        });
        return e
    };
    o.manage_movements = function (t, n, r) {
        e.each(t, e.proxy(function (e, t) {
            var i = t;
            var s = i.el;
            var o = this.can_go_widget_up(i);
            if (o) {
                this.move_widget_to(s, o);
                this.set_placeholder(n, o + i.size_y)
            } else {
                var u = this.can_go_player_up(this.player_grid_data);
                if (!u) {
                    var a = r + this.player_grid_data.size_y - i.row;
                    this.move_widget_down(s, a);
                    this.set_placeholder(n, r)
                }
            }
        }, this));
        return this
    };
    o.is_player = function (e, t) {
        if (t && !this.gridmap[e]) {
            return false
        }
        var n = t ? this.gridmap[e][t] : e;
        return n && (n.is(this.$player) || n.is(this.$helper))
    };
    o.is_player_in = function (t, n) {
        var r = this.cells_occupied_by_player || {};
        return e.inArray(t, r.cols) >= 0 && e.inArray(n, r.rows) >= 0
    };
    o.is_placeholder_in = function (t, n) {
        var r = this.cells_occupied_by_placeholder || {};
        return this.is_placeholder_in_col(t) && e.inArray(n, r.rows) >= 0
    };
    o.is_placeholder_in_col = function (t) {
        var n = this.cells_occupied_by_placeholder || [];
        return e.inArray(t, n.cols) >= 0
    };
    o.is_empty = function (e, t) {
        if (typeof this.gridmap[e] !== "undefined") {
            if (typeof this.gridmap[e][t] !== "undefined" && this.gridmap[e][t] === false) {
                return true
            }
            return false
        }
        return true
    };
    o.is_occupied = function (e, t) {
        if (!this.gridmap[e]) {
            return false
        }
        if (this.gridmap[e][t]) {
            return true
        }
        return false
    };
    o.is_widget = function (e, t) {
        var n = this.gridmap[e];
        if (!n) {
            return false
        }
        n = n[t];
        if (n) {
            return n
        }
        return false
    };
    o.is_widget_under_player = function (e, t) {
        if (this.is_widget(e, t)) {
            return this.is_player_in(e, t)
        }
        return false
    };
    o.get_widgets_under_player = function (t) {
        t || (t = this.cells_occupied_by_player || {
            cols: [],
            rows: []
        });
        var n = e([]);
        e.each(t.cols, e.proxy(function (r, i) {
            e.each(t.rows, e.proxy(function (e, t) {
                if (this.is_widget(i, t)) {
                    n = n.add(this.gridmap[i][t])
                }
            }, this))
        }, this));
        return n
    };
    o.set_placeholder = function (t, n) {
        var r = e.extend({}, this.placeholder_grid_data);
        var i = this.widgets_below({
            col: r.col,
            row: r.row,
            size_y: r.size_y,
            size_x: r.size_x
        });
        var s = t + r.size_x - 1;
        if (s > this.cols) {
            t = t - (s - t)
        }
        var o = this.placeholder_grid_data.row < n;
        var u = this.placeholder_grid_data.col !== t;
        this.placeholder_grid_data.col = t;
        this.placeholder_grid_data.row = n;
        this.cells_occupied_by_placeholder = this.get_cells_occupied(this.placeholder_grid_data);
        this.$preview_holder.attr({
            "data-row": n,
            "data-col": t
        });
        if (o || u) {
            i.each(e.proxy(function (n, i) {
                this.move_widget_up(e(i), this.placeholder_grid_data.col - t + r.size_y)
            }, this))
        }
        var a = this.get_widgets_under_player(this.cells_occupied_by_placeholder);
        if (a.length) {
            a.each(e.proxy(function (t, i) {
                var s = e(i);
                this.move_widget_down(s, n + r.size_y - s.data("coords").grid.row)
            }, this))
        }
    };
    o.can_go_player_up = function (e) {
        var t = e.row + e.size_y - 1;
        var n = true;
        var r = [];
        var i = 1e4;
        var s = this.get_widgets_under_player();
        this.for_each_column_occupied(e, function (e) {
            var o = this.gridmap[e];
            var u = t + 1;
            r[e] = [];
            while (--u > 0) {
                if (this.is_empty(e, u) || this.is_player(e, u) || this.is_widget(e, u) && o[u].is(s)) {
                    r[e].push(u);
                    i = u < i ? u : i
                } else {
                    break
                }
            }
            if (r[e].length === 0) {
                n = false;
                return true
            }
            r[e].sort(function (e, t) {
                return e - t
            })
        });
        if (!n) {
            return false
        }
        return this.get_valid_rows(e, r, i)
    };
    o.can_go_widget_up = function (e) {
        var t = e.row + e.size_y - 1;
        var n = true;
        var r = [];
        var i = 1e4;
        this.for_each_column_occupied(e, function (s) {
            var o = this.gridmap[s];
            r[s] = [];
            var u = t + 1;
            while (--u > 0) {
                if (this.is_widget(s, u) && !this.is_player_in(s, u)) {
                    if (!o[u].is(e.el)) {
                        break
                    }
                }
                if (!this.is_player(s, u) && !this.is_placeholder_in(s, u) && !this.is_player_in(s, u)) {
                    r[s].push(u)
                }
                if (u < i) {
                    i = u
                }
            }
            if (r[s].length === 0) {
                n = false;
                return true
            }
            r[s].sort(function (e, t) {
                return e - t
            })
        });
        if (!n) {
            return false
        }
        return this.get_valid_rows(e, r, i)
    };
    o.get_valid_rows = function (t, n, r) {
        var i = t.row;
        var s = t.row + t.size_y - 1;
        var o = t.size_y;
        var u = r - 1;
        var a = [];
        while (++u <= s) {
            var f = true;
            e.each(n, function (t, n) {
                if (e.isArray(n) && e.inArray(u, n) === -1) {
                    f = false
                }
            });
            if (f === true) {
                a.push(u);
                if (a.length === o) {
                    break
                }
            }
        }
        var l = false;
        if (o === 1) {
            if (a[0] !== i) {
                l = a[0] || false
            }
        } else {
            if (a[0] !== i) {
                l = this.get_consecutive_numbers_index(a, o)
            }
        }
        return l
    };
    o.get_consecutive_numbers_index = function (e, t) {
        var n = e.length;
        var r = [];
        var i = true;
        var s = -1;
        for (var o = 0; o < n; o++) {
            if (i || e[o] === s + 1) {
                r.push(o);
                if (r.length === t) {
                    break
                }
                i = false
            } else {
                r = [];
                i = true
            }
            s = e[o]
        }
        return r.length >= t ? e[r[0]] : false
    };
    o.get_widgets_overlapped = function () {
        var t;
        var n = e([]);
        var r = [];
        var i = this.cells_occupied_by_player.rows.slice(0);
        i.reverse();
        e.each(this.cells_occupied_by_player.cols, e.proxy(function (t, s) {
            e.each(i, e.proxy(function (t, i) {
                if (!this.gridmap[s]) {
                    return true
                }
                var o = this.gridmap[s][i];
                if (this.is_occupied(s, i) && !this.is_player(o) && e.inArray(o, r) === -1) {
                    n = n.add(o);
                    r.push(o)
                }
            }, this))
        }, this));
        return n
    };
    o.on_start_overlapping_column = function (e) {
        this.set_player(e, false)
    };
    o.on_start_overlapping_row = function (e) {
        this.set_player(false, e)
    };
    o.on_stop_overlapping_column = function (e) {
        this.set_player(e, false);
        var t = this;
        this.for_each_widget_below(e, this.cells_occupied_by_player.rows[0], function (e, n) {
            t.move_widget_up(this, t.player_grid_data.size_y)
        })
    };
    o.on_stop_overlapping_row = function (e) {
        this.set_player(false, e);
        var t = this;
        var n = this.cells_occupied_by_player.cols;
        for (var r = 0, i = n.length; r < i; r++) {
            this.for_each_widget_below(n[r], e, function (e, n) {
                t.move_widget_up(this, t.player_grid_data.size_y)
            })
        }
    };
    o.move_widget_to = function (t, n) {
        var r = this;
        var i = t.coords().grid;
        var s = n - i.row;
        var o = this.widgets_below(t);
        var u = this.can_move_to(i, i.col, n, t);
        if (u === false) {
            return false
        }
        this.remove_from_gridmap(i);
        i.row = n;
        this.add_to_gridmap(i);
        t.attr("data-row", n);
        this.$changed = this.$changed.add(t);
        o.each(function (t, n) {
            var i = e(n);
            var s = i.coords().grid;
            var o = r.can_go_widget_up(s);
            if (o && o !== s.row) {
                r.move_widget_to(i, o)
            }
        });
        return this
    };
    o.move_widget_up = function (t, n) {
        var r = t.coords().grid;
        var i = r.row;
        var s = [];
        var o = true;
        n || (n = 1);
        if (!this.can_go_up(t)) {
            return false
        }
        this.for_each_column_occupied(r, function (r) {
            if (e.inArray(t, s) === -1) {
                var o = t.coords().grid;
                var u = i - n;
                u = this.can_go_up_to_row(o, r, u);
                if (!u) {
                    return true
                }
                var a = this.widgets_below(t);
                this.remove_from_gridmap(o);
                o.row = u;
                this.add_to_gridmap(o);
                t.attr("data-row", o.row);
                this.$changed = this.$changed.add(t);
                s.push(t);
                a.each(e.proxy(function (t, r) {
                    this.move_widget_up(e(r), n)
                }, this))
            }
        })
    };
    o.move_widget_down = function (t, n) {
        var r, i, s, o;
        if (n <= 0) {
            return false
        }
        r = t.coords().grid;
        i = r.row;
        s = [];
        o = n;
        if (!t) {
            return false
        }
        if (e.inArray(t, s) === -1) {
            var u = t.coords().grid;
            var a = i + n;
            var f = this.widgets_below(t);
            this.remove_from_gridmap(u);
            f.each(e.proxy(function (t, n) {
                var r = e(n);
                var i = r.coords().grid;
                var s = this.displacement_diff(i, u, o);
                if (s > 0) {
                    this.move_widget_down(r, s)
                }
            }, this));
            u.row = a;
            this.update_widget_position(u, t);
            t.attr("data-row", u.row);
            this.$changed = this.$changed.add(t);
            s.push(t)
        }
    };
    o.can_go_up_to_row = function (t, n, r) {
        var i = this.gridmap;
        var s = true;
        var o = [];
        var u = t.row;
        var a;
        this.for_each_column_occupied(t, function (e) {
            var t = i[e];
            o[e] = [];
            a = u;
            while (a--) {
                if (this.is_empty(e, a) && !this.is_placeholder_in(e, a)) {
                    o[e].push(a)
                } else {
                    break
                }
            }
            if (!o[e].length) {
                s = false;
                return true
            }
        });
        if (!s) {
            return false
        }
        a = r;
        for (a = 1; a < u; a++) {
            var f = true;
            for (var l = 0, c = o.length; l < c; l++) {
                if (o[l] && e.inArray(a, o[l]) === -1) {
                    f = false
                }
            }
            if (f === true) {
                s = a;
                break
            }
        }
        return s
    };
    o.displacement_diff = function (e, t, n) {
        var r = e.row;
        var i = [];
        var s = t.row + t.size_y;
        this.for_each_column_occupied(e, function (e) {
            var t = 0;
            for (var n = s; n < r; n++) {
                if (this.is_empty(e, n)) {
                    t = t + 1
                }
            }
            i.push(t)
        });
        var o = Math.max.apply(Math, i);
        n = n - o;
        return n > 0 ? n : 0
    };
    o.widgets_below = function (t) {
        var n = e.isPlainObject(t) ? t : t.coords().grid;
        var r = this;
        var i = this.gridmap;
        var s = n.row + n.size_y - 1;
        var o = e([]);
        this.for_each_column_occupied(n, function (t) {
            r.for_each_widget_below(t, s, function (t, n) {
                if (!r.is_player(this) && e.inArray(this, o) === -1) {
                    o = o.add(this);
                    return true
                }
            })
        });
        return this.sort_by_row_asc(o)
    };
    o.set_cells_player_occupies = function (e, t) {
        this.remove_from_gridmap(this.placeholder_grid_data);
        this.placeholder_grid_data.col = e;
        this.placeholder_grid_data.row = t;
        this.add_to_gridmap(this.placeholder_grid_data, this.$player);
        return this
    };
    o.empty_cells_player_occupies = function () {
        this.remove_from_gridmap(this.placeholder_grid_data);
        return this
    };
    o.can_go_up = function (e) {
        var t = e.coords().grid;
        var n = t.row;
        var r = n - 1;
        var i = this.gridmap;
        var s = [];
        var o = true;
        if (n === 1) {
            return false
        }
        this.for_each_column_occupied(t, function (e) {
            var t = this.is_widget(e, r);
            if (this.is_occupied(e, r) || this.is_player(e, r) || this.is_placeholder_in(e, r) || this.is_player_in(e, r)) {
                o = false;
                return true
            }
        });
        return o
    };
    o.can_move_to = function (e, t, n, r) {
        var i = this.gridmap;
        var s = e.el;
        var o = {
            size_y: e.size_y,
            size_x: e.size_x,
            col: t,
            row: n
        };
        var u = true;
        var a = t + e.size_x - 1;
        if (a > this.cols) {
            return false
        }
        if (r && r < n + e.size_y - 1) {
            return false
        }
        this.for_each_cell_occupied(o, function (t, n) {
            var r = this.is_widget(t, n);
            if (r && (!e.el || r.is(s))) {
                u = false
            }
        });
        return u
    };
    o.get_targeted_columns = function (e) {
        var t = (e || this.player_grid_data.col) + (this.player_grid_data.size_x - 1);
        var n = [];
        for (var r = e; r <= t; r++) {
            n.push(r)
        }
        return n
    };
    o.get_targeted_rows = function (e) {
        var t = (e || this.player_grid_data.row) + (this.player_grid_data.size_y - 1);
        var n = [];
        for (var r = e; r <= t; r++) {
            n.push(r)
        }
        return n
    };
    o.get_cells_occupied = function (e) {
        var t = {
            cols: [],
            rows: []
        };
        var n;
        if (arguments[1] instanceof jQuery) {
            e = arguments[1].coords().grid
        }
        for (n = 0; n < e.size_x; n++) {
            var r = e.col + n;
            t.cols.push(r)
        }
        for (n = 0; n < e.size_y; n++) {
            var i = e.row + n;
            t.rows.push(i)
        }
        return t
    };
    o.for_each_cell_occupied = function (e, t) {
        this.for_each_column_occupied(e, function (n) {
            this.for_each_row_occupied(e, function (e) {
                t.call(this, n, e)
            })
        });
        return this
    };
    o.for_each_column_occupied = function (e, t) {
        for (var n = 0; n < e.size_x; n++) {
            var r = e.col + n;
            t.call(this, r, e)
        }
    };
    o.for_each_row_occupied = function (e, t) {
        for (var n = 0; n < e.size_y; n++) {
            var r = e.row + n;
            t.call(this, r, e)
        }
    };
    o._traversing_widgets = function (t, n, r, i, s) {
        var o = this.gridmap;
        if (!o[r]) {
            return
        }
        var u, a;
        var f = t + "/" + n;
        if (arguments[2] instanceof jQuery) {
            var l = arguments[2].coords().grid;
            r = l.col;
            i = l.row;
            s = arguments[3]
        }
        var c = [];
        var h = i;
        var p = {
            "for_each/above": function () {
                while (h--) {
                    if (h > 0 && this.is_widget(r, h) && e.inArray(o[r][h], c) === -1) {
                        u = s.call(o[r][h], r, h);
                        c.push(o[r][h]);
                        if (u) {
                            break
                        }
                    }
                }
            },
            "for_each/below": function () {
                for (h = i + 1, a = o[r].length; h < a; h++) {
                    if (this.is_widget(r, h) && e.inArray(o[r][h], c) === -1) {
                        u = s.call(o[r][h], r, h);
                        c.push(o[r][h]);
                        if (u) {
                            break
                        }
                    }
                }
            }
        };
        if (p[f]) {
            p[f].call(this)
        }
    };
    o.for_each_widget_above = function (e, t, n) {
        this._traversing_widgets("for_each", "above", e, t, n);
        return this
    };
    o.for_each_widget_below = function (e, t, n) {
        this._traversing_widgets("for_each", "below", e, t, n);
        return this
    };
    o.get_highest_occupied_cell = function () {
        var e;
        var t = this.gridmap;
        var n = [];
        var r = [];
        for (var i = t.length - 1; i >= 1; i--) {
            for (e = t[i].length - 1; e >= 1; e--) {
                if (this.is_widget(i, e)) {
                    n.push(e);
                    r[e] = i;
                    break
                }
            }
        }
        var s = Math.max.apply(Math, n);
        this.highest_occupied_cell = {
            col: r[s],
            row: s
        };
        return this.highest_occupied_cell
    };
    o.get_widgets_from = function (t, n) {
        var r = this.gridmap;
        var i = e();
        if (t) {
            i = i.add(this.$widgets.filter(function () {
                var n = e(this).attr("data-col");
                return n === t || n > t
            }))
        }
        if (n) {
            i = i.add(this.$widgets.filter(function () {
                var t = e(this).attr("data-row");
                return t === n || t > n
            }))
        }
        return i
    };
    o.set_dom_grid_height = function () {
        var e = this.get_highest_occupied_cell().row;
        this.$el.css("height", (e * this.min_widget_height)+100);
        return this
    };
    o.generate_stylesheet = function (t) {
        var n = "";
        var r = this.options.max_size_x || this.cols;
        var i = 0;
        var o = 0;
        var u;
        var a;
        t || (t = {});
        t.cols || (t.cols = this.cols);
        t.rows || (t.rows = this.rows);
        t.namespace || (t.namespace = this.options.namespace);
        t.widget_base_dimensions || (t.widget_base_dimensions = this.options.widget_base_dimensions);
        t.widget_margins || (t.widget_margins = this.options.widget_margins);
        t.min_widget_width = t.widget_margins[0] * 2 + t.widget_base_dimensions[0];
        t.min_widget_height = t.widget_margins[1] * 2 + t.widget_base_dimensions[1];
        var f = e.param(t);
        s.generated_stylesheets.push(f);
        for (u = t.cols; u >= 0; u--) {
            n += t.namespace + ' [data-col="' + (u + 1) + '"] { left:' + (u * t.widget_base_dimensions[0] + u * t.widget_margins[0] + (u + 1) * t.widget_margins[0]) + "px; }\n"
        }
        for (u = t.rows; u >= 0; u--) {
            n += t.namespace + ' [data-row="' + (u + 1) + '"] { top:' + (u * t.widget_base_dimensions[1] + u * t.widget_margins[1] + (u + 1) * t.widget_margins[1]) + "px; }\n"
        }
        for (var l = 1; l <= t.rows; l++) {
            n += t.namespace + ' [data-sizey="' + l + '"] { height:' + (l * t.widget_base_dimensions[1] + (l - 1) * t.widget_margins[1] * 2) + "px; }\n"
        }
        for (var c = 1; c <= r; c++) {
            n += t.namespace + ' [data-sizex="' + c + '"] { width:' + (c * t.widget_base_dimensions[0] + (c - 1) * t.widget_margins[0] * 2) + "px; }\n"
        }
        return this.add_style_tag(n)
    };
    o.add_style_tag = function (e) {
        var t = n;
        var r = t.createElement("style");
        t.getElementsByTagName("head")[0].appendChild(r);
        r.setAttribute("type", "text/css");
        r.setAttribute("generated-from", "gridster");
        if (r.styleSheet) {
            r.styleSheet.cssText = e
        } else {
            r.appendChild(n.createTextNode(e))
        }
        this.$style_tags = this.$style_tags.add(r);
        return this
    };
    o.remove_style_tags = function () {
        this.$style_tags.remove()
    };
    o.generate_faux_grid = function (e, t) {
        this.faux_grid = [];
        this.gridmap = [];
        var n;
        var r;
        for (n = t; n > 0; n--) {
            this.gridmap[n] = [];
            for (r = e; r > 0; r--) {
                this.add_faux_cell(r, n)
            }
        }
        return this
    };
    o.add_faux_cell = function (t, n) {
        var r = e({
            left: this.baseX + (n - 1) * this.min_widget_width,
            top: this.baseY + (t - 1) * this.min_widget_height,
            width: this.min_widget_width,
            height: this.min_widget_height,
            col: n,
            row: t,
            original_col: n,
            original_row: t
        }).coords();
        if (!e.isArray(this.gridmap[n])) {
            this.gridmap[n] = []
        }
        this.gridmap[n][t] = false;
        this.faux_grid.push(r);
        return this
    };
    o.add_faux_rows = function (e) {
        var t = this.rows;
        var n = t + (e || 1);
        for (var r = n; r > t; r--) {
            for (var i = this.cols; i >= 1; i--) {
                this.add_faux_cell(r, i)
            }
        }
        this.rows = n;
        if (this.options.autogenerate_stylesheet) {
            this.generate_stylesheet()
        }
        return this
    };
    o.add_faux_cols = function (e) {
        var t = this.cols;
        var n = t + (e || 1);
        for (var r = t; r < n; r++) {
            for (var i = this.rows; i >= 1; i--) {
                this.add_faux_cell(i, r)
            }
        }
        this.cols = n;
        if (this.options.autogenerate_stylesheet) {
            this.generate_stylesheet()
        }
        return this
    };
    o.recalculate_faux_grid = function () {
        var n = this.$wrapper.width();
        this.baseX = (e(t).width() - n) / 2;
        this.baseY = this.$wrapper.offset().top;
        e.each(this.faux_grid, e.proxy(function (e, t) {
            this.faux_grid[e] = t.update({
                left: this.baseX + (t.data.col - 1) * this.min_widget_width,
                top: this.baseY + (t.data.row - 1) * this.min_widget_height
            })
        }, this));
        return this
    };
    o.get_widgets_from_DOM = function () {
        this.$widgets.each(e.proxy(function (t, n) {
            this.register_widget(e(n))
        }, this));
        return this
    };
    o.generate_grid_and_stylesheet = function () {
        var n = this.$wrapper.width();
        var r = this.$wrapper.height();
        var i = this.options.max_cols;
        var s = Math.floor(n / this.min_widget_width) + this.options.extra_cols;
        var o = this.$widgets.map(function () {
            return e(this).attr("data-col")
        }).get();
        o.length || (o = [0]);
        var u = Math.max.apply(Math, o);
        var a = this.options.extra_rows;
        this.$widgets.each(function (t, n) {
            a += +e(n).attr("data-sizey")
        });
        this.cols = Math.max(u, s, this.options.min_cols);
        if (i && i >= u && i < this.cols) {
            this.cols = i
        }
        this.rows = Math.max(a, this.options.min_rows);
        this.baseX = (e(t).width() - n) / 2;
        this.baseY = this.$wrapper.offset().top;
        this.container_width = this.cols * this.options.widget_base_dimensions[0] + (this.cols - 1) * 2 * this.options.widget_margins[0];
        if (this.options.autogenerate_stylesheet) {
            this.generate_stylesheet()
        }
        return this.generate_faux_grid(this.rows, this.cols)
    };
    o.destroy = function () {
        e(t).unbind(".gridster");
        if (this.drag_api) {
            this.drag_api.destroy()
        }
        this.remove_style_tags();
        this.$el.remove();
        return this
    };
    e.fn.gridster = function (t) {
        return this.each(function () {
            if (!e(this).data("gridster")) {
                e(this).data("gridster", new s(this, t))
            }
        })
    };
    e.Gridster = o
})(jQuery, window, document)

(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function split_css_unit(value) {
        const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
        return split ? [parseFloat(split[1]), split[2] || 'px'] : [value, 'px'];
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.58.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$8 } = globals;

    // (267:0) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$8(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // import UIDATA from "../stores/UiData.js";

    var State = writable({
        lang: 'ita',
        isFavOpen: false
    });

    var Store = writable({
        favs: []
    });

    const LANGS = ['ita', 'eng'];

    const HEADER = 'Menu';
    const SUBHEADER = {
        ita: 'Benvenuti nel nostro ristorante! Abbiamo creato un menu digitale per aiutarvi a navigare la nostra offerta di cibo e bevande. Sfogliate le pagine, scegliete i vostri piatti preferiti e preparatevi ad assaporare la nostra prelibata cucina. Buon appetito!',
        eng: 'Welcome to our restaurant! We have created a digital menu to help you navigate our food and drink offerings. Browse through the pages, choose your favorite dishes, and get ready to taste our delicious cuisine. Enjoy your meal!'
    };
    const NAV = 'Menu';

    const PRODUCTGROUPS = [
        {
            ita: {
                title: 'Cibo',
                subtitle: 'Scopri i nostri deliziosi piatti'
            },
            eng: {
                title: 'Food',
                subtitle: 'Translate: Scopri i nostri deliziosi piatti'
            }
        },
        {
            ita: {
                title: 'Bevande',
                subtitle: 'Scopri i nostri deliziosi piatti'
            },
            eng: {
                title: 'Drinks',
                subtitle: 'Translate: Scopri i nostri deliziosi piatti'
            }
        }
    ];


    const FOODGROUPS = {
        ita: ['Antipasti', 'Primi', 'Secondi', 'Dessert'],
        eng: ['Starters', 'First courses', 'Second Courses', 'Dessert']
    };
    const DRINKGROUPS = {
        ita: ['Vino rosso', 'Vino bianco', 'Birre', 'Analcolici'],
        eng: ['Red wine', 'White wine', 'Beers', 'Drinks']
    };

    const FAVSTITLE = {
        ita: "Preferiti",
        eng: "Favorites"
    };
    const FAVSCLEARBUTTON = {
        ita: "Rimuovi tutti",
        eng: "Clear favorites"
    };

    const UIDATA = {
        LANGS,
        HEADER,
        SUBHEADER,
        NAV,
        PRODUCTGROUPS,
        FOODGROUPS,
        DRINKGROUPS,
        FAVSTITLE,
        FAVSCLEARBUTTON
    };

    /* src\components\Header.svelte generated by Svelte v3.58.0 */
    const file$i = "src\\components\\Header.svelte";

    function create_fragment$i(ctx) {
    	let header;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let h1;
    	let t2;
    	let div2;
    	let p;
    	let t3;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*title*/ ctx[1]}`;
    			t2 = space();
    			div2 = element("div");
    			p = element("p");
    			t3 = text(/*subtitle*/ ctx[0]);
    			if (!src_url_equal(img.src, img_src_value = "./img/header.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1bj9ysv");
    			add_location(img, file$i, 11, 8, 249);
    			add_location(h1, file$i, 13, 12, 334);
    			attr_dev(div0, "class", "page-title svelte-1bj9ysv");
    			add_location(div0, file$i, 12, 8, 296);
    			attr_dev(div1, "class", "header-image svelte-1bj9ysv");
    			add_location(div1, file$i, 10, 4, 213);
    			attr_dev(p, "class", "p-big");
    			add_location(p, file$i, 19, 8, 422);
    			attr_dev(div2, "class", "sub-header svelte-1bj9ysv");
    			add_location(div2, file$i, 18, 4, 388);
    			attr_dev(header, "class", "svelte-1bj9ysv");
    			add_location(header, file$i, 9, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(header, t2);
    			append_dev(header, div2);
    			append_dev(div2, p);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*subtitle*/ 1) set_data_dev(t3, /*subtitle*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let subtitle;
    	let $State;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(2, $State = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let title = UIDATA.HEADER;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ State, UIDATA, title, subtitle, $State });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(0, subtitle = $$props.subtitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$State*/ 4) {
    			$$invalidate(0, subtitle = UIDATA.SUBHEADER[$State.lang]);
    		}
    	};

    	return [subtitle, title, $State];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\HomeLinks.svelte generated by Svelte v3.58.0 */
    const file$h = "src\\components\\HomeLinks.svelte";

    function create_fragment$h(ctx) {
    	let div4;
    	let a0;
    	let button0;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let h20;
    	let t1_value = UIDATA.PRODUCTGROUPS[0][/*$State*/ ctx[0].lang].title + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = UIDATA.PRODUCTGROUPS[0][/*$State*/ ctx[0].lang].subtitle + "";
    	let t3;
    	let t4;
    	let a1;
    	let button1;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let div3;
    	let h21;
    	let t6_value = UIDATA.PRODUCTGROUPS[1][/*$State*/ ctx[0].lang].title + "";
    	let t6;
    	let t7;
    	let p1;
    	let t8_value = UIDATA.PRODUCTGROUPS[1][/*$State*/ ctx[0].lang].subtitle + "";
    	let t8;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			a0 = element("a");
    			button0 = element("button");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			h20 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			a1 = element("a");
    			button1 = element("button");
    			div2 = element("div");
    			img1 = element("img");
    			t5 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			t8 = text(t8_value);
    			attr_dev(img0, "class", "button-image svelte-2kwlv1");
    			if (!src_url_equal(img0.src, img0_src_value = "./img/food-head.jpeg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$h, 9, 16, 254);
    			attr_dev(div0, "class", "button-image-cont svelte-2kwlv1");
    			add_location(div0, file$h, 8, 12, 205);
    			attr_dev(h20, "class", "svelte-2kwlv1");
    			add_location(h20, file$h, 12, 16, 398);
    			add_location(p0, file$h, 13, 16, 469);
    			attr_dev(div1, "class", "button-text-cont svelte-2kwlv1");
    			add_location(div1, file$h, 11, 12, 350);
    			attr_dev(button0, "class", "svelte-2kwlv1");
    			add_location(button0, file$h, 7, 8, 183);
    			attr_dev(a0, "href", "#/food/");
    			add_location(a0, file$h, 6, 4, 155);
    			attr_dev(img1, "class", "button-image svelte-2kwlv1");
    			if (!src_url_equal(img1.src, img1_src_value = "./img/drink-head.jpeg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$h, 20, 16, 678);
    			attr_dev(div2, "class", "button-image-cont svelte-2kwlv1");
    			add_location(div2, file$h, 19, 12, 629);
    			attr_dev(h21, "class", "svelte-2kwlv1");
    			add_location(h21, file$h, 23, 16, 823);
    			add_location(p1, file$h, 24, 16, 894);
    			attr_dev(div3, "class", "button-text-cont svelte-2kwlv1");
    			add_location(div3, file$h, 22, 12, 775);
    			attr_dev(button1, "class", "svelte-2kwlv1");
    			add_location(button1, file$h, 18, 8, 607);
    			attr_dev(a1, "href", "#/drink/");
    			add_location(a1, file$h, 17, 4, 578);
    			attr_dev(div4, "class", "home-links svelte-2kwlv1");
    			add_location(div4, file$h, 5, 0, 125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, a0);
    			append_dev(a0, button0);
    			append_dev(button0, div0);
    			append_dev(div0, img0);
    			append_dev(button0, t0);
    			append_dev(button0, div1);
    			append_dev(div1, h20);
    			append_dev(h20, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div4, t4);
    			append_dev(div4, a1);
    			append_dev(a1, button1);
    			append_dev(button1, div2);
    			append_dev(div2, img1);
    			append_dev(button1, t5);
    			append_dev(button1, div3);
    			append_dev(div3, h21);
    			append_dev(h21, t6);
    			append_dev(div3, t7);
    			append_dev(div3, p1);
    			append_dev(p1, t8);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$State*/ 1 && t1_value !== (t1_value = UIDATA.PRODUCTGROUPS[0][/*$State*/ ctx[0].lang].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$State*/ 1 && t3_value !== (t3_value = UIDATA.PRODUCTGROUPS[0][/*$State*/ ctx[0].lang].subtitle + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$State*/ 1 && t6_value !== (t6_value = UIDATA.PRODUCTGROUPS[1][/*$State*/ ctx[0].lang].title + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$State*/ 1 && t8_value !== (t8_value = UIDATA.PRODUCTGROUPS[1][/*$State*/ ctx[0].lang].subtitle + "")) set_data_dev(t8, t8_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $State;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(0, $State = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomeLinks', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomeLinks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ State, Store, UIDATA, $State });
    	return [$State];
    }

    class HomeLinks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeLinks",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        const [value, unit] = split_css_unit(amount);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * value}${unit});`
        };
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        const [xValue, xUnit] = split_css_unit(x);
        const [yValue, yUnit] = split_css_unit(y);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = 'y' } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const primary_property = axis === 'y' ? 'height' : 'width';
        const primary_property_value = parseFloat(style[primary_property]);
        const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
        const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);
        const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
        const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
        const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
        const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
        const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
        const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `${primary_property}: ${t * primary_property_value}px;` +
                `padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
                `padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
                `margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
                `margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
                `border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
                `border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (_, u) => `
			stroke-dasharray: ${len};
			stroke-dashoffset: ${u * len};
		`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from_node, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const from = from_node.getBoundingClientRect();
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, node);
                return () => {
                    if (counterparts.has(params.key)) {
                        const other_node = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(other_node, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    /* src\routes\Home.svelte generated by Svelte v3.58.0 */
    const file$g = "src\\routes\\Home.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let main;
    	let header;
    	let t0;
    	let homelinks;
    	let t1;
    	let p;
    	let div_intro;
    	let div_outro;
    	let current;
    	header = new Header({ $$inline: true });
    	homelinks = new HomeLinks({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(homelinks.$$.fragment);
    			t1 = space();
    			p = element("p");
    			p.textContent = "Footer lorem ipsum dolor sit amet";
    			add_location(p, file$g, 28, 2, 613);
    			attr_dev(main, "class", "svelte-19bcwo7");
    			add_location(main, file$g, 25, 1, 572);
    			attr_dev(div, "class", "page");
    			add_location(div, file$g, 20, 0, 474);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, main);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(homelinks, main, null);
    			append_dev(main, t1);
    			append_dev(main, p);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(homelinks.$$.fragment, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, { delay: 400, duration: 400 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(homelinks.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 400 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			destroy_component(homelinks);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		State,
    		Store,
    		UIDATA,
    		Header,
    		HomeLinks,
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		draw,
    		crossfade
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    var FoodData = writable([
      {
        name: "Tagliere della Casa",
        description: "Salumi e formaggi a Km 0, taralli di produzione propria, miele biologico.",
        cost: 12,
        group: "Antipasti",
        isGlutenfree: false,
        isFrozen: false,
        isVegetarian: false,
        isMilkfree: false,
        img: "tagliere-casa.jpg",
        engName: "House Charcuterie Board",
        engDescription: "Km 0 cured meats and cheeses, homemade taralli, organic honey."
      },
      {
        name: "Polpettine speziate con granella di arachidi",
        description: "Polpettine fritte di zucchine, curry, paprika, con panatura di granella di arachidi tostate.",
        cost: 6,
        group: "Antipasti",
        isGlutenfree: false,
        isFrozen: false,
        isVegetarian: true,
        isMilkfree: false,
        img: "polpettine-speziate.jpg",
        engName: "Spicy Peanut Meatballs",
        engDescription: "Fried zucchini meatballs with curry, paprika, and breadcrumb coating with toasted peanuts."
      },
      {
        name: "Involtini di Bresaola e Burrata",
        description: "Bresaola della Valtellina IGP punta d'anca, farcita con Burrata di Andria IGP ed erba cipollina.",
        cost: 8,
        group: "Antipasti",
        isGlutenfree: true,
        isFrozen: false,
        isVegetarian: false,
        isMilkfree: false,
        img: "involtini-bresaola.jpg",
        engName: "Bresaola and Burrata Rolls",
        engDescription: "Valtellina IGP beef bresaola, stuffed with Andria IGP burrata and chives."
      },
      {
        name: "Spaghetti allo scoglio",
        description: "Pasta di Gragnano IGP, con cozze, vongole, gamberi e calamari.",
        cost: 14,
        group: "Primi",
        isGlutenfree: false,
        isFrozen: true,
        isVegetarian: false,
        isMilkfree: true,
        img: "spaghetto-scoglio.jpg",
        engName: "Seafood Spaghetti",
        engDescription: "Gragnano IGP pasta with mussels, clams, shrimp, and squid."
      },
      {
        name: "Lasagnetta vegetariana con granella di mandorle",
        description: "Sfoglia di pasta acqua e farina, ragù vegetariano di melanzane e pomodoro San Marzano DOP, basilico e granella di mandorle.",
        cost: 9,
        group: "Primi",
        isGlutenfree: false,
        isFrozen: false,
        isVegetarian: true,
        isMilkfree: true,
        img: "lasagnetta-veg.jpg",
        engName: "Vegetarian Lasagnetta with Almond Crumble",
        engDescription: "Water and flour pasta sheet, vegetarian eggplant and San Marzano DOP tomato sauce, basil, and almond crumble."
      },
      {
        name: "Fettuccine al Ragù di Cervo",
        description: "Pasta all'uovo fatta in casa, Ragù di Cervo e formaggio Piave DOP.",
        cost: "12,5",
        group: "Primi",
        isGlutenfree: false,
        isFrozen: false,
        isVegetarian: false,
        isMilkfree: false,
        img: "fettuccine-ragu.jpg",
        engName: "Fettuccine with Venison Ragu",
        engDescription: "Homemade egg pasta with venison ragu and Piave DOP cheese."
      },
      {
        name: "Grigliata mista di Carne",
        description: "Carne a Km 0 (pollo, manzo, agnello), cotta su spiedo. Accompagnata da verdure biologiche di stagione e salse fatte in casa.",
        cost: 20,
        group: "Secondi",
        isGlutenfree: true,
        isFrozen: false,
        isVegetarian: false,
        isMilkfree: true,
        img: "grigliata-mista-carne.jpg",
        engName: "Mixed Meat Grill",
        engDescription: "Km 0 meats (chicken, beef, lamb) grilled on a spit. Served with seasonal organic vegetables and homemade sauces."
      },
      {
        name: "Grigliata mista di Mare",
        description: "Pescato del giorno, molluschi e crostacei cotti alla griglia.",
        cost: 22,
        group: "Secondi",
        isGlutenfree: true,
        isFrozen: true,
        isVegetarian: false,
        isMilkfree: true,
        img: "grigliata-mista-mare.jpg",
        engName: "Mixed Seafood Grill",
        engDescription: "Daily caught fish, mollusks, and crustaceans grilled."
      },
      {
        name: "Fungo Portobello ripieno",
        description: "Fungo Portobello cotto su griglia, ripieno di verdure di stagione e pesto fatto in casa. Servito con salsa di senape.",
        cost: 10,
        group: "Secondi",
        isGlutenfree: true,
        isFrozen: false,
        isVegetarian: true,
        isMilkfree: false,
        img: "fungo-portobello.jpg",
        engName: "Stuffed Portobello Mushroom",
        engDescription: "Portobello mushroom grilled and stuffed with seasonal vegetables and homemade pesto. Served with mustard sauce."
      },
      {
        name: "Tiramisù al bicchiere",
        description: "Savoiardi al caffè di nostra produzione, crema al mascarpone, spolverizzato con cacao amaro e cannella in polvere.",
        cost: 7,
        group: "Dessert",
        isGlutenfree: false,
        isFrozen: false,
        isVegetarian: false,
        isMilkfree: false,
        img: "tiramisu-bicchiere.jpg",
        engName: "Tiramisù in a Glass",
        engDescription: "Homemade coffee Savoiardi, mascarpone cream, dusted with bitter cocoa and cinnamon powder."
      },
      {
        name: "Semifreddo al Cocco",
        description: "Mousse al cocco, composta di passion fruit e foglie di menta.",
        cost: 7,
        group: "Dessert",
        isGlutenfree: true,
        isFrozen: false,
        isVegetarian: false,
        isMilkfree: false,
        img: "semifreddo-cocco.jpg",
        engName: "Coconut Semifreddo",
        engDescription: "Coconut mousse, passion fruit compote, and mint leaves."
      }
    ]);

    var DrinkData = writable([
      {
        name: "Barolo docg Cascina Chicco",
        description: "Uve: 100% Nebbiolo",
        size: "750ml",
        cost: 10,
        altSize: "",
        altCost: "",
        group: "Vino rosso",
        engName: "Barolo docg Cascina Chicco",
        engDescription: "Grape variety: 100% Nebbiolo",
        engAltSize: ""
      },
      {
        name: "Amarone Valpolicella docg Azienda Santi",
        description: "Uve: 70% Corvina, 20% Rondinella, 5% Oseleta, 5% Croatina",
        size: "750ml",
        cost: 10,
        altSize: "Calice",
        altCost: 3,
        group: "Vino rosso",
        engName: "Amarone Valpolicella docg Azienda Santi",
        engDescription: "Grape variety: 70% Corvina, 20% Rondinella, 5% Oseleta, 5% Croatina",
        engAltSize: "Glass"
      },
      {
        name: "Montepulciano d’Abruzzo Barone di Valforte",
        description: "Uve: 100% Montepulciano d’Abruzzo",
        size: "750ml",
        cost: 5,
        altSize: "",
        altCost: "",
        group: "Vino rosso",
        engName: "Montepulciano d’Abruzzo Barone di Valforte",
        engDescription: "Grape variety: 100% Montepulciano d’Abruzzo",
        engAltSize: ""
      },
      {
        name: "Gewurztraminer di Novacella",
        description: "Uve: 100% Gewurztraminer",
        size: "750ml",
        cost: 10,
        altSize: "",
        altCost: "",
        group: "Vino bianco",
        engName: "Gewurztraminer di Novacella",
        engDescription: "Grape variety: 100% Gewurztraminer",
        engAltSize: ""
      },
      {
        name: "Chardonnay Falesia 13%vol Az.d’Amico",
        description: "Uve: 100% Chardonnay",
        size: "750ml",
        cost: 21,
        altSize: "Calice",
        altCost: 8,
        group: "Vino bianco",
        engName: "Chardonnay Falesia 13%vol Az.d’Amico",
        engDescription: "Grape variety: 100% Chardonnay",
        engAltSize: "Glass"
      },
      {
        name: "Capolemole Igt Bio Marco Carpineti",
        description: "Uve: 100% Bellone",
        size: "750ml",
        cost: 22,
        altSize: "",
        altCost: "",
        group: "Vino bianco",
        engName: "Capolemole Igt Bio Marco Carpineti",
        engDescription: "Grape variety: 100% Bellone",
        engAltSize: ""
      },
      {
        name: "Itala Pilsen alla spina",
        description: "4,8 % Vol. Pils, biondo dorato, gusto ricco e distintivo",
        size: "200ml",
        cost: "3,5",
        altSize: "",
        altCost: "",
        group: "Birra",
        engName: "Itala Pilsen on tap",
        engDescription: "4.8% vol Blonde Pils, rich and distinctive taste",
        engAltSize: ""
      },
      {
        name: "Grolsch",
        description: "5,1 % Vol. Weizern, giallo paglierino, gusto rinfrescante e fruttato",
        size: "200ml",
        cost: "3,5",
        altSize: "",
        altCost: "",
        group: "Birra",
        engName: "Grolsch",
        engDescription: "Wheat beer, pale yellow, refreshing and fruity taste",
        engAltSize: ""
      },
      {
        name: "Acqua Naturale",
        description: "Mangiatorella",
        size: "1l",
        cost: 2,
        altSize: "0,5l",
        altCost: 1,
        group: "Analcolici",
        engName: "Natural Water",
        engDescription: "Mangiatorella",
        engAltSize: "0,5l"
      },
      {
        name: "Acqua Effervescente",
        description: "Ferrarelle",
        size: "1l",
        cost: 2,
        altSize: "0,5l",
        altCost: 1,
        group: "Analcolici",
        engName: "Sparkling water",
        engDescription: "Ferrarelle",
        engAltSize: "0,5l"
      },
      {
        name: "Coca Cola",
        description: "in lattina",
        size: "330ml",
        cost: 2,
        altSize: "",
        altCost: "",
        group: "Analcolici",
        engName: "Coca Cola",
        engDescription: "in can",
        engAltSize: ""
      },
      {
        name: "Coca Cola",
        description: "alla spina",
        size: "400ml",
        cost: 3,
        altSize: "200ml",
        altCost: 2,
        group: "Analcolici",
        engName: "Coca Cola",
        engDescription: "on tap",
        engAltSize: "200ml"
      },
      {
        name: "Espresso",
        description: "",
        size: "",
        cost: 1,
        altSize: "",
        altCost: "",
        group: "Bar",
        engName: "Espresso",
        engDescription: "",
        engAltSize: ""
      },
      {
        name: "Cappuccino",
        description: "",
        size: "",
        cost: "1,5",
        altSize: "",
        altCost: "",
        group: "Bar",
        engName: "Cappuccino",
        engDescription: "",
        engAltSize: ""
      }
    ]);

    /* src\components\Accordion.svelte generated by Svelte v3.58.0 */
    const file$f = "src\\components\\Accordion.svelte";
    const get_details_slot_changes = dirty => ({});
    const get_details_slot_context = ctx => ({});
    const get_head_slot_changes$1 = dirty => ({});
    const get_head_slot_context$1 = ctx => ({});

    // (17:0) {#if isOpen}
    function create_if_block$7(ctx) {
    	let div;
    	let div_transition;
    	let current;
    	const details_slot_template = /*#slots*/ ctx[3].details;
    	const details_slot = create_slot(details_slot_template, ctx, /*$$scope*/ ctx[2], get_details_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (details_slot) details_slot.c();
    			attr_dev(div, "class", "accordion-content svelte-1dbb0wv");
    			add_location(div, file$f, 17, 4, 548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (details_slot) {
    				details_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (details_slot) {
    				if (details_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						details_slot,
    						details_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(details_slot_template, /*$$scope*/ ctx[2], dirty, get_details_slot_changes),
    						get_details_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(details_slot, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(details_slot, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (details_slot) details_slot.d(detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(17:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let button;
    	let t0;
    	let svg;
    	let path;
    	let button_class_value;
    	let t1;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const head_slot_template = /*#slots*/ ctx[3].head;
    	const head_slot = create_slot(head_slot_template, ctx, /*$$scope*/ ctx[2], get_head_slot_context$1);
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (head_slot) head_slot.c();
    			t0 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(path, "d", "M9 5l7 7-7 7");
    			add_location(path, file$f, 12, 8, 472);
    			attr_dev(svg, "class", "accordion-icon svelte-1dbb0wv");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke-width", "4");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$f, 11, 4, 316);

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*isOpen*/ ctx[0]
    			? 'accordion-toggle active'
    			: 'accordion-toggle') + " svelte-1dbb0wv"));

    			attr_dev(button, "aria-expanded", /*isOpen*/ ctx[0]);
    			add_location(button, file$f, 9, 0, 161);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (head_slot) {
    				head_slot.m(button, null);
    			}

    			append_dev(button, t0);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (head_slot) {
    				if (head_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						head_slot,
    						head_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(head_slot_template, /*$$scope*/ ctx[2], dirty, get_head_slot_changes$1),
    						get_head_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty & /*isOpen*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*isOpen*/ ctx[0]
    			? 'accordion-toggle active'
    			: 'accordion-toggle') + " svelte-1dbb0wv"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*isOpen*/ 1) {
    				attr_dev(button, "aria-expanded", /*isOpen*/ ctx[0]);
    			}

    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(head_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(head_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (head_slot) head_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Accordion', slots, ['head','details']);
    	let { isOpen = false } = $$props;

    	const toggle = e => {
    		$$invalidate(0, isOpen = !isOpen);
    	};

    	const writable_props = ['isOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Accordion> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		toggle();
    	};

    	$$self.$$set = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ slide, isOpen, toggle });

    	$$self.$inject_state = $$props => {
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, toggle, $$scope, slots, click_handler];
    }

    class Accordion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { isOpen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accordion",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get isOpen() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProductCard.svelte generated by Svelte v3.58.0 */

    const { console: console_1$7 } = globals;
    const file$e = "src\\components\\ProductCard.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "card " + /*cardFavClass*/ ctx[1] + " svelte-62sm0e");
    			add_location(div, file$e, 31, 4, 822);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*cardFavClass*/ 2 && div_class_value !== (div_class_value = "card " + /*cardFavClass*/ ctx[1] + " svelte-62sm0e")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let isAlreadyFav;
    	let $Store;
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(4, $Store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductCard', slots, ['default']);
    	let { item } = $$props;

    	// import ProductFavIcon from "./ProductFavIcon.svelte";
    	let cardFavClass = "";

    	const clickFav = itemId => {
    		console.log(itemId);
    		let clickedItemId = itemId;
    		let isAlreadyFav = $Store.favs.includes(clickedItemId);

    		if (!isAlreadyFav) {
    			set_store_value(Store, $Store.favs = [...$Store.favs, clickedItemId], $Store);
    		} else {
    			set_store_value(Store, $Store.favs = $Store.favs.filter(i => i !== clickedItemId), $Store);
    		}

    		console.log($Store.favs);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console_1$7.warn("<ProductCard> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<ProductCard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => clickFav(item.id);

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		item,
    		UIDATA,
    		State,
    		Store,
    		cardFavClass,
    		clickFav,
    		isAlreadyFav,
    		$Store
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('cardFavClass' in $$props) $$invalidate(1, cardFavClass = $$props.cardFavClass);
    		if ('isAlreadyFav' in $$props) $$invalidate(3, isAlreadyFav = $$props.isAlreadyFav);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$Store, item*/ 17) {
    			$$invalidate(3, isAlreadyFav = $Store.favs.includes(item.id));
    		}

    		if ($$self.$$.dirty & /*isAlreadyFav*/ 8) {
    			isAlreadyFav
    			? $$invalidate(1, cardFavClass = "is--fav")
    			: $$invalidate(1, cardFavClass = "");
    		}
    	};

    	return [
    		item,
    		cardFavClass,
    		clickFav,
    		isAlreadyFav,
    		$Store,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class ProductCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductCard",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get item() {
    		throw new Error("<ProductCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ProductCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProductFavIcon.svelte generated by Svelte v3.58.0 */
    const file$d = "src\\components\\ProductFavIcon.svelte";

    // (11:4) {:else}
    function create_else_block$2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-favitem-off.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$d, 11, 8, 290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(11:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:4) {#if isAlreadyFav}
    function create_if_block$6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-favitem-on.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$d, 9, 8, 216);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(9:4) {#if isAlreadyFav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*isAlreadyFav*/ ctx[0]) return create_if_block$6;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "item-fav-icon svelte-rtkipg");
    			add_location(div, file$d, 7, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let isAlreadyFav;
    	let $Store;
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(2, $Store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductFavIcon', slots, []);
    	let { item } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console.warn("<ProductFavIcon> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductFavIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ item, State, Store, isAlreadyFav, $Store });

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('isAlreadyFav' in $$props) $$invalidate(0, isAlreadyFav = $$props.isAlreadyFav);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$Store, item*/ 6) {
    			$$invalidate(0, isAlreadyFav = $Store.favs.includes(item.id));
    		}
    	};

    	return [isAlreadyFav, item, $Store];
    }

    class ProductFavIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { item: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductFavIcon",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get item() {
    		throw new Error("<ProductFavIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ProductFavIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\DrinkItem.svelte generated by Svelte v3.58.0 */
    const file$c = "src\\components\\DrinkItem.svelte";

    // (40:8) {#if item.altSize !== ""}
    function create_if_block$5(ctx) {
    	let div;
    	let t0_value = /*item*/ ctx[0][/*altSize*/ ctx[3]] + "";
    	let t0;
    	let t1;
    	let br0;
    	let t2;
    	let t3_value = /*item*/ ctx[0][/*altCost*/ ctx[4]] + "";
    	let t3;
    	let t4;
    	let br1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			br0 = element("br");
    			t2 = text("\r\n                € ");
    			t3 = text(t3_value);
    			t4 = space();
    			br1 = element("br");
    			add_location(br0, file$c, 41, 32, 1168);
    			add_location(br1, file$c, 42, 34, 1210);
    			attr_dev(div, "class", "alt-item svelte-am3tgr");
    			add_location(div, file$c, 40, 12, 1112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, br1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item, altSize*/ 9 && t0_value !== (t0_value = /*item*/ ctx[0][/*altSize*/ ctx[3]] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*item, altCost*/ 17 && t3_value !== (t3_value = /*item*/ ctx[0][/*altCost*/ ctx[4]] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(40:8) {#if item.altSize !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (29:0) <ProductCard {item}>
    function create_default_slot$2(ctx) {
    	let div2;
    	let div0;
    	let h30;
    	let t0_value = /*item*/ ctx[0][/*name*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let div1;
    	let p;
    	let t2_value = /*item*/ ctx[0][/*description*/ ctx[2]] + "";
    	let t2;
    	let t3;
    	let t4_value = /*item*/ ctx[0].size + "";
    	let t4;
    	let t5;
    	let h31;
    	let t6;
    	let t7_value = /*item*/ ctx[0].cost + "";
    	let t7;
    	let t8;
    	let t9;
    	let productfavicon;
    	let current;
    	let if_block = /*item*/ ctx[0].altSize !== "" && create_if_block$5(ctx);

    	productfavicon = new ProductFavIcon({
    			props: { item: /*item*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = text(", ");
    			t4 = text(t4_value);
    			t5 = space();
    			h31 = element("h3");
    			t6 = text("€ ");
    			t7 = text(t7_value);
    			t8 = space();
    			if (if_block) if_block.c();
    			t9 = space();
    			create_component(productfavicon.$$.fragment);
    			add_location(h30, file$c, 31, 12, 825);
    			attr_dev(div0, "class", "item-head");
    			add_location(div0, file$c, 30, 8, 788);
    			attr_dev(p, "class", "description svelte-am3tgr");
    			add_location(p, file$c, 34, 12, 909);
    			attr_dev(div1, "class", "item-body");
    			add_location(div1, file$c, 33, 8, 872);
    			add_location(h31, file$c, 37, 12, 1039);
    			attr_dev(div2, "class", "item-content svelte-am3tgr");
    			add_location(div2, file$c, 29, 4, 754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(h30, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(div2, t5);
    			append_dev(div2, h31);
    			append_dev(h31, t6);
    			append_dev(h31, t7);
    			append_dev(div2, t8);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t9);
    			mount_component(productfavicon, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*item, name*/ 3) && t0_value !== (t0_value = /*item*/ ctx[0][/*name*/ ctx[1]] + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*item, description*/ 5) && t2_value !== (t2_value = /*item*/ ctx[0][/*description*/ ctx[2]] + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*item*/ 1) && t4_value !== (t4_value = /*item*/ ctx[0].size + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*item*/ 1) && t7_value !== (t7_value = /*item*/ ctx[0].cost + "")) set_data_dev(t7, t7_value);

    			if (/*item*/ ctx[0].altSize !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div2, t9);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const productfavicon_changes = {};
    			if (dirty & /*item*/ 1) productfavicon_changes.item = /*item*/ ctx[0];
    			productfavicon.$set(productfavicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productfavicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productfavicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_component(productfavicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(29:0) <ProductCard {item}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let productcard;
    	let current;

    	productcard = new ProductCard({
    			props: {
    				item: /*item*/ ctx[0],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(productcard.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(productcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const productcard_changes = {};
    			if (dirty & /*item*/ 1) productcard_changes.item = /*item*/ ctx[0];

    			if (dirty & /*$$scope, item, altCost, altSize, description, name*/ 95) {
    				productcard_changes.$$scope = { dirty, ctx };
    			}

    			productcard.$set(productcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $State;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(5, $State = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DrinkItem', slots, []);
    	let { item } = $$props;
    	let name;
    	let description;
    	let altSize;
    	let altCost;

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console.warn("<DrinkItem> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DrinkItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		item,
    		UIDATA,
    		State,
    		Store,
    		ProductCard,
    		ProductFavIcon,
    		name,
    		description,
    		altSize,
    		altCost,
    		$State
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('altSize' in $$props) $$invalidate(3, altSize = $$props.altSize);
    		if ('altCost' in $$props) $$invalidate(4, altCost = $$props.altCost);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$State*/ 32) {
    			if ($State.lang === UIDATA.LANGS[0]) {
    				$$invalidate(1, name = "name");
    				$$invalidate(2, description = "description");
    				$$invalidate(3, altSize = "altSize");
    				$$invalidate(4, altCost = "altCost");
    			} else if ($State.lang === UIDATA.LANGS[1]) {
    				$$invalidate(1, name = "engName");
    				$$invalidate(2, description = "engDescription");
    				$$invalidate(3, altSize = "engAltSize");
    				$$invalidate(4, altCost = "engAltCost");
    			}
    		}
    	};

    	return [item, name, description, altSize, altCost, $State];
    }

    class DrinkItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DrinkItem",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get item() {
    		throw new Error("<DrinkItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<DrinkItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Modal.svelte generated by Svelte v3.58.0 */

    const file$b = "src\\components\\Modal.svelte";
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$b(ctx) {
    	let dialog_1;
    	let div;
    	let t0;
    	let hr0;
    	let t1;
    	let t2;
    	let hr1;
    	let t3;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const header_slot_template = /*#slots*/ ctx[3].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[2], get_header_slot_context);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			dialog_1 = element("dialog");
    			div = element("div");
    			if (header_slot) header_slot.c();
    			t0 = space();
    			hr0 = element("hr");
    			t1 = space();
    			if (default_slot) default_slot.c();
    			t2 = space();
    			hr1 = element("hr");
    			t3 = space();
    			button = element("button");
    			button.textContent = "close modal";
    			add_location(hr0, file$b, 16, 2, 377);
    			add_location(hr1, file$b, 18, 2, 399);
    			button.autofocus = true;
    			attr_dev(button, "class", "svelte-19dligb");
    			add_location(button, file$b, 20, 2, 450);
    			attr_dev(div, "class", "svelte-19dligb");
    			add_location(div, file$b, 14, 1, 317);
    			attr_dev(dialog_1, "class", "svelte-19dligb");
    			add_location(dialog_1, file$b, 9, 0, 205);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, dialog_1, anchor);
    			append_dev(dialog_1, div);

    			if (header_slot) {
    				header_slot.m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, hr0);
    			append_dev(div, t1);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t2);
    			append_dev(div, hr1);
    			append_dev(div, t3);
    			append_dev(div, button);
    			/*dialog_1_binding*/ ctx[6](dialog_1);
    			current = true;
    			button.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_1*/ ctx[5], false, false, false, false),
    					listen_dev(div, "click", stop_propagation(/*click_handler*/ ctx[4]), false, false, true, false),
    					listen_dev(dialog_1, "close", /*close_handler*/ ctx[7], false, false, false, false),
    					listen_dev(dialog_1, "click", self(/*click_handler_2*/ ctx[8]), false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[2], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(dialog_1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*dialog_1_binding*/ ctx[6](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['header','default']);
    	let { showModal } = $$props;
    	let dialog; // HTMLDialogElement

    	$$self.$$.on_mount.push(function () {
    		if (showModal === undefined && !('showModal' in $$props || $$self.$$.bound[$$self.$$.props['showModal']])) {
    			console.warn("<Modal> was created without expected prop 'showModal'");
    		}
    	});

    	const writable_props = ['showModal'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => dialog.close();

    	function dialog_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			dialog = $$value;
    			$$invalidate(1, dialog);
    		});
    	}

    	const close_handler = () => $$invalidate(0, showModal = false);
    	const click_handler_2 = () => dialog.close();

    	$$self.$$set = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ showModal, dialog });

    	$$self.$inject_state = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('dialog' in $$props) $$invalidate(1, dialog = $$props.dialog);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dialog, showModal*/ 3) {
    			if (dialog && showModal) dialog.showModal();
    		}
    	};

    	return [
    		showModal,
    		dialog,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		dialog_1_binding,
    		close_handler,
    		click_handler_2
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { showModal: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get showModal() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showModal(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProductIcons.svelte generated by Svelte v3.58.0 */
    const file$a = "src\\components\\ProductIcons.svelte";

    // (11:4) {#if item.isFrozen}
    function create_if_block_7(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-frozen.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 11, 8, 320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(11:4) {#if item.isFrozen}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if item.isGlutenfree}
    function create_if_block_6(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-glutenfree.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 14, 8, 423);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(14:4) {#if item.isGlutenfree}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if item.isMilkfree}
    function create_if_block_5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-milkfree.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 17, 8, 528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(17:4) {#if item.isMilkfree}",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#if item.isVegetarian}
    function create_if_block_4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-vegetarian.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 20, 8, 633);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(20:4) {#if item.isVegetarian}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if item.isFrozen}
    function create_if_block_3$1(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Contiene ingredienti surgelati";
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-frozen.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 33, 8, 853);
    			add_location(p, file$a, 34, 8, 916);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(33:4) {#if item.isFrozen}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if item.isGlutenfree}
    function create_if_block_2$2(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Prodotto senza glutine";
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-glutenfree.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 37, 8, 1003);
    			add_location(p, file$a, 38, 8, 1070);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(37:4) {#if item.isGlutenfree}",
    		ctx
    	});

    	return block;
    }

    // (41:4) {#if item.isMilkfree}
    function create_if_block_1$3(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Prodotto senza lattosio";
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-milkfree.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 41, 8, 1147);
    			add_location(p, file$a, 42, 8, 1212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:4) {#if item.isMilkfree}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if item.isVegetarian}
    function create_if_block$4(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			p.textContent = "Prodotto vegetariano";
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-item-vegetarian.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 45, 8, 1292);
    			add_location(p, file$a, 46, 8, 1359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(45:4) {#if item.isVegetarian}",
    		ctx
    	});

    	return block;
    }

    // (25:0) <Modal bind:showModal>
    function create_default_slot$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let if_block3_anchor;
    	let if_block0 = /*item*/ ctx[0].isFrozen && create_if_block_3$1(ctx);
    	let if_block1 = /*item*/ ctx[0].isGlutenfree && create_if_block_2$2(ctx);
    	let if_block2 = /*item*/ ctx[0].isMilkfree && create_if_block_1$3(ctx);
    	let if_block3 = /*item*/ ctx[0].isVegetarian && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[0].isFrozen) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*item*/ ctx[0].isGlutenfree) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*item*/ ctx[0].isMilkfree) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_1$3(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*item*/ ctx[0].isVegetarian) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block$4(ctx);
    					if_block3.c();
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(25:0) <Modal bind:showModal>",
    		ctx
    	});

    	return block;
    }

    // (26:4) 
    function create_header_slot(ctx) {
    	let div;
    	let h3;
    	let t_value = /*item*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t = text(t_value);
    			add_location(h3, file$a, 26, 4, 766);
    			attr_dev(div, "slot", "header");
    			add_location(div, file$a, 25, 4, 741);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && t_value !== (t_value = /*item*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(26:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let modal;
    	let updating_showModal;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*item*/ ctx[0].isFrozen && create_if_block_7(ctx);
    	let if_block1 = /*item*/ ctx[0].isGlutenfree && create_if_block_6(ctx);
    	let if_block2 = /*item*/ ctx[0].isMilkfree && create_if_block_5(ctx);
    	let if_block3 = /*item*/ ctx[0].isVegetarian && create_if_block_4(ctx);

    	function modal_showModal_binding(value) {
    		/*modal_showModal_binding*/ ctx[3](value);
    	}

    	let modal_props = {
    		$$slots: {
    			header: [create_header_slot],
    			default: [create_default_slot$1]
    		},
    		$$scope: { ctx }
    	};

    	if (/*showModal*/ ctx[1] !== void 0) {
    		modal_props.showModal = /*showModal*/ ctx[1];
    	}

    	modal = new Modal({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, 'showModal', modal_showModal_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(div, "class", "icons");
    			add_location(div, file$a, 9, 0, 230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			insert_dev(target, t3, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*item*/ ctx[0].isFrozen) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*item*/ ctx[0].isGlutenfree) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*item*/ ctx[0].isMilkfree) {
    				if (if_block2) ; else {
    					if_block2 = create_if_block_5(ctx);
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*item*/ ctx[0].isVegetarian) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_4(ctx);
    					if_block3.c();
    					if_block3.m(div, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			const modal_changes = {};

    			if (dirty & /*$$scope, item*/ 17) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_showModal && dirty & /*showModal*/ 2) {
    				updating_showModal = true;
    				modal_changes.showModal = /*showModal*/ ctx[1];
    				add_flush_callback(() => updating_showModal = false);
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching) detach_dev(t3);
    			destroy_component(modal, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductIcons', slots, []);
    	let { item } = $$props;
    	let showModal = false;

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console.warn("<ProductIcons> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductIcons> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, showModal = true);

    	function modal_showModal_binding(value) {
    		showModal = value;
    		$$invalidate(1, showModal);
    	}

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ item, prevent_default, Modal, showModal });

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('showModal' in $$props) $$invalidate(1, showModal = $$props.showModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, showModal, click_handler, modal_showModal_binding];
    }

    class ProductIcons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductIcons",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get item() {
    		throw new Error("<ProductIcons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ProductIcons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\FoodItem.svelte generated by Svelte v3.58.0 */

    const { console: console_1$6 } = globals;
    const file$9 = "src\\components\\FoodItem.svelte";

    // (23:0) <ProductCard {item}>
    function create_default_slot(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div3;
    	let div0;
    	let h30;
    	let t1_value = /*item*/ ctx[0][/*name*/ ctx[1]] + "";
    	let t1;
    	let t2;
    	let div1;
    	let p;
    	let t3_value = /*item*/ ctx[0][/*description*/ ctx[2]] + "";
    	let t3;
    	let t4;
    	let div2;
    	let h31;
    	let t5;
    	let t6_value = /*item*/ ctx[0].cost + "";
    	let t6;
    	let t7;
    	let producticons;
    	let t8;
    	let productfavicon;
    	let current;

    	producticons = new ProductIcons({
    			props: { item: /*item*/ ctx[0] },
    			$$inline: true
    		});

    	productfavicon = new ProductFavIcon({
    			props: { item: /*item*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			h31 = element("h3");
    			t5 = text("€ ");
    			t6 = text(t6_value);
    			t7 = space();
    			create_component(producticons.$$.fragment);
    			t8 = space();
    			create_component(productfavicon.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "./img/food/" + /*item*/ ctx[0].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1bftwbc");
    			add_location(img, file$9, 23, 4, 642);
    			add_location(h30, file$9, 27, 8, 755);
    			attr_dev(div0, "class", "item-head svelte-1bftwbc");
    			add_location(div0, file$9, 26, 4, 722);
    			attr_dev(p, "class", "description svelte-1bftwbc");
    			add_location(p, file$9, 30, 8, 827);
    			attr_dev(div1, "class", "item-body");
    			add_location(div1, file$9, 29, 4, 794);
    			add_location(h31, file$9, 33, 8, 924);
    			attr_dev(div2, "class", "item-foot svelte-1bftwbc");
    			add_location(div2, file$9, 32, 4, 891);
    			attr_dev(div3, "class", "item-content svelte-1bftwbc");
    			add_location(div3, file$9, 25, 4, 692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h30);
    			append_dev(h30, t1);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, h31);
    			append_dev(h31, t5);
    			append_dev(h31, t6);
    			append_dev(div2, t7);
    			mount_component(producticons, div2, null);
    			append_dev(div3, t8);
    			mount_component(productfavicon, div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*item*/ 1 && !src_url_equal(img.src, img_src_value = "./img/food/" + /*item*/ ctx[0].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*item, name*/ 3) && t1_value !== (t1_value = /*item*/ ctx[0][/*name*/ ctx[1]] + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*item, description*/ 5) && t3_value !== (t3_value = /*item*/ ctx[0][/*description*/ ctx[2]] + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*item*/ 1) && t6_value !== (t6_value = /*item*/ ctx[0].cost + "")) set_data_dev(t6, t6_value);
    			const producticons_changes = {};
    			if (dirty & /*item*/ 1) producticons_changes.item = /*item*/ ctx[0];
    			producticons.$set(producticons_changes);
    			const productfavicon_changes = {};
    			if (dirty & /*item*/ 1) productfavicon_changes.item = /*item*/ ctx[0];
    			productfavicon.$set(productfavicon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(producticons.$$.fragment, local);
    			transition_in(productfavicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(producticons.$$.fragment, local);
    			transition_out(productfavicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			destroy_component(producticons);
    			destroy_component(productfavicon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(23:0) <ProductCard {item}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let productcard;
    	let current;

    	productcard = new ProductCard({
    			props: {
    				item: /*item*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(productcard.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(productcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const productcard_changes = {};
    			if (dirty & /*item*/ 1) productcard_changes.item = /*item*/ ctx[0];

    			if (dirty & /*$$scope, item, description, name*/ 23) {
    				productcard_changes.$$scope = { dirty, ctx };
    			}

    			productcard.$set(productcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(productcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(productcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(productcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $State;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(3, $State = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FoodItem', slots, []);
    	let { item } = $$props;
    	console.log(item);
    	let name;
    	let description;

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console_1$6.warn("<FoodItem> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<FoodItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		item,
    		UIDATA,
    		State,
    		Store,
    		ProductCard,
    		ProductIcons,
    		ProductFavIcon,
    		name,
    		description,
    		$State
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$State*/ 8) {
    			if ($State.lang === UIDATA.LANGS[0]) {
    				$$invalidate(1, name = "name");
    				$$invalidate(2, description = "description");
    			} else if ($State.lang === UIDATA.LANGS[1]) {
    				$$invalidate(1, name = "engName");
    				$$invalidate(2, description = "engDescription");
    			}
    		}
    	};

    	return [item, name, description, $State];
    }

    class FoodItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FoodItem",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get item() {
    		throw new Error("<FoodItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<FoodItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProductGroup.svelte generated by Svelte v3.58.0 */

    const { console: console_1$5 } = globals;
    const file$8 = "src\\components\\ProductGroup.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (28:8) 
    function create_head_slot$2(ctx) {
    	let div;
    	let h1;
    	let t0_value = /*accordionTitle*/ ctx[2][/*$State*/ ctx[3].lang][/*index*/ ctx[6]] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(h1, file$8, 28, 12, 721);
    			attr_dev(div, "slot", "head");
    			add_location(div, file$8, 27, 8, 690);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*accordionTitle, $State*/ 12 && t0_value !== (t0_value = /*accordionTitle*/ ctx[2][/*$State*/ ctx[3].lang][/*index*/ ctx[6]] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_head_slot$2.name,
    		type: "slot",
    		source: "(28:8) ",
    		ctx
    	});

    	return block;
    }

    // (35:45) 
    function create_if_block_1$2(ctx) {
    	let fooditem;
    	let current;

    	fooditem = new FoodItem({
    			props: { item: /*item*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fooditem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fooditem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fooditem_changes = {};
    			if (dirty & /*groups*/ 1) fooditem_changes.item = /*item*/ ctx[7];
    			fooditem.$set(fooditem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fooditem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fooditem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fooditem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(35:45) ",
    		ctx
    	});

    	return block;
    }

    // (33:16) {#if groupName==="drink"}
    function create_if_block$3(ctx) {
    	let drinkitem;
    	let current;

    	drinkitem = new DrinkItem({
    			props: { item: /*item*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(drinkitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(drinkitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const drinkitem_changes = {};
    			if (dirty & /*groups*/ 1) drinkitem_changes.item = /*item*/ ctx[7];
    			drinkitem.$set(drinkitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(drinkitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(drinkitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(drinkitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(33:16) {#if groupName===\\\"drink\\\"}",
    		ctx
    	});

    	return block;
    }

    // (32:12) {#each group as item, index}
    function create_each_block_1$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*groupName*/ ctx[1] === "drink") return 0;
    		if (/*groupName*/ ctx[1] === "food") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(32:12) {#each group as item, index}",
    		ctx
    	});

    	return block;
    }

    // (31:8) 
    function create_details_slot(ctx) {
    	let div;
    	let t;
    	let current;
    	let each_value_1 = /*group*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(div, "slot", "details");
    			add_location(div, file$8, 30, 8, 792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*groups, groupName*/ 3) {
    				each_value_1 = /*group*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_details_slot.name,
    		type: "slot",
    		source: "(31:8) ",
    		ctx
    	});

    	return block;
    }

    // (26:0) {#each groups as group, index}
    function create_each_block$1(ctx) {
    	let accordion;
    	let current;

    	accordion = new Accordion({
    			props: {
    				isOpen: false,
    				$$slots: {
    					details: [create_details_slot],
    					head: [create_head_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(accordion.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordion, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordion_changes = {};

    			if (dirty & /*$$scope, groups, groupName, accordionTitle, $State*/ 527) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			accordion.$set(accordion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordion, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(26:0) {#each groups as group, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*groups*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*groups, groupName, accordionTitle, $State*/ 15) {
    				each_value = /*groups*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $State;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(3, $State = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductGroup', slots, []);
    	let { groups } = $$props;
    	let { groupName } = $$props;
    	console.log(groupName);
    	let accordionTitle;

    	if (groupName === 'food') {
    		accordionTitle = UIDATA.FOODGROUPS;
    	} else if (groupName === 'drink') {
    		accordionTitle = UIDATA.DRINKGROUPS;
    	} else {
    		accordionTitle = 'set it properly';
    	}

    	$$self.$$.on_mount.push(function () {
    		if (groups === undefined && !('groups' in $$props || $$self.$$.bound[$$self.$$.props['groups']])) {
    			console_1$5.warn("<ProductGroup> was created without expected prop 'groups'");
    		}

    		if (groupName === undefined && !('groupName' in $$props || $$self.$$.bound[$$self.$$.props['groupName']])) {
    			console_1$5.warn("<ProductGroup> was created without expected prop 'groupName'");
    		}
    	});

    	const writable_props = ['groups', 'groupName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<ProductGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('groups' in $$props) $$invalidate(0, groups = $$props.groups);
    		if ('groupName' in $$props) $$invalidate(1, groupName = $$props.groupName);
    	};

    	$$self.$capture_state = () => ({
    		groups,
    		groupName,
    		State,
    		Store,
    		UIDATA,
    		Accordion,
    		DrinkItem,
    		FoodItem,
    		accordionTitle,
    		$State
    	});

    	$$self.$inject_state = $$props => {
    		if ('groups' in $$props) $$invalidate(0, groups = $$props.groups);
    		if ('groupName' in $$props) $$invalidate(1, groupName = $$props.groupName);
    		if ('accordionTitle' in $$props) $$invalidate(2, accordionTitle = $$props.accordionTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [groups, groupName, accordionTitle, $State];
    }

    class ProductGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { groups: 0, groupName: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductGroup",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get groups() {
    		throw new Error("<ProductGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groups(value) {
    		throw new Error("<ProductGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupName() {
    		throw new Error("<ProductGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupName(value) {
    		throw new Error("<ProductGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ProductHead.svelte generated by Svelte v3.58.0 */

    const file$7 = "src\\components\\ProductHead.svelte";
    const get_sub_slot_changes = dirty => ({});
    const get_sub_slot_context = ctx => ({});
    const get_head_slot_changes = dirty => ({});
    const get_head_slot_context = ctx => ({});

    function create_fragment$7(ctx) {
    	let div3;
    	let div1;
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let div2;
    	let current;
    	const head_slot_template = /*#slots*/ ctx[2].head;
    	const head_slot = create_slot(head_slot_template, ctx, /*$$scope*/ ctx[1], get_head_slot_context);
    	const sub_slot_template = /*#slots*/ ctx[2].sub;
    	const sub_slot = create_slot(sub_slot_template, ctx, /*$$scope*/ ctx[1], get_sub_slot_context);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			img_1 = element("img");
    			t0 = space();
    			div0 = element("div");
    			if (head_slot) head_slot.c();
    			t1 = space();
    			div2 = element("div");
    			if (sub_slot) sub_slot.c();
    			if (!src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[0])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "");
    			attr_dev(img_1, "class", "svelte-e52dl9");
    			add_location(img_1, file$7, 6, 8, 107);
    			attr_dev(div0, "class", "page-name svelte-e52dl9");
    			add_location(div0, file$7, 7, 8, 143);
    			attr_dev(div1, "class", "image-container svelte-e52dl9");
    			add_location(div1, file$7, 5, 4, 68);
    			attr_dev(div2, "class", "page-description svelte-e52dl9");
    			add_location(div2, file$7, 11, 4, 233);
    			attr_dev(div3, "class", "container svelte-e52dl9");
    			add_location(div3, file$7, 4, 0, 39);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, img_1);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			if (head_slot) {
    				head_slot.m(div0, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			if (sub_slot) {
    				sub_slot.m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*img*/ 1 && !src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[0])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (head_slot) {
    				if (head_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						head_slot,
    						head_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(head_slot_template, /*$$scope*/ ctx[1], dirty, get_head_slot_changes),
    						get_head_slot_context
    					);
    				}
    			}

    			if (sub_slot) {
    				if (sub_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						sub_slot,
    						sub_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(sub_slot_template, /*$$scope*/ ctx[1], dirty, get_sub_slot_changes),
    						get_sub_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(head_slot, local);
    			transition_in(sub_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(head_slot, local);
    			transition_out(sub_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (head_slot) head_slot.d(detaching);
    			if (sub_slot) sub_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProductHead', slots, ['head','sub']);
    	let { img } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (img === undefined && !('img' in $$props || $$self.$$.bound[$$self.$$.props['img']])) {
    			console.warn("<ProductHead> was created without expected prop 'img'");
    		}
    	});

    	const writable_props = ['img'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProductHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('img' in $$props) $$invalidate(0, img = $$props.img);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ img });

    	$$self.$inject_state = $$props => {
    		if ('img' in $$props) $$invalidate(0, img = $$props.img);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [img, $$scope, slots];
    }

    class ProductHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { img: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProductHead",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get img() {
    		throw new Error("<ProductHead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<ProductHead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Food.svelte generated by Svelte v3.58.0 */

    const { console: console_1$4 } = globals;
    const file$6 = "src\\routes\\Food.svelte";

    // (37:2) 
    function create_head_slot$1(ctx) {
    	let h1;
    	let t_value = UIDATA.PRODUCTGROUPS[0][/*$State*/ ctx[0].lang].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(t_value);
    			attr_dev(h1, "slot", "head");
    			add_location(h1, file$6, 36, 2, 990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$State*/ 1 && t_value !== (t_value = UIDATA.PRODUCTGROUPS[0][/*$State*/ ctx[0].lang].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_head_slot$1.name,
    		type: "slot",
    		source: "(37:2) ",
    		ctx
    	});

    	return block;
    }

    // (38:2) 
    function create_sub_slot$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Scopri i nostri deliziosi piatti creati con ingredienti freschi e di alta qualità, dalla ricca selezione di antipasti ai piatti principali di carne e pesce.";
    			attr_dev(div, "slot", "sub");
    			add_location(div, file$6, 37, 2, 1059);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_sub_slot$1.name,
    		type: "slot",
    		source: "(38:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let main;
    	let producthead;
    	let t;
    	let productgroup;
    	let div_intro;
    	let div_outro;
    	let current;

    	producthead = new ProductHead({
    			props: {
    				img: './img/food-head.jpeg',
    				$$slots: {
    					sub: [create_sub_slot$1],
    					head: [create_head_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	productgroup = new ProductGroup({
    			props: {
    				groups: /*foodGroups*/ ctx[1],
    				groupName: "food"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			main = element("main");
    			create_component(producthead.$$.fragment);
    			t = space();
    			create_component(productgroup.$$.fragment);
    			attr_dev(main, "class", "svelte-13k6ah");
    			add_location(main, file$6, 34, 0, 935);
    			attr_dev(div, "class", "page");
    			add_location(div, file$6, 32, 0, 846);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, main);
    			mount_component(producthead, main, null);
    			append_dev(main, t);
    			mount_component(productgroup, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const producthead_changes = {};

    			if (dirty & /*$$scope, $State*/ 129) {
    				producthead_changes.$$scope = { dirty, ctx };
    			}

    			producthead.$set(producthead_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(producthead.$$.fragment, local);
    			transition_in(productgroup.$$.fragment, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, { duration: 200, delay: 200 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(producthead.$$.fragment, local);
    			transition_out(productgroup.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(producthead);
    			destroy_component(productgroup);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $State;
    	let $FoodData;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(0, $State = $$value));
    	validate_store(FoodData, 'FoodData');
    	component_subscribe($$self, FoodData, $$value => $$invalidate(2, $FoodData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Food', slots, []);

    	$FoodData.map((item, index) => {
    		item.id = "food" + index;
    	});

    	let antipasti = $FoodData.filter(i => i.group === "Antipasti");
    	let primi = $FoodData.filter(i => i.group === "Primi");
    	let secondi = $FoodData.filter(i => i.group === "Secondi");
    	let dessert = $FoodData.filter(i => i.group === "Dessert");
    	const foodGroups = [antipasti, primi, secondi, dessert];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Food> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		State,
    		UIDATA,
    		FoodData,
    		ProductGroup,
    		ProductHead,
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		draw,
    		crossfade,
    		antipasti,
    		primi,
    		secondi,
    		dessert,
    		foodGroups,
    		$State,
    		$FoodData
    	});

    	$$self.$inject_state = $$props => {
    		if ('antipasti' in $$props) antipasti = $$props.antipasti;
    		if ('primi' in $$props) primi = $$props.primi;
    		if ('secondi' in $$props) secondi = $$props.secondi;
    		if ('dessert' in $$props) dessert = $$props.dessert;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$State*/ 1) {
    			console.log("$State.lang", $State.lang);
    		}
    	};

    	return [$State, foodGroups];
    }

    class Food extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Food",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\routes\Drink.svelte generated by Svelte v3.58.0 */

    const { console: console_1$3 } = globals;
    const file$5 = "src\\routes\\Drink.svelte";

    // (40:2) 
    function create_head_slot(ctx) {
    	let h1;
    	let t_value = UIDATA.PRODUCTGROUPS[1][/*$State*/ ctx[0].lang].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(t_value);
    			attr_dev(h1, "slot", "head");
    			add_location(h1, file$5, 39, 2, 1194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$State*/ 1 && t_value !== (t_value = UIDATA.PRODUCTGROUPS[1][/*$State*/ ctx[0].lang].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_head_slot.name,
    		type: "slot",
    		source: "(40:2) ",
    		ctx
    	});

    	return block;
    }

    // (41:2) 
    function create_sub_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Accompagna il tuo pasto con uno dei nostri deliziosi drink! Dalla nostra selezione di vini pregiati alle bevande analcoliche, c'è qualcosa per accontentare ogni palato.";
    			attr_dev(div, "slot", "sub");
    			add_location(div, file$5, 40, 2, 1263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_sub_slot.name,
    		type: "slot",
    		source: "(41:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let main;
    	let producthead;
    	let t;
    	let productgroup;
    	let div_intro;
    	let div_outro;
    	let current;

    	producthead = new ProductHead({
    			props: {
    				img: './img/drink-head.jpeg',
    				$$slots: {
    					sub: [create_sub_slot],
    					head: [create_head_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	productgroup = new ProductGroup({
    			props: {
    				groups: /*drinkGroups*/ ctx[1],
    				groupName: "drink"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			main = element("main");
    			create_component(producthead.$$.fragment);
    			t = space();
    			create_component(productgroup.$$.fragment);
    			attr_dev(main, "class", "svelte-13k6ah");
    			add_location(main, file$5, 37, 1, 1138);
    			attr_dev(div, "class", "page");
    			add_location(div, file$5, 36, 0, 1050);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, main);
    			mount_component(producthead, main, null);
    			append_dev(main, t);
    			mount_component(productgroup, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const producthead_changes = {};

    			if (dirty & /*$$scope, $State*/ 129) {
    				producthead_changes.$$scope = { dirty, ctx };
    			}

    			producthead.$set(producthead_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(producthead.$$.fragment, local);
    			transition_in(productgroup.$$.fragment, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, { duration: 200, delay: 200 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(producthead.$$.fragment, local);
    			transition_out(productgroup.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 200 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(producthead);
    			destroy_component(productgroup);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $State;
    	let $DrinkData;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(0, $State = $$value));
    	validate_store(DrinkData, 'DrinkData');
    	component_subscribe($$self, DrinkData, $$value => $$invalidate(2, $DrinkData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Drink', slots, []);

    	$DrinkData.map((item, index) => {
    		item.id = "drink" + index;
    	});

    	let viniRossi = $DrinkData.filter(i => i.group === "Vino rosso");
    	let viniBianchi = $DrinkData.filter(i => i.group === "Vino bianco");
    	let birre = $DrinkData.filter(i => i.group === "Birra");
    	let analcolici = $DrinkData.filter(i => i.group === "Analcolici" || i.group === "Bar");
    	const drinkGroups = [viniRossi, viniBianchi, birre, analcolici];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Drink> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		State,
    		UIDATA,
    		DrinkData,
    		ProductGroup,
    		ProductHead,
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		draw,
    		crossfade,
    		viniRossi,
    		viniBianchi,
    		birre,
    		analcolici,
    		drinkGroups,
    		$State,
    		$DrinkData
    	});

    	$$self.$inject_state = $$props => {
    		if ('viniRossi' in $$props) viniRossi = $$props.viniRossi;
    		if ('viniBianchi' in $$props) viniBianchi = $$props.viniBianchi;
    		if ('birre' in $$props) birre = $$props.birre;
    		if ('analcolici' in $$props) analcolici = $$props.analcolici;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$State*/ 1) {
    			console.log("$State.lang", $State.lang);
    		}
    	};

    	return [$State, drinkGroups];
    }

    class Drink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Drink",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\FavsCard.svelte generated by Svelte v3.58.0 */

    const { console: console_1$2 } = globals;
    const file$4 = "src\\components\\FavsCard.svelte";

    // (45:4) {#if item.altSize && item.altSize !== ""}
    function create_if_block$2(ctx) {
    	let div;
    	let t0_value = /*item*/ ctx[0][/*altSize*/ ctx[2]] + "";
    	let t0;
    	let t1;
    	let br0;
    	let t2;
    	let t3_value = /*item*/ ctx[0][/*altCost*/ ctx[1]] + "";
    	let t3;
    	let t4;
    	let br1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			br0 = element("br");
    			t2 = text("\r\n        € ");
    			t3 = text(t3_value);
    			t4 = space();
    			br1 = element("br");
    			add_location(br0, file$4, 46, 24, 1289);
    			add_location(br1, file$4, 47, 26, 1323);
    			attr_dev(div, "class", "alt-item svelte-h6wtjc");
    			add_location(div, file$4, 45, 4, 1241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, br0);
    			append_dev(div, t2);
    			append_dev(div, t3);
    			append_dev(div, t4);
    			append_dev(div, br1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item, altSize*/ 5 && t0_value !== (t0_value = /*item*/ ctx[0][/*altSize*/ ctx[2]] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*item, altCost*/ 3 && t3_value !== (t3_value = /*item*/ ctx[0][/*altCost*/ ctx[1]] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(45:4) {#if item.altSize && item.altSize !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let h30;
    	let t0_value = /*item*/ ctx[0][/*name*/ ctx[4]] + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*item*/ ctx[0][/*description*/ ctx[3]] + "";
    	let t2;
    	let t3;
    	let h31;
    	let t4_value = /*item*/ ctx[0].cost + "";
    	let t4;
    	let t5;
    	let t6;
    	let div0;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;
    	let if_block = /*item*/ ctx[0].altSize && /*item*/ ctx[0].altSize !== "" && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h30 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			h31 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			div0 = element("div");
    			img = element("img");
    			add_location(h30, file$4, 40, 4, 1107);
    			add_location(p, file$4, 41, 4, 1134);
    			add_location(h31, file$4, 42, 4, 1166);
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/icon-favitem-on.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$4, 52, 8, 1392);
    			attr_dev(div0, "class", "fav-icon svelte-h6wtjc");
    			add_location(div0, file$4, 51, 4, 1360);
    			attr_dev(div1, "class", "card svelte-h6wtjc");
    			add_location(div1, file$4, 39, 0, 1047);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h30);
    			append_dev(h30, t0);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			append_dev(div1, h31);
    			append_dev(h31, t4);
    			append_dev(div1, t5);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, img);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item, name*/ 17 && t0_value !== (t0_value = /*item*/ ctx[0][/*name*/ ctx[4]] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*item, description*/ 9 && t2_value !== (t2_value = /*item*/ ctx[0][/*description*/ ctx[3]] + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*item*/ 1 && t4_value !== (t4_value = /*item*/ ctx[0].cost + "")) set_data_dev(t4, t4_value);

    			if (/*item*/ ctx[0].altSize && /*item*/ ctx[0].altSize !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div1, t6);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let name;
    	let description;
    	let altSize;
    	let altCost;
    	let $State;
    	let $Store;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(6, $State = $$value));
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(8, $Store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FavsCard', slots, []);
    	let { item } = $$props;
    	const dispatch = createEventDispatcher();

    	const removeFav = itemId => {
    		let clickedItemId = itemId;
    		set_store_value(Store, $Store.favs = $Store.favs.filter(i => i !== clickedItemId), $Store);

    		if ($Store.favs.length === 0) {
    			dispatch("emptyFav");
    			console.log("emptyFav");
    		}
    	};

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console_1$2.warn("<FavsCard> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<FavsCard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => removeFav(item.id);

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		item,
    		UIDATA,
    		State,
    		Store,
    		createEventDispatcher,
    		dispatch,
    		removeFav,
    		altCost,
    		altSize,
    		description,
    		name,
    		$State,
    		$Store
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('altCost' in $$props) $$invalidate(1, altCost = $$props.altCost);
    		if ('altSize' in $$props) $$invalidate(2, altSize = $$props.altSize);
    		if ('description' in $$props) $$invalidate(3, description = $$props.description);
    		if ('name' in $$props) $$invalidate(4, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$State*/ 64) {
    			if ($State.lang === UIDATA.LANGS[0]) {
    				$$invalidate(4, name = "name");
    				$$invalidate(3, description = "description");
    				$$invalidate(2, altSize = "altSize");
    				$$invalidate(1, altCost = "altCost");
    			} else if ($State.lang === UIDATA.LANGS[1]) {
    				$$invalidate(4, name = "engName");
    				$$invalidate(3, description = "engDescription");
    				$$invalidate(2, altSize = "engAltSize");
    				$$invalidate(1, altCost = "engAltCost");
    			}
    		}
    	};

    	$$invalidate(4, name = '');
    	$$invalidate(3, description = '');
    	$$invalidate(2, altSize = '');
    	$$invalidate(1, altCost = '');
    	return [item, altCost, altSize, description, name, removeFav, $State, click_handler];
    }

    class FavsCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FavsCard",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get item() {
    		throw new Error("<FavsCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<FavsCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Favs.svelte generated by Svelte v3.58.0 */
    const file$3 = "src\\components\\Favs.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (64:12) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Clicca su un prodotto per aggiungerlo ai preferiti.";
    			add_location(p, file$3, 64, 16, 1886);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(64:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#if favsCount > 0}
    function create_if_block$1(ctx) {
    	let t0;
    	let button;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$Store*/ ctx[1].favs;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			button = element("button");
    			t1 = text(/*clearButtonText*/ ctx[2]);
    			attr_dev(button, "class", "svelte-15ozslz");
    			add_location(button, file$3, 62, 16, 1792);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*clearFavs*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$FoodData, $Store, $DrinkData*/ 98) {
    				each_value = /*$Store*/ ctx[1].favs;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*clearButtonText*/ 4) set_data_dev(t1, /*clearButtonText*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(49:12) {#if favsCount > 0}",
    		ctx
    	});

    	return block;
    }

    // (52:24) {#if item.id === id}
    function create_if_block_2$1(ctx) {
    	let favscard;
    	let current;

    	favscard = new FavsCard({
    			props: { item: /*item*/ ctx[15] },
    			$$inline: true
    		});

    	favscard.$on("emptyFav", /*emptyFav_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(favscard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(favscard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const favscard_changes = {};
    			if (dirty & /*$DrinkData*/ 32) favscard_changes.item = /*item*/ ctx[15];
    			favscard.$set(favscard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favscard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favscard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(favscard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(52:24) {#if item.id === id}",
    		ctx
    	});

    	return block;
    }

    // (51:20) {#each $DrinkData as item}
    function create_each_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*item*/ ctx[15].id === /*id*/ ctx[12] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[15].id === /*id*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$DrinkData, $Store*/ 34) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(51:20) {#each $DrinkData as item}",
    		ctx
    	});

    	return block;
    }

    // (57:24) {#if item.id === id}
    function create_if_block_1$1(ctx) {
    	let favscard;
    	let current;

    	favscard = new FavsCard({
    			props: { item: /*item*/ ctx[15] },
    			$$inline: true
    		});

    	favscard.$on("emptyFav", /*emptyFav_handler_1*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(favscard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(favscard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const favscard_changes = {};
    			if (dirty & /*$FoodData*/ 64) favscard_changes.item = /*item*/ ctx[15];
    			favscard.$set(favscard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favscard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favscard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(favscard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(57:24) {#if item.id === id}",
    		ctx
    	});

    	return block;
    }

    // (56:20) {#each $FoodData as item}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*item*/ ctx[15].id === /*id*/ ctx[12] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*item*/ ctx[15].id === /*id*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$FoodData, $Store*/ 66) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:20) {#each $FoodData as item}",
    		ctx
    	});

    	return block;
    }

    // (50:16) {#each $Store.favs as id}
    function create_each_block(ctx) {
    	let t;
    	let each1_anchor;
    	let current;
    	let each_value_2 = /*$DrinkData*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value_1 = /*$FoodData*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$DrinkData, $Store*/ 34) {
    				each_value_2 = /*$DrinkData*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$FoodData, $Store*/ 66) {
    				each_value_1 = /*$FoodData*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(50:16) {#each $Store.favs as id}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let main_intro;
    	let main_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*favsCount*/ ctx[4] > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*titleText*/ ctx[3]);
    			t1 = space();
    			button = element("button");
    			button.textContent = "X";
    			t3 = space();
    			div1 = element("div");
    			if_block.c();
    			add_location(h1, file$3, 40, 12, 1028);
    			attr_dev(button, "class", "svelte-15ozslz");
    			add_location(button, file$3, 41, 12, 1062);
    			attr_dev(div0, "class", "favs-head svelte-15ozslz");
    			add_location(div0, file$3, 39, 8, 991);
    			attr_dev(div1, "id", "favs-list");
    			attr_dev(div1, "class", "svelte-15ozslz");
    			add_location(div1, file$3, 47, 8, 1222);
    			attr_dev(div2, "class", "page is--fav svelte-15ozslz");
    			add_location(div2, file$3, 38, 4, 955);
    			attr_dev(main, "id", "favs");
    			attr_dev(main, "class", "svelte-15ozslz");
    			add_location(main, file$3, 33, 0, 839);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*titleText*/ 8) set_data_dev(t0, /*titleText*/ ctx[3]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!current) return;
    				if (main_outro) main_outro.end(1);
    				main_intro = create_in_transition(main, fly, { duration: 400, y: "12em" });
    				main_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (main_intro) main_intro.invalidate();
    			main_outro = create_out_transition(main, fly, { duration: 200, y: "12em" });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			if (detaching && main_outro) main_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let favsCount;
    	let titleText;
    	let clearButtonText;
    	let $State;
    	let $Store;
    	let $DrinkData;
    	let $FoodData;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(0, $State = $$value));
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(1, $Store = $$value));
    	validate_store(DrinkData, 'DrinkData');
    	component_subscribe($$self, DrinkData, $$value => $$invalidate(5, $DrinkData = $$value));
    	validate_store(FoodData, 'FoodData');
    	component_subscribe($$self, FoodData, $$value => $$invalidate(6, $FoodData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Favs', slots, []);

    	const clearFavs = itemId => {
    		set_store_value(Store, $Store.favs = [], $Store);
    		set_store_value(State, $State.isFavOpen = false, $State);
    	};

    	const body = document.querySelector("body");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Favs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(State, $State.isFavOpen = false, $State);
    	};

    	function emptyFav_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function emptyFav_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({
    		UIDATA,
    		State,
    		Store,
    		FavsCard,
    		fade,
    		blur,
    		fly,
    		slide,
    		scale,
    		draw,
    		crossfade,
    		FoodData,
    		DrinkData,
    		clearFavs,
    		body,
    		clearButtonText,
    		titleText,
    		favsCount,
    		$State,
    		$Store,
    		$DrinkData,
    		$FoodData
    	});

    	$$self.$inject_state = $$props => {
    		if ('clearButtonText' in $$props) $$invalidate(2, clearButtonText = $$props.clearButtonText);
    		if ('titleText' in $$props) $$invalidate(3, titleText = $$props.titleText);
    		if ('favsCount' in $$props) $$invalidate(4, favsCount = $$props.favsCount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$Store*/ 2) {
    			$$invalidate(4, favsCount = $Store.favs.length);
    		}

    		if ($$self.$$.dirty & /*$State*/ 1) {
    			$$invalidate(3, titleText = UIDATA.FAVSTITLE[$State.lang]);
    		}

    		if ($$self.$$.dirty & /*$State*/ 1) {
    			$$invalidate(2, clearButtonText = UIDATA.FAVSCLEARBUTTON[$State.lang]);
    		}

    		if ($$self.$$.dirty & /*$State*/ 1) {
    			$State.isFavOpen
    			? body.classList.add("lockscroll")
    			: body.classList.remove("lockscroll");
    		}
    	};

    	return [
    		$State,
    		$Store,
    		clearButtonText,
    		titleText,
    		favsCount,
    		$DrinkData,
    		$FoodData,
    		clearFavs,
    		click_handler,
    		emptyFav_handler,
    		emptyFav_handler_1
    	];
    }

    class Favs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Favs",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\NavRouteSwitch.svelte generated by Svelte v3.58.0 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\components\\NavRouteSwitch.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let a0;
    	let button0;
    	let t1;
    	let a1;
    	let button1;
    	let t3;
    	let a2;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "food";
    			t1 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "drinks";
    			t3 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "home";
    			attr_dev(button0, "class", "svelte-1cr9a1v");
    			add_location(button0, file$2, 22, 8, 573);
    			attr_dev(a0, "href", "#/food/");
    			add_location(a0, file$2, 21, 4, 545);
    			attr_dev(button1, "class", "svelte-1cr9a1v");
    			add_location(button1, file$2, 27, 8, 693);
    			attr_dev(a1, "href", "#/drink/");
    			add_location(a1, file$2, 26, 4, 664);
    			attr_dev(button2, "class", "svelte-1cr9a1v");
    			add_location(button2, file$2, 32, 8, 809);
    			attr_dev(a2, "href", "#/");
    			add_location(a2, file$2, 31, 4, 786);
    			attr_dev(div, "class", "nav-switch svelte-1cr9a1v");
    			add_location(div, file$2, 20, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, button0);
    			append_dev(div, t1);
    			append_dev(div, a1);
    			append_dev(a1, button1);
    			append_dev(div, t3);
    			append_dev(div, a2);
    			append_dev(a2, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavRouteSwitch', slots, []);
    	const dispatch = createEventDispatcher();

    	const goToSwitch = () => {
    		console.log('wewe');
    	}; // if ($State.isFavOpen) {
    	//     $State.isFavOpen = false
    	// }
    	// dispatch('NavRouteSwitch');

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<NavRouteSwitch> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => goToSwitch();
    	const click_handler_1 = () => goToSwitch();
    	const click_handler_2 = () => goToSwitch();

    	$$self.$capture_state = () => ({
    		State,
    		Store,
    		UIDATA,
    		push,
    		pop,
    		replace,
    		createEventDispatcher,
    		dispatch,
    		goToSwitch
    	});

    	return [goToSwitch, click_handler, click_handler_1, click_handler_2];
    }

    class NavRouteSwitch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavRouteSwitch",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Nav.svelte generated by Svelte v3.58.0 */

    const { console: console_1 } = globals;
    const file$1 = "src\\components\\Nav.svelte";

    // (52:8) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*showNavRouteSwitch*/ ctx[2] && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			t = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/menu-on.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1z3hlt");
    			add_location(img, file$1, 53, 16, 1536);
    			attr_dev(button, "class", "svelte-1z3hlt");
    			add_location(button, file$1, 52, 12, 1470);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);
    			append_dev(button, t);
    			if (if_block) if_block.m(button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[12], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*showNavRouteSwitch*/ ctx[2]) {
    				if (if_block) {
    					if (dirty & /*showNavRouteSwitch*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(52:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#if $location !== "/"}
    function create_if_block_2(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/menu-on.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1z3hlt");
    			add_location(img, file$1, 49, 16, 1372);
    			attr_dev(button, "class", "svelte-1z3hlt");
    			add_location(button, file$1, 48, 12, 1318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[11], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(48:8) {#if $location !== \\\"/\\\"}",
    		ctx
    	});

    	return block;
    }

    // (55:16) {#if showNavRouteSwitch}
    function create_if_block_3(ctx) {
    	let navrouteswitch;
    	let current;
    	navrouteswitch = new NavRouteSwitch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navrouteswitch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navrouteswitch, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navrouteswitch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navrouteswitch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navrouteswitch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(55:16) {#if showNavRouteSwitch}",
    		ctx
    	});

    	return block;
    }

    // (64:12) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/navfav-off.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1z3hlt");
    			add_location(img, file$1, 64, 16, 1948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(64:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:12) {#if favsCount > 0}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			t1 = text(/*favsCount*/ ctx[3]);
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/navfav-on.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1z3hlt");
    			add_location(img, file$1, 61, 16, 1834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*favsCount*/ 8) set_data_dev(t1, /*favsCount*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(61:12) {#if favsCount > 0}",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if $State.isFavOpen}
    function create_if_block(ctx) {
    	let favs;
    	let current;
    	favs = new Favs({ $$inline: true });
    	favs.$on("emptyFav", /*toggleFavs*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(favs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(favs, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(favs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(71:0) {#if $State.isFavOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let nav;
    	let div;
    	let button0;
    	let img;
    	let img_src_value;
    	let t0;
    	let t1;
    	let t2;
    	let current_block_type_index;
    	let if_block0;
    	let t3;
    	let button1;
    	let t4;
    	let if_block2_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$location*/ ctx[1] !== "/") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*favsCount*/ ctx[3] > 0) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = /*$State*/ ctx[0].isFavOpen && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			button0 = element("button");
    			img = element("img");
    			t0 = space();
    			t1 = text(/*otherLang*/ ctx[4]);
    			t2 = space();
    			if_block0.c();
    			t3 = space();
    			button1 = element("button");
    			if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			if (!src_url_equal(img.src, img_src_value = "./img/icons/navlang.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1z3hlt");
    			add_location(img, file$1, 44, 12, 1183);
    			attr_dev(button0, "class", "svelte-1z3hlt");
    			add_location(button0, file$1, 43, 8, 1131);
    			attr_dev(button1, "class", "svelte-1z3hlt");
    			add_location(button1, file$1, 59, 8, 1745);
    			attr_dev(div, "class", "inner-nav svelte-1z3hlt");
    			add_location(div, file$1, 42, 4, 1098);
    			attr_dev(nav, "class", "svelte-1z3hlt");
    			add_location(nav, file$1, 41, 0, 1087);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, button0);
    			append_dev(button0, img);
    			append_dev(button0, t0);
    			append_dev(button0, t1);
    			append_dev(div, t2);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t3);
    			append_dev(div, button1);
    			if_block1.m(button1, null);
    			insert_dev(target, t4, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_3*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*otherLang*/ 16) set_data_dev(t1, /*otherLang*/ ctx[4]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t3);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(button1, null);
    				}
    			}

    			if (/*$State*/ ctx[0].isFavOpen) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$State*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_blocks[current_block_type_index].d();
    			if_block1.d();
    			if (detaching) detach_dev(t4);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let otherLang;
    	let favsCount;
    	let showNavRouteSwitch;
    	let $State;
    	let $Store;
    	let $location;
    	validate_store(State, 'State');
    	component_subscribe($$self, State, $$value => $$invalidate(0, $State = $$value));
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(9, $Store = $$value));
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(1, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);

    	const toggleFavs = () => {
    		set_store_value(State, $State.isFavOpen = !$State.isFavOpen, $State);
    	};

    	const toggleLang = () => {
    		$State.lang === UIDATA.LANGS[0]
    		? set_store_value(State, $State.lang = UIDATA.LANGS[1], $State)
    		: set_store_value(State, $State.lang = UIDATA.LANGS[0], $State);
    	};

    	const goToHome = () => {
    		if ($State.isFavOpen) {
    			set_store_value(State, $State.isFavOpen = false, $State);
    		}

    		push("/");
    	};

    	const toggleNavRouteSwitch = () => {
    		$$invalidate(2, showNavRouteSwitch = !showNavRouteSwitch);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toggleLang();
    	const click_handler_1 = () => goToHome();
    	const click_handler_2 = () => toggleNavRouteSwitch();
    	const click_handler_3 = () => toggleFavs();

    	$$self.$capture_state = () => ({
    		State,
    		Store,
    		UIDATA,
    		push,
    		pop,
    		replace,
    		location,
    		Favs,
    		NavRouteSwitch,
    		toggleFavs,
    		toggleLang,
    		goToHome,
    		toggleNavRouteSwitch,
    		showNavRouteSwitch,
    		favsCount,
    		otherLang,
    		$State,
    		$Store,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('showNavRouteSwitch' in $$props) $$invalidate(2, showNavRouteSwitch = $$props.showNavRouteSwitch);
    		if ('favsCount' in $$props) $$invalidate(3, favsCount = $$props.favsCount);
    		if ('otherLang' in $$props) $$invalidate(4, otherLang = $$props.otherLang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 2) {
    			console.log("$location", $location);
    		}

    		if ($$self.$$.dirty & /*$State*/ 1) {
    			$$invalidate(4, otherLang = $State.lang == UIDATA.LANGS[0]
    			? $$invalidate(4, otherLang = UIDATA.LANGS[1])
    			: $$invalidate(4, otherLang = UIDATA.LANGS[0]));
    		}

    		if ($$self.$$.dirty & /*$Store*/ 512) {
    			$$invalidate(3, favsCount = $Store.favs.length);
    		}
    	};

    	$$invalidate(2, showNavRouteSwitch = false);

    	return [
    		$State,
    		$location,
    		showNavRouteSwitch,
    		favsCount,
    		otherLang,
    		toggleFavs,
    		toggleLang,
    		goToHome,
    		toggleNavRouteSwitch,
    		$Store,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.58.0 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let t;
    	let nav;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	nav = new Nav({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			t = space();
    			create_component(nav.$$.fragment);
    			add_location(main, file, 26, 0, 466);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			append_dev(main, t);
    			mount_component(nav, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			transition_in(nav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			transition_out(nav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    			destroy_component(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let routes = {
    		'/': Home,
    		'/food/': Food,
    		'/drink': Drink,
    		'*': Home
    	}; // '*' : NotFound

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, Home, Food, Drink, Nav, routes });

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(0, routes = $$props.routes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	// props: {
    	// 	name: 'world'
    	// }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

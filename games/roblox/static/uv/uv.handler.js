if (!self.  ) {
      Hook(self, self.  $config, self.  $config.bare);
};

async function   Hook(window, config = {}, bare = '/bare/') {
    if ('  ' in window && window.   instanceof Ultraviolet) return false;

    if (window.document && !!window.window) {
        window.document.querySelectorAll("script[  -script]").forEach(node => node.remove())
    };

    const worker = !window.window;
    const master = '  ';
    const methodPrefix = '  $';
    const    = new Ultraviolet({
        ...config,
        window,
    });

    if (typeof config.construct === 'function') {
        config.construct(  , worker ? 'worker' : 'window');
    };

    const { client } =   ;
    const {
        HTMLMediaElement,
        HTMLScriptElement,
        HTMLAudioElement,
        HTMLVideoElement,
        HTMLInputElement,
        HTMLEmbedElement,
        HTMLTrackElement,
        HTMLAnchorElement,
        HTMLIFrameElement,
        HTMLAreaElement,
        HTMLLinkElement,
        HTMLBaseElement,
        HTMLFormElement,
        HTMLImageElement,
        HTMLSourceElement,
    } = window;

    client.nativeMethods.defineProperty(window, '  ', {
        value:   ,
        enumerable: false,
    });


      .meta.origin = location.origin;
      .location = client.location.emulate(
        (href) => {
            if (href === 'about:srcdoc') return new URL(href);
            if (href.startsWith('blob:')) href = href.slice('blob:'.length);
            return new URL(  .sourceUrl(href));
        },
        (href) => {
            return   .rewriteUrl(href);
        },
    );

      .cookieStr = window.  $cookies || '';
      .meta.url =   .location;
      .domain =   .meta.url.host;
      .blobUrls = new window.Map();
      .referrer = '';
      .cookies = [];
      .localStorageObj = {};
      .sessionStorageObj = {};

    try {
          .bare = new URL(bare, window.location.href);
    } catch (e) {
          .bare = window.parent.  .bare;
    };

    if (  .location.href === 'about:srcdoc') {
          .meta = window.parent.  .meta;
    };

    if (window.EventTarget) {
          .addEventListener = window.EventTarget.prototype.addEventListener;
          .removeListener = window.EventTarget.prototype.removeListener;
          .dispatchEvent = window.EventTarget.prototype.dispatchEvent;
    };

    // Storage wrappers
    client.nativeMethods.defineProperty(client.storage.storeProto, '  $storageObj', {
        get() {
            if (this === client.storage.sessionStorage) return   .sessionStorageObj;
            if (this === client.storage.localStorage) return   .localStorageObj;
        },
        enumerable: false,
    });

    if (window.localStorage) {
        for (const key in window.localStorage) {
            if (key.startsWith(methodPrefix +   .location.origin + '@')) {
                  .localStorageObj[key.slice((methodPrefix +   .location.origin + '@').length)] = window.localStorage.getItem(key);
            };
        };

          .lsWrap = client.storage.emulate(client.storage.localStorage,   .localStorageObj);
    };

    if (window.sessionStorage) {
        for (const key in window.sessionStorage) {
            if (key.startsWith(methodPrefix +   .location.origin + '@')) {
                  .sessionStorageObj[key.slice((methodPrefix +   .location.origin + '@').length)] = window.sessionStorage.getItem(key);
            };
        };

          .ssWrap = client.storage.emulate(client.storage.sessionStorage,   .sessionStorageObj);
    };



    let rawBase = window.document ? client.node.baseURI.get.call(window.document) : window.location.href;
    let base =   .sourceUrl(rawBase);

    client.nativeMethods.defineProperty(  .meta, 'base', {
        get() {
            if (!window.document) return   .meta.url.href;

            if (client.node.baseURI.get.call(window.document) !== rawBase) {
                rawBase = client.node.baseURI.get.call(window.document);
                base =   .sourceUrl(rawBase);
            };

            return base;
        },
    });


      .methods = {
        setSource: methodPrefix + 'setSource',
        source: methodPrefix + 'source',
        location: methodPrefix + 'location',
        function: methodPrefix + 'function',
        string: methodPrefix + 'string',
        eval: methodPrefix + 'eval',
        parent: methodPrefix + 'parent',
        top: methodPrefix + 'top',
    };

      .filterKeys = [
        master,
          .methods.setSource,
          .methods.source,
          .methods.location,
          .methods.function,
          .methods.string,
          .methods.eval,
          .methods.parent,
          .methods.top,
        methodPrefix + 'protocol',
        methodPrefix + 'storageObj',
        methodPrefix + 'url',
        methodPrefix + 'modifiedStyle',
        methodPrefix + 'config',
        methodPrefix + 'dispatched',
        'Ultraviolet',
        '  Hook',
    ];


    client.on('wrap', (target, wrapped) => {
        client.nativeMethods.defineProperty(wrapped, 'name', client.nativeMethods.getOwnPropertyDescriptor(target, 'name'));
        client.nativeMethods.defineProperty(wrapped, 'length', client.nativeMethods.getOwnPropertyDescriptor(target, 'length'));

        client.nativeMethods.defineProperty(wrapped,   .methods.string, {
            enumerable: false,
            value: client.nativeMethods.fnToString.call(target),
        });

        client.nativeMethods.defineProperty(wrapped,   .methods.function, {
            enumerable: false,
            value: target,
        });
    });

    client.fetch.on('request', event => {
        event.data.input =   .rewriteUrl(event.data.input);
    });

    client.fetch.on('requestUrl', event => {
        event.data.value =   .sourceUrl(event.data.value);
    });

    client.fetch.on('responseUrl', event => {
        event.data.value =   .sourceUrl(event.data.value);
    });

    // XMLHttpRequest
    client.xhr.on('open', event => {
        event.data.input =   .rewriteUrl(event.data.input);
    });

    client.xhr.on('responseUrl', event => {
        event.data.value =   .sourceUrl(event.data.value);
    });


    // Workers
    client.workers.on('worker', event => {
        event.data.url =   .rewriteUrl(event.data.url);
    });

    client.workers.on('addModule', event => {
        event.data.url =   .rewriteUrl(event.data.url);
    });

    client.workers.on('importScripts', event => {
        for (const i in event.data.scripts) {
            event.data.scripts[i] =   .rewriteUrl(event.data.scripts[i]);
        };
    });

    client.workers.on('postMessage', event => {
        let to = event.data.origin;

        event.data.origin = '*';
        event.data.message = {
            __data: event.data.message,
            __origin:   .meta.url.origin,
            __to: to,
        };
    });

    // Navigator
    client.navigator.on('sendBeacon', event => {
        event.data.url =   .rewriteUrl(event.data.url);
    });

    // Cookies
    client.document.on('getCookie', event => {
        event.data.value =   .cookieStr;
    });

    client.document.on('setCookie', event => {
        Promise.resolve(  .cookie.setCookies(event.data.value,   .db,   .meta)).then(() => {
              .cookie.db().then(db => {
                  .cookie.getCookies(db).then(cookies => {
                      .cookieStr =   .cookie.serialize(cookies,   .meta, true);
                });
            });
        });
        const cookie =   .cookie.setCookie(event.data.value)[0];

        if (!cookie.path) cookie.path = '/';
        if (!cookie.domain) cookie.domain =   .meta.url.hostname;

        if (  .cookie.validateCookie(cookie,   .meta, true)) {
            if (  .cookieStr.length)   .cookieStr += '; ';
              .cookieStr += `${cookie.name}=${cookie.value}`;
        };

        event.respondWith(event.data.value);
    });

    // HTML
    client.element.on('setInnerHTML', event => {
        switch (event.that.tagName) {
            case 'SCRIPT':
                event.data.value =   .js.rewrite(event.data.value);
                break;
            case 'STYLE':
                event.data.value =   .rewriteCSS(event.data.value);
                break;
            default:
                event.data.value =   .rewriteHtml(event.data.value);
        };
    });

    client.element.on('getInnerHTML', event => {
        switch (event.that.tagName) {
            case 'SCRIPT':
                event.data.value =   .js.source(event.data.value);
                break;
            default:
                event.data.value =   .sourceHtml(event.data.value);
        };
    });

    client.element.on('setOuterHTML', event => {
        event.data.value =   .rewriteHtml(event.data.value, { document: event.that.tagName === 'HTML' });
    });

    client.element.on('getOuterHTML', event => {
        switch (event.that.tagName) {
            case 'HEAD':
                event.data.value =   .sourceHtml(
                    event.data.value.replace(/<head(.*)>(.*)<\/head>/s, '<op-head$1>$2</op-head>')
                ).replace(/<op-head(.*)>(.*)<\/op-head>/s, '<head$1>$2</head>');
                break;
            case 'BODY':
                event.data.value =   .sourceHtml(
                    event.data.value.replace(/<body(.*)>(.*)<\/body>/s, '<op-body$1>$2</op-body>')
                ).replace(/<op-body(.*)>(.*)<\/op-body>/s, '<body$1>$2</body>');
                break;
            default:
                event.data.value =   .sourceHtml(event.data.value, { document: event.that.tagName === 'HTML' });
                break;
        };

        //event.data.value =   .sourceHtml(event.data.value, { document: event.that.tagName === 'HTML' });
    });

    client.document.on('write', event => {
        if (!event.data.html.length) return false;
        event.data.html = [  .rewriteHtml(event.data.html.join(''))];
    });

    client.document.on('writeln', event => {
        if (!event.data.html.length) return false;
        event.data.html = [  .rewriteHtml(event.data.html.join(''))];
    });

    client.element.on('insertAdjacentHTML', event => {
        event.data.html =   .rewriteHtml(event.data.html);
    });

    // EventSource

    client.eventSource.on('construct', event => {
        event.data.url =   .rewriteUrl(event.data.url);
    });


    client.eventSource.on('url', event => {
        event.data.url =   .rewriteUrl(event.data.url);
    });

    // History
    client.history.on('replaceState', event => {
        if (event.data.url) event.data.url =   .rewriteUrl(event.data.url, '  ' in event.that ? event.that.  .meta :   .meta);
    });
    client.history.on('pushState', event => {
        if (event.data.url) event.data.url =   .rewriteUrl(event.data.url, '  ' in event.that ? event.that.  .meta :   .meta);
    });

    // Element get set attribute methods
    client.element.on('getAttribute', event => {
        if (client.element.hasAttribute.call(event.that,   .attributePrefix + '-attr-' + event.data.name)) {
            event.respondWith(
                event.target.call(event.that,   .attributePrefix + '-attr-' + event.data.name)
            );
        };
    });

    // Message
    client.message.on('postMessage', event => {
        let to = event.data.origin;
        let call =   .call;


        if (event.that) {
            call = event.that.  $source.call;
        };

        event.data.origin = '*';
        event.data.message = {
            __data: event.data.message,
            __origin: (event.that || event.target).  $source.location.origin,
            __to: to,
        };

        event.respondWith(
            worker ?
                call(event.target, [event.data.message, event.data.transfer], event.that) :
                call(event.target, [event.data.message, event.data.origin, event.data.transfer], event.that)
        );

    });

    client.message.on('data', event => {
        const { value: data } = event.data;
        if (typeof data === 'object' && '__data' in data && '__origin' in data) {
            event.respondWith(data.__data);
        };
    });

    client.message.on('origin', event => {
        const data = client.message.messageData.get.call(event.that);
        if (typeof data === 'object' && data.__data && data.__origin) {
            event.respondWith(data.__origin);
        };
    });

    client.overrideDescriptor(window, 'origin', {
        get: (target, that) => {
            return   .location.origin;
        },
    });

    client.node.on('baseURI', event => {
        if (event.data.value.startsWith(window.location.origin)) event.data.value =   .sourceUrl(event.data.value);
    });

    client.element.on('setAttribute', event => {
        if (event.that instanceof HTMLMediaElement && event.data.name === 'src' && event.data.value.startsWith('blob:')) {
            event.target.call(event.that,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .blobUrls.get(event.data.value);
            return;
        };

        if (  .attrs.isUrl(event.data.name)) {
            event.target.call(event.that,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .rewriteUrl(event.data.value);
        };

        if (  .attrs.isStyle(event.data.name)) {
            event.target.call(event.that,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .rewriteCSS(event.data.value, { context: 'declarationList' });
        };

        if (  .attrs.isHtml(event.data.name)) {
            event.target.call(event.that,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .rewriteHtml(event.data.value, { ...  .meta, document: true, injectHead:   .createHtmlInject(  .handlerScript,   .bundleScript,   .configScript,   .cookieStr, window.location.href) });
        };

        if (  .attrs.isSrcset(event.data.name)) {
            event.target.call(event.that,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .html.wrapSrcset(event.data.value);
        };

        if (  .attrs.isForbidden(event.data.name)) {
            event.data.name =   .attributePrefix + '-attr-' + event.data.name;
        };
    });

    client.element.on('audio', event => {
        event.data.url =   .rewriteUrl(event.data.url);
    });

    // Element Property Attributes
    client.element.hookProperty([HTMLAnchorElement, HTMLAreaElement, HTMLLinkElement, HTMLBaseElement], 'href', {
        get: (target, that) => {
            return   .sourceUrl(
                target.call(that)
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that,   .attributePrefix + '-attr-href', val)
            target.call(that,   .rewriteUrl(val));
        },
    });

    client.element.hookProperty([HTMLScriptElement, HTMLAudioElement, HTMLVideoElement, HTMLMediaElement, HTMLImageElement, HTMLInputElement, HTMLEmbedElement, HTMLIFrameElement, HTMLTrackElement, HTMLSourceElement], 'src', {
        get: (target, that) => {
            return   .sourceUrl(
                target.call(that)
            );
        },
        set: (target, that, [val]) => {
            if (new String(val).toString().trim().startsWith('blob:') && that instanceof HTMLMediaElement) {
                client.element.setAttribute.call(that,   .attributePrefix + '-attr-src', val)
                return target.call(that,   .blobUrls.get(val) || val);
            };

            client.element.setAttribute.call(that,   .attributePrefix + '-attr-src', val)
            target.call(that,   .rewriteUrl(val));
        },
    });

    client.element.hookProperty([HTMLFormElement], 'action', {
        get: (target, that) => {
            return   .sourceUrl(
                target.call(that)
            );
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that,   .attributePrefix + '-attr-action', val)
            target.call(that,   .rewriteUrl(val));
        },
    });

    client.element.hookProperty([HTMLImageElement], 'srcset', {
        get: (target, that) => {
            return client.element.getAttribute.call(that,   .attributePrefix + '-attr-srcset') || target.call(that);
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that,   .attributePrefix + '-attr-srcset', val)
            target.call(that,   .html.wrapSrcset(val));
        },
    });

    client.element.hookProperty(HTMLScriptElement, 'integrity', {
        get: (target, that) => {
            return client.element.getAttribute.call(that,   .attributePrefix + '-attr-integrity');
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that,   .attributePrefix + '-attr-integrity', val);
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'sandbox', {
        get: (target, that) => {
            return client.element.getAttribute.call(that,   .attributePrefix + '-attr-sandbox') || target.call(that);
        },
        set: (target, that, [val]) => {
            client.element.setAttribute.call(that,   .attributePrefix + '-attr-sandbox', val);
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'contentWindow', {
        get: (target, that) => {
            const win = target.call(that);
            try {
                if (!win.  )   Hook(win, config, bare);
                return win;
            } catch (e) {
                return win;
            };
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'contentDocument', {
        get: (target, that) => {
            const doc = target.call(that);
            try {
                const win = doc.defaultView
                if (!win.  )   Hook(win, config, bare);
                return doc;
            } catch (e) {
                return win;
            };
        },
    });

    client.element.hookProperty(HTMLIFrameElement, 'srcdoc', {
        get: (target, that) => {
            return client.element.getAttribute.call(that,   .attributePrefix + '-attr-srcdoc') || target.call(that);
        },
        set: (target, that, [val]) => {
            target.call(that,   .rewriteHtml(val, {
                document: true,
                injectHead:   .createHtmlInject(  .handlerScript,   .bundleScript,   .configScript,   .cookieStr, window.location.href)
            }))
        },
    });

    client.node.on('getTextContent', event => {
        if (event.that.tagName === 'SCRIPT') {
            event.data.value =   .js.source(event.data.value);
        };
    });

    client.node.on('setTextContent', event => {
        if (event.that.tagName === 'SCRIPT') {
            event.data.value =   .js.rewrite(event.data.value);
        };
    });

    // Until proper rewriting is implemented for service workers.
    // Not sure atm how to implement it with the already built in service worker
    if ('serviceWorker' in window.navigator) {
        delete window.Navigator.prototype.serviceWorker;
    };

    // Document
    client.document.on('getDomain', event => {
        event.data.value =   .domain;
    });
    client.document.on('setDomain', event => {
        if (!event.data.value.toString().endsWith(  .meta.url.hostname.split('.').slice(-2).join('.'))) return event.respondWith('');
        event.respondWith(  .domain = event.data.value);
    })

    client.document.on('url', event => {
        event.data.value =   .location.href;
    });

    client.document.on('documentURI', event => {
        event.data.value =   .location.href;
    });

    client.document.on('referrer', event => {
        event.data.value =   .referrer ||   .sourceUrl(event.data.value);
    });

    client.document.on('parseFromString', event => {
        if (event.data.type !== 'text/html') return false;
        event.data.string =   .rewriteHtml(event.data.string, { ...  .meta, document: true, });
    });

    // Attribute (node.attributes)
    client.attribute.on('getValue', event => {
        if (client.element.hasAttribute.call(event.that.ownerElement,   .attributePrefix + '-attr-' + event.data.name)) {
            event.data.value = client.element.getAttribute.call(event.that.ownerElement,   .attributePrefix + '-attr-' + event.data.name);
        };
    });

    client.attribute.on('setValue', event => {
        if (  .attrs.isUrl(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .rewriteUrl(event.data.value);
        };

        if (  .attrs.isStyle(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .rewriteCSS(event.data.value, { context: 'declarationList' });
        };

        if (  .attrs.isHtml(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .rewriteHtml(event.data.value, { ...  .meta, document: true, injectHead:   .createHtmlInject(  .handlerScript,   .bundleScript,   .configScript,   .cookieStr, window.location.href) });
        };

        if (  .attrs.isSrcset(event.data.name)) {
            client.element.setAttribute.call(event.that.ownerElement,   .attributePrefix + '-attr-' + event.data.name, event.data.value);
            event.data.value =   .html.wrapSrcset(event.data.value);
        };

    });

    // URL
    client.url.on('createObjectURL', event => {
        let url = event.target.call(event.that, event.data.object);
        if (url.startsWith('blob:' + location.origin)) {
            let newUrl = 'blob:' + (  .meta.url.href !== 'about:blank' ?   .meta.url.origin : window.parent.  .meta.url.origin) + url.slice('blob:'.length + location.origin.length);
              .blobUrls.set(newUrl, url);
            event.respondWith(newUrl);
        } else {
            event.respondWith(url);
        };
    });

    client.url.on('revokeObjectURL', event => {
        if (  .blobUrls.has(event.data.url)) {
            const old = event.data.url;
            event.data.url =   .blobUrls.get(event.data.url);
              .blobUrls.delete(old);
        };
    });

    client.storage.on('get', event => {
        event.data.name = methodPrefix +   .meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('set', event => {
        if (event.that.  $storageObj) {
            event.that.  $storageObj[event.data.name] = event.data.value;
        };
        event.data.name = methodPrefix +   .meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('delete', event => {
        if (event.that.  $storageObj) {
            delete event.that.  $storageObj[event.data.name];
        };
        event.data.name = methodPrefix +   .meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('getItem', event => {
        event.data.name = methodPrefix +   .meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('setItem', event => {
        if (event.that.  $storageObj) {
            event.that.  $storageObj[event.data.name] = event.data.value;
        };
        event.data.name = methodPrefix +   .meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('removeItem', event => {
        if (event.that.  $storageObj) {
            delete event.that.  $storageObj[event.data.name];
        };
        event.data.name = methodPrefix +   .meta.url.origin + '@' + event.data.name;
    });

    client.storage.on('clear', event => {
        if (event.that.  $storageObj) {
            for (const key of client.nativeMethods.keys.call(null, event.that.  $storageObj)) {
                delete event.that.  $storageObj[key];
                client.storage.removeItem.call(event.that, methodPrefix +   .meta.url.origin + '@' + key);
                event.respondWith();
            };
        };
    });

    client.storage.on('length', event => {
        if (event.that.  $storageObj) {
            event.respondWith(client.nativeMethods.keys.call(null, event.that.  $storageObj).length);
        };
    });

    client.storage.on('key', event => {
        if (event.that.  $storageObj) {
            event.respondWith(
                (client.nativeMethods.keys.call(null, event.that.  $storageObj)[event.data.index] || null)
            );
        };
    });

    client.websocket.on('websocket', async event => {
        let url;
        try {
            url = new URL(event.data.url);
        } catch (e) {
            return;
        };

        const headers = {
            Host: url.host,
            Origin:   .meta.url.origin,
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            Upgrade: 'websocket',
            'User-Agent': window.navigator.userAgent,
            'Connection': 'Upgrade',
        };

        const cookies =   .cookie.serialize(  .cookies, { url }, false);

        if (cookies) headers.Cookie = cookies;
        const protocols = [...event.data.protocols];

        const remote = {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port || (url.protocol === 'wss:' ? '443' : '80'),
            path: url.pathname + url.search,
        };

        if (protocols.length) headers['Sec-WebSocket-Protocol'] = protocols.join(', ');

        event.data.url = (  .bare.protocol === 'https:' ? 'wss://' : 'ws://') +   .bare.host +   .bare.pathname + 'v1/';
        event.data.protocols = [
            'bare',
              .encodeProtocol(JSON.stringify({
                remote,
                headers,
                forward_headers: [
                    'accept',
                    'accept-encoding',
                    'accept-language',
                    'sec-websocket-extensions',
                    'sec-websocket-key',
                    'sec-websocket-version',
                ],
            })),
        ];

        const ws = new event.target(event.data.url, event.data.protocols);

        client.nativeMethods.defineProperty(ws, methodPrefix + 'url', {
            enumerable: false,
            value: url.href,
        });

        event.respondWith(
            ws
        );
    });

    client.websocket.on('url', event => {
        if ('  $url' in event.that) {
            event.data.value = event.that.  $url;
        };
    });

    client.websocket.on('protocol', event => {
        if ('  $protocol' in event.that) {
            event.data.value = event.that.  $protocol;
        };
    });

    client.function.on('function', event => {
        event.data.script =   .rewriteJS(event.data.script);
    });

    client.function.on('toString', event => {
        if (  .methods.string in event.that) event.respondWith(event.that[  .methods.string]);
    });

    client.object.on('getOwnPropertyNames', event => {
        event.data.names = event.data.names.filter(element => !(  .filterKeys.includes(element)));
    });

    client.object.on('getOwnPropertyDescriptors', event => {
        for (const forbidden of   .filterKeys) {
            delete event.data.descriptors[forbidden];
        };

    });

    client.style.on('setProperty', event => {
        if (client.style.dashedUrlProps.includes(event.data.property)) {
            event.data.value =   .rewriteCSS(event.data.value, {
                context: 'value',
                ...  .meta
            })
        };
    });

    client.style.on('getPropertyValue', event => {
        if (client.style.dashedUrlProps.includes(event.data.property)) {
            event.respondWith(
                  .sourceCSS(
                    event.target.call(event.that, event.data.property),
                    {
                        context: 'value',
                        ...  .meta
                    }
                )
            );
        };
    });

    if ('CSS2Properties' in window) {
        for (const key of client.style.urlProps) {
            client.overrideDescriptor(window.CSS2Properties.prototype, key, {
                get: (target, that) => {
                    return   .sourceCSS(
                        target.call(that),
                        {
                            context: 'value',
                            ...  .meta
                        }
                    )
                },
                set: (target, that, val) => {
                    target.call(
                        that,
                          .rewriteCSS(val, {
                            context: 'value',
                            ...  .meta
                        })
                    );
                }
            });
        };
    } else if ('HTMLElement' in window) {

        client.overrideDescriptor(
            window.HTMLElement.prototype,
            'style',
            {
                get: (target, that) => {
                    const value = target.call(that);
                    if (!value[methodPrefix + 'modifiedStyle']) {

                        for (const key of client.style.urlProps) {
                            client.nativeMethods.defineProperty(value, key, {
                                enumerable: true,
                                configurable: true,
                                get() {
                                    const value = client.style.getPropertyValue.call(this, key) || '';
                                    return   .sourceCSS(
                                        value,
                                        {
                                            context: 'value',
                                            ...  .meta
                                        }
                                    )
                                },
                                set(val) {
                                    client.style.setProperty.call(this,
                                        (client.style.propToDashed[key] || key),
                                          .rewriteCSS(val, {
                                            context: 'value',
                                            ...  .meta
                                        })
                                    )
                                }
                            });
                            client.nativeMethods.defineProperty(value, methodPrefix + 'modifiedStyle', {
                                enumerable: false,
                                value: true
                            });
                        };
                    };
                    return value;
                }
            }
        );
    };

    client.style.on('setCssText', event => {
        event.data.value =   .rewriteCSS(event.data.value, {
            context: 'declarationList',
            ...  .meta
        });
    });

    client.style.on('getCssText', event => {
        event.data.value =   .sourceCSS(event.data.value, {
            context: 'declarationList',
            ...  .meta
        });
    });

    // Proper hash emulation.
    if (!!window.window) {
          .addEventListener.call(window, 'hashchange', event => {
            if (event.  $dispatched) return false;
            event.stopImmediatePropagation();
            const hash = window.location.hash;
            client.history.replaceState.call(window.history, '', '', event.oldURL);
              .location.hash = hash;
        });
    };

    client.location.on('hashchange', (oldUrl, newUrl, ctx) => {
        if (ctx.HashChangeEvent && client.history.replaceState) {
            client.history.replaceState.call(window.history, '', '',   .rewriteUrl(newUrl));

            const event = new ctx.HashChangeEvent('hashchange', { newURL: newUrl, oldURL: oldUrl });

            client.nativeMethods.defineProperty(event, methodPrefix + 'dispatched', {
                value: true,
                enumerable: false,
            });

              .dispatchEvent.call(window, event);
        };
    });

    // Hooking functions & descriptors
    client.fetch.overrideRequest();
    client.fetch.overrideUrl();
    client.xhr.overrideOpen();
    client.xhr.overrideResponseUrl();
    client.element.overrideHtml();
    client.element.overrideAttribute();
    client.element.overrideInsertAdjacentHTML();
    client.element.overrideAudio();
    // client.element.overrideQuerySelector();
    client.node.overrideBaseURI();
    client.node.overrideTextContent();
    client.attribute.overrideNameValue();
    client.document.overrideDomain();
    client.document.overrideURL();
    client.document.overrideDocumentURI();
    client.document.overrideWrite();
    client.document.overrideReferrer();
    client.document.overrideParseFromString();
    client.storage.overrideMethods();
    client.storage.overrideLength();
    //client.document.overrideQuerySelector();
    client.object.overrideGetPropertyNames();
    client.object.overrideGetOwnPropertyDescriptors();
    client.history.overridePushState();
    client.history.overrideReplaceState();
    client.eventSource.overrideConstruct();
    client.eventSource.overrideUrl();
    client.websocket.overrideWebSocket();
    client.websocket.overrideProtocol();
    client.websocket.overrideUrl();
    client.url.overrideObjectURL();
    client.document.overrideCookie();
    client.message.overridePostMessage();
    client.message.overrideMessageOrigin();
    client.message.overrideMessageData();
    client.workers.overrideWorker();
    client.workers.overrideAddModule();
    client.workers.overrideImportScripts();
    client.workers.overridePostMessage();
    client.style.overrideSetGetProperty();
    client.style.overrideCssText();
    client.navigator.overrideSendBeacon();
    client.function.overrideFunction();
    client.function.overrideToString();
    client.location.overrideWorkerLocation(
        (href) => {
            return new URL(  .sourceUrl(href));
        }
    );

    client.overrideDescriptor(window, 'localStorage', {
        get: (target, that) => {
            return (that || window).  .lsWrap;
        },
    });
    client.overrideDescriptor(window, 'sessionStorage', {
        get: (target, that) => {
            return (that || window).  .ssWrap;
        },
    });


    client.override(window, 'open', (target, that, args) => {
        if (!args.length) return target.apply(that, args);
        let [url] = args;

        url =   .rewriteUrl(url);

        return target.call(that, url);
    });

      .$wrap = function (name) {
        if (name === 'location') return   .methods.location;
        if (name === 'eval') return   .methods.eval;
        return name;
    };


      .$get = function (that) {
        if (that === window.location) return   .location;
        if (that === window.eval) return   .eval;
        if (that === window.parent) {
            return window.  $parent;
        };
        if (that === window.top) {
            return window.  $top;
        };
        return that;
    };

      .eval = client.wrap(window, 'eval', (target, that, args) => {
        if (!args.length || typeof args[0] !== 'string') return target.apply(that, args);
        let [script] = args;

        script =   .rewriteJS(script);
        return target.call(that, script);
    });

      .call = function (target, args, that) {
        return that ? target.apply(that, args) : target(...args);
    };

      .call$ = function (obj, prop, args = []) {
        return obj[prop].apply(obj, args);
    };

    client.nativeMethods.defineProperty(window.Object.prototype, master, {
        get: () => {
            return   ;
        },
        enumerable: false
    });

    client.nativeMethods.defineProperty(window.Object.prototype,   .methods.setSource, {
        value: function (source) {
            if (!client.nativeMethods.isExtensible(this)) return this;

            client.nativeMethods.defineProperty(this,   .methods.source, {
                value: source,
                writable: true,
                enumerable: false
            });

            return this;
        },
        enumerable: false,
    });

    client.nativeMethods.defineProperty(window.Object.prototype,   .methods.source, {
        value:   ,
        writable: true,
        enumerable: false
    });

    client.nativeMethods.defineProperty(window.Object.prototype,   .methods.location, {
        configurable: true,
        get() {
            return (this === window.document || this === window) ?   .location : this.location;
        },
        set(val) {
            if (this === window.document || this === window) {
                  .location.href = val;
            } else {
                this.location = val;
            };
        },
    });

    client.nativeMethods.defineProperty(window.Object.prototype,   .methods.parent, {
        configurable: true,
        get() {
            const val = this.parent;

            if (this === window) {
                try {
                    return '  ' in val ? val : this;
                } catch (e) {
                    return this;
                };
            };
            return val;
        },
        set(val) {
            this.parent = val;
        },
    });

    client.nativeMethods.defineProperty(window.Object.prototype,   .methods.top, {
        configurable: true,
        get() {
            const val = this.top;

            if (this === window) {
                if (val === this.parent) return this[  .methods.parent];
                try {
                    if (!('  ' in val)) {
                        let current = this;

                        while (current.parent !== val) {
                            current = current.parent
                        };

                        return '  ' in current ? current : this;

                    } else {
                        return val;
                    };
                } catch (e) {
                    return this;
                };
            };
            return val;
        },
        set(val) {
            this.top = val;
        },
    });


    client.nativeMethods.defineProperty(window.Object.prototype,   .methods.eval, {
        configurable: true,
        get() {
            return this === window ?   .eval : this.eval;
        },
        set(val) {
            this.eval = val;
        },
    });
};
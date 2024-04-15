console.log('exp index');

class _Page {
    static json = null;
    static scriptDefinition = null;
    static styleDefinition = null;
    static waitForLoadedScripts = {};
    static waitForLoadedStyles = {};
    static externalStyleCount = 0;
    static externalScriptCount = 0;
    static scriptPackages = [];
    static scriptPagkageIndex = 0;
    static resourceHandler = null;
    static Initialize(){
        _Ajax.get('index.json', _Page.Definition, _Page.DefinitionFallback);
    }

    static DefinitionFallback() {
        return {
            "scripts": [{
                "jquery": null,
                "bootstrap": null,
                "markdown-it": null,
                "markdown-it-emoji": null                
            },
            {
                "util": {
                    "src": "scripts/exp/util.js",
                    "disabled": false
                }
            }],
            "styles": [{
                "bootstrap": null,
                "index": {
                    "href": "styles/index.css",
                    "rel": "stylesheet"
                }
            }],
            "layout": [{
                "basic": {
                    "url": "scripts/layouts/basic.html"
                }
            }]
        }
    }
    static Definition(data){
        _Page.json = data;
        console.log('_Page.json', _Page.json);
        _Page.resourceHandler = new _ResourceHandler('page', _Page.json);
        _Page.LoadPage();        
    }

    static LoadPage(){
        _Page.resourceHandler.Load(_Page._onScriptsLoaded, _Page._onStylesLoaded);
    }

    static _onScriptsLoaded(){
        console.log('SCRIPT LOAD FIN');
        _Page.resourceHandler.LoadLayout(_Page._onLayoutLoaded);

    }
    static _onStylesLoaded(){
        console.log('STYLE LOAD FIN');        
    }
    static _onLayoutLoaded(){
        _Page.NavDiv().html('loaded');
    }
    static NavDiv(){
        return _Page.resourceHandler.DOM().Nav;
    }
    static HeaderDiv(){
        return _Page.resourceHandler.DOM().Header;
    }
    static ContentDiv(){
        return _Page.resourceHandler.DOM().Content;
    }
    static Root(){
        let r = new URL(window.location.href);
        console.log('root', r);
        if(r.origin === 'file://')
            return 'file:///C:/dev/icehalli/icehalli.github.io/docs/';
        return r.protocol + '//' + r.host + '/' + r.pathname.split('/')[1] + '/'
        // https://icehalli.github.io/docs/something/
    }

    static GetScript(key){
        let fixed = _Page.GetFixedScripts();
        let fixedKeys = Object.keys(fixed);
        if(fixedKeys.indexOf(key) > -1){
            return fixed[key];
        }
        return null;
    }
    static GetStyle(key){
        let fixed = _Page.GetFixedStyles();
        let fixedKeys = Object.keys(fixed);
        if(fixedKeys.indexOf(key) > -1){
            return fixed[key];
        }
        return null;
    }

    static GetFixedScripts() {
        return {
            "jquery": {
                "src": "https://code.jquery.com/jquery-3.7.1.min.js",
                "integrity": "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=",
                "crossorigin": "anonymous"
            },
            "bootstrap": {
                "src": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
                "integrity": "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz",
                "crossorigin": "anonymous"
            },
            "markdown-it": {
                "src": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js",
                "integrity": "sha512-ohlWmsCxOu0bph1om5eDL0jm/83eH09fvqLDhiEdiqfDeJbEvz4FSbeY0gLJSVJwQAp0laRhTXbUQG+ZUuifUQ==",
                "crossorigin": "anonymous",
                "referrerpolicy": "no-referrer"
            },
            "markdown-it-emoji": {
                "src": "https://cdnjs.cloudflare.com/ajax/libs/markdown-it-emoji/3.0.0/markdown-it-emoji.min.js",
                "integrity": "sha512-oEGO1WEAe1nZqI4pvhThiGh3IPUKfmelFhGR0PEOwv9kecA/dJ6FA67Qq8H6T+p/e4rh+lx2T3X7FnWVbYM1DA==",
                "crossorigin": "anonymous",
                "referrerpolicy": "no-referrer"
            }
        }
    }
    
    static GetFixedStyles() {
        return {
            "bootstrap": {
                "href": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
                "rel": "stylesheet",
                "integrity": "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH",
                "crossorigin": "anonymous"
            }
        }
    }

}

class _ResourceHandler {
    Name = '';
    Json = null;
    Scripts = [];
    ScriptPackageIndex = 0;
    Styles = [];
    StylePackageIndex = 0;
    Layout = [];
    LayoutPackageIndex = 0;

    Nodes = {};
    constructor(name, json) {
        this.Name = name;
        this.Json = json;
        this.Scripts = this.Json.scripts;
        this.Styles = this.Json.styles;
        this.Layout = this.Json.layout;
    }
    DOM() {
        let firstPack = this.Nodes[Object.keys(this.Nodes)[0]];
        return firstPack.Nodes[Object.keys(firstPack.Nodes)[0]];
    }
    Load(onScriptsLoaded, onStylesLoaded){
        //this.LoadLayout(onLayoutLoaded);
        this.LoadStyles(onStylesLoaded);
        this.LoadScripts(onScriptsLoaded);
    }
    LoadLayout(cb) {
        window.addEventListener("layoutPackageLoaded", (e) => {
            console.log('layoutPackageLoaded', this.LayoutPackageIndex);
            console.log(e.detail);            
            this.Nodes[e.detail.el.Name] = e.detail.el;
            //debugger;
            console.log('this.NodesP', this.Nodes, e.detail);
            this.LayoutPackageIndex++;
            if(this.Layout.length > this.LayoutPackageIndex){
                let pack = new _LayoutPackage('layoutpackage' + this.LayoutPackageIndex, this.Scripts[this.LayoutPackageIndex]);
                pack.Load();
            }
            else{
                console.log('all layoutPackageLoaded');
                cb();
            }
        });
        let pack = new _LayoutPackage('layoutpackage0', this.Layout[0]);
        pack.Load();
    }
    LoadScripts(cb) {
        window.addEventListener("scriptPackageLoaded", (e) => {
            this.ScriptPackageIndex++;            
            console.log('scriptPackageLoaded', e.detail.el);
            console.log('state', this.Scripts.length, this.ScriptPackageIndex);
            console.log('continue?', this.Scripts.length >= this.ScriptPackageIndex);
            if(this.Scripts.length > this.ScriptPackageIndex){
                console.log('next pack', this.Scripts, this.ScriptPackageIndex, this.Scripts[this.ScriptPackageIndex]);
                let pack = new _ScriptPackage('package' + this.ScriptPackageIndex, this.Scripts[this.ScriptPackageIndex]);
                pack.Load();
            }
            else{
                cb();
            }
        });
        let pack = new _ScriptPackage('package0', this.Scripts[0]);
        pack.Load();
    }
    LoadStyles(cb) {
        window.addEventListener("stylePackageLoaded", (e) => {
            this.StylePackageIndex++;            
            console.log('stylePackageLoaded', e.detail.el);
            console.log('state', this.Styles.length, this.StylePackageIndex);
            console.log('continue?', this.Styles.length >= this.StylePackageIndex);
            if(this.Styles.length > this.StylePackageIndex){
                console.log('next pack', this.Styles, this.StylePackageIndex, this.Styles[this.StylePackageIndex]);
                let pack = new _StylePackage('stylepackage' + this.StylePackageIndex, this.Styles[this.StylePackageIndex]);
                pack.Load();
            }
            else{
                cb();
            }
        });
        let pack = new _StylePackage('stylepackage0', this.Styles[0]);
        pack.Load();
    }
}

class _ScriptPackage {
    Name = '';
    Definitions = null;
    ScriptKeys = [];
    LoadingCount = 0;
    Scripts = [];
    constructor(name, definitions){
        this.Name = name;
        this.Definitions = definitions;
        this.ScriptKeys = Object.keys(this.Definitions);
        this.LoadingCount = this.ScriptKeys.length;
        console.log('_ScriptPackage', this.Definitions);
        this._process();
        this._events();
    }

    _events(){
        window.addEventListener("scriptLoaded", (e) => {
            this.LoadingCount--;
            if(this.LoadingCount === 0) {
                const event = new CustomEvent("scriptPackageLoaded", { detail: {success: true, el: this} });
                dispatchEvent(event);
            }
            var d = e.detail;
            console.log(d.success, d.el.Key, d.el.Dom);
        });
    }

    _process(){        
        for(var key of this.ScriptKeys) {
            this.Scripts.push(new _Script(key, this.Definitions[key]))
        } 
    }
    Load(){
        for(var el of this.Scripts) {
            el.Load();
        }
    }
}

class _LayoutPackage {
    Name = '';
    Definitions = null;
    ScriptKeys = [];
    LoadingCount = 0;
    Scripts = [];
    Nodes = {};
    constructor(name, definitions){
        this.Name = name;
        this.Definitions = definitions;
        this.ScriptKeys = Object.keys(this.Definitions);
        this.LoadingCount = this.ScriptKeys.length;
        console.log('_LayoutPackage', this.Definitions);
        this._process();
        this._events();
    }

    _events(){
        window.addEventListener("layoutLoaded", (e) => {
            console.log('layoutLoaded', this.LoadingCount);
            this.Nodes[e.detail.el.Key] = e.detail.el;
            //debugger;
            console.log('this.Nodes', this.Nodes, e.detail);
            this.LoadingCount--;
            if(this.LoadingCount === 0) {
                const event = new CustomEvent("layoutPackageLoaded", { detail: {success: true, el: this} });
                dispatchEvent(event);
            }
            var d = e.detail;
            console.log(d.success, d.el.Key, d.el.Dom);
        });
    }

    _process(){        
        for(var key of this.ScriptKeys) {
            this.Scripts.push(new _Layout(key, this.Definitions[key]))
        } 
    }
    Load(){
        for(var el of this.Scripts) {
            el.Load();
        }
    }
}

class _StylePackage {
    Name = '';
    Definitions = null;
    ScriptKeys = [];
    LoadingCount = 0;
    Scripts = [];
    constructor(name, definitions){
        this.Name = name;
        this.Definitions = definitions;
        this.ScriptKeys = Object.keys(this.Definitions);
        this.LoadingCount = this.ScriptKeys.length;
        console.log('_StylePackage', this.Definitions);
        this._process();
        this._events();
    }

    _events(){
        window.addEventListener("styleLoaded", (e) => {
            this.LoadingCount--;
            if(this.LoadingCount === 0) {
                const event = new CustomEvent("stylePackageLoaded", { detail: {success: true, el: this} });
                dispatchEvent(event);
            }
            var d = e.detail;
            console.log(d.success, d.el.Key, d.el.Dom);
        });
    }

    _process(){        
        for(var key of this.ScriptKeys) {
            this.Scripts.push(new _Style(key, this.Definitions[key]))
        } 
    }
    Load(){
        for(var el of this.Scripts) {
            el.Load();
        }
    }
}


class _Layout {
    Key = '';
    Definition = {};
    Dom = null;
    Elements = {};
    Nav = null;
    Header = null;
    Content = null;
    constructor(key, definition){
        this.Key = key; 
        // if(!definition)
        //     definition = _Page.GetScript(key);
        var root = _Page.Root();
        if(definition.url.indexOf('http') < 0) // local script, always local though
            definition.url = root + definition.url;
        this.Definition = definition;    
        console.log('_Layout', this.Definition);   
    }
    Load(){
        _Ajax.get(this.Definition.url, (data) => {
            console.log('Layout:get:data', data);
            this._Load(data);
        }, () => {
            return `<div id="nav">nav</div>
            <div id="header">header</div>
            <div id="content">content</div>`;
        });
    }
    _Load(data) {
        var layout = $('<div>');
        layout.html(data);
        var divs = layout.find("div[id]");
        console.log('divs', divs.length);
        divs.each((i, el) => {
            var element = $(el);
            console.log(element);
            $('body').append(element);
            var id = element.attr('id');
            this.Elements[id] = element;
            if(id==='nav')
                this.Nav = element;
            if(id==='header')
                this.Header = element;
            if(id==='content')
                this.Content = element;
        });
        console.log('Elements', this.Elements);
        console.log('Nav', this.Nav);
        console.log('Header', this.Header);
        console.log('Content', this.Content);
        // console.log('laytou load: ', $(data));
        // $('body').append(layout);
        // this._createDom();
        // document.body.appendChild(this.Dom);
        this._onLoad(true);

    }
    _createDom() {
        this.Dom = document.createElement("script");
        let scriptKeys = Object.keys(this.Definition);
        for(let k of scriptKeys){
            this.Dom.setAttribute(k, this.Definition[k]);
        }
        
        this.Dom.addEventListener("load", () => {
            this._onLoad(true);
        });
        
        this.Dom.addEventListener("error", (ev) => {
            this._onLoad(false);
        });
    }

    _onLoad(success){
        const event = new CustomEvent("layoutLoaded", { detail: {success: success, el: this} });
        dispatchEvent(event);
    }
}

class _Script {
    Key = '';
    Definition = {};
    Dom = null
    constructor(key, definition){
        this.Key = key; 
        if(!definition)
            definition = _Page.GetScript(key);
        var root = _Page.Root();
        if(definition.src.indexOf('http') < 0) // local script
            definition.src = root + definition.src;
        this.Definition = definition;    
        console.log('_Script', this.Definition);   
    }
    Load() {
        this._createDom();
        document.body.appendChild(this.Dom);
    }
    _createDom() {
        this.Dom = document.createElement("script");
        let scriptKeys = Object.keys(this.Definition);
        for(let k of scriptKeys){
            this.Dom.setAttribute(k, this.Definition[k]);
        }
        
        this.Dom.addEventListener("load", () => {
            this._onLoad(true);
        });
        
        this.Dom.addEventListener("error", (ev) => {
            this._onLoad(false);
        });
    }

    _onLoad(success){
        const event = new CustomEvent("scriptLoaded", { detail: {success: success, el: this} });
        dispatchEvent(event);
    }
}

class _Style {
    Key = '';
    Definition = {};
    Dom = null
    constructor(key, definition){
        this.Key = key; 
        if(!definition)
            definition = _Page.GetStyle(key);
        var root = _Page.Root();
        if(definition.href.indexOf('http') < 0) // local script
            definition.href = root + definition.href;
        this.Definition = definition;    
        console.log('_Script', this.Definition);   
    }
    Load() {
        this._createDom();
        document.head.appendChild(this.Dom);
    }
    _createDom() {
        this.Dom = document.createElement("link");
        let scriptKeys = Object.keys(this.Definition);
        for(let k of scriptKeys){
            this.Dom.setAttribute(k, this.Definition[k]);
        }
        
        this.Dom.addEventListener("load", () => {
            this._onLoad(true);
        });
        
        this.Dom.addEventListener("error", (ev) => {
            this._onLoad(false);
        });
    }

    _onLoad(success){
        const event = new CustomEvent("styleLoaded", { detail: {success: success, el: this} });
        dispatchEvent(event);
    }
}
class _Ajax {
    static getInFolder(url, cb) {
        if(_Config.isMock)
            this.get(url,cb);
        else
            this.get(_Config.folder + '/' + url);
    }
    
    static getAsync = async(url, fallbackData) => {
        // const response = await fetch(url);
        // console.log(response);
        let json;

        try {
            const response = await fetch(url);
            json = await response.json();
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Unexpected token < in JSON
                console.log('There was a SyntaxError', error);
            } else {
                console.log('There was an error', error);
            }
            if(fallbackData) {
                const data = fallbackData();
                console.log('Using fallback data', data);
                json = data;
            }
            else
                json = {fail:true, err};
        }

        if (json) {
            console.log('Valid response', json);
        }
        return json;
    }

    static getdd(url, cb, fallbackData) {
        console.log('_Ajax.get', url)
        fetch(url)
            .then((response) => response.json(), (err) => {
                console.error(`Getting ${url}`);
                if(fallbackData) {
                    const data = fallbackData();
                    console.log('Using fallback data', data);
                    cb(data);
                }
                else
                    cb({fail:true, err});
            })
            .then((json) => {
                cb(json);
            });
    }

    
    static get(url, cb, fallbackData) {
        console.log('_Ajax.get', url)
        fetch(url)
            .then((response) => response.text(),
            function(err) {
                console.error(`Getting ${url}`);
                if(fallbackData) {
                    const data = fallbackData();
                    console.log('Using fallback data', data);
                    return data;
                }
                else
                    return {fail:true, err};
            })
            .then(function (text) {  
                text = text.trim();                      
                if(text.indexOf('{') === 0 || text.indexOf('[') === 0)
                    return JSON.parse(text);
                else
                    return text;
                // do something with the text response 
            })
            .then((json) => {
                if(!cb) {
                    console.log('no cb', cb);
                }
                else
                    cb(json);
            });
    }

    static get4(url, cb, fallbackData) {
        fetch(url)
            .then(function(data){
                cb(data);
            }, function(err){
                console.error(`Getting ${url}`);
                if(fallbackData) {
                    const data = fallbackData();
                    console.log('Using fallback data', data);
                    cb(data);
                }
                else
                    cb({fail:true, err});
            });
    }
    static get2(url, cb) {
        $.get(url, function( data ) {
            if(cb)
                cb(data);
        });
    }

    static get3(url, cb) {
        $.ajax(url)
            .done(function(data) {
                cb(data);
            })
            .fail(function(err) {
                cb({fail:true, err});
            })
            .always(function() {
                //alert( "complete" );
            });
    }
}
_Page.Initialize();
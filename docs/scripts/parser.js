class _ParserRenderer {
    static includeWrapperid = false;
    static allPropsVisible = true;
    static ElementTag = 'div';
    static WrapperTag = 'div';
    static PropertyTag = 'div';
    static Render(parsedResult, divToGet) {
        this.renderHtml(parsedResult, 0, divToGet);
        this.CloseTags();
        this.AddCollapse();
        this.AddBorderEmphasis();
        this.AppendToolbar();    
    }
    static AppendToolbar(){
       var toolbar = _ParserHelpers.getElement('div', 'toolbar', null, '');
        $('body').prepend(toolbar);
        var toggleAll = _ParserHelpers.getElement('button', 'toggleAll', null, '');
        toggleAll.attr('type', 'button');
        toggleAll.html('Toggle');
        toggleAll.on('click', function(){
            _ParserRenderer.allPropsVisible = !_ParserRenderer.allPropsVisible;
            _ParserRenderer.ToggleAllProps(_ParserRenderer.allPropsVisible);
        });
        toolbar.append(toggleAll);
    }
    static renderHtml(item, indent=0, parent){
        var parent = this.AppendPre(item, parent);
        if(item.children) {
            for(var ch of item.children){
                this.renderHtml(ch, indent + 4, parent);
            }
        }
        else if(item.rest){
            if(parent !== 'body')
                this.AppendPre(item.rest, parent);
        }
    }

    static AddBorderEmphasis(){
        $('.domdiv').each((i, el) => {
            var parents = $(el).parents('div').length + 1;
            console.log(parents);
            $(el).css({borderWidth: parents + 'px'});
        });
    }

    static ToggleProps($this, force){      
        //debugger  
        var closed = $this.data('closed');        
        if(typeof force !== 'undefined') {
            closed = force ? 0 : 1;
        }
        var propChildren = $this.parent().parent().children('.proppre');   
        var textSiblings = $this.siblings('.jsontext');     
        propChildren.css({display: closed ? 'none' : 'block'});
        textSiblings.css({display: closed ? 'none' : 'block'});
        $this.data('closed', closed === 0 ? 1 : 0);
    }

    static ToggleAllProps(show = true){
        $('.element').each((i, el) => {
            _ParserRenderer.ToggleProps($(el), show)
        });

    }

    static AddCollapse(){
        $('.element').attr('data-closed', 1);
        $('.element').on('click', function () {
            _ParserRenderer.ToggleProps($(this));
        });
    }
    
    static CloseTags(){
        var elements = $('.element')
        elements.each((i, el) => {
            var j = $(el);
            var text = j.html();
            //debugger
            text = text.replace('&lt;', '&lt;/').replace('&#60;', '&#60;/');            
            //var htmlEncoded = _ParserHelpers.encodeHtml(text);
            var domElement = _ParserHelpers.getElement(_ParserRenderer.ElementTag, 'element', null, 'element');
            domElement.append(text);
            j.parent().parent().append(domElement);
        });
    }

    static getParentElement(parent) {
        if(!parent)
            return $('body');
            
        var parentEl =  $(parent);
        if(parentEl.length === 0){
            debugger
        }
        return parentEl;        
    }

    static AppendHtml(parentEl, object, content) {
        var domWrapper = _ParserHelpers.getElement(_ParserRenderer.WrapperTag, 'wrapper', null, 'wrapper');
        var domDiv = _ParserHelpers.getElement('div', 'domdiv', null, 'domDiv');

        if(content === '<body>')
            content = '';
            
        if(object.start) {
            var htmlEncoded = _ParserHelpers.encodeHtml(object.start);
            var domElement = _ParserHelpers.getElement(_ParserRenderer.ElementTag, 'element', null, 'element');
            domElement.append(htmlEncoded);
            domWrapper.html(domElement);
        }
        else
            domWrapper.html(_ParserHelpers.encodeHtml(content));
        if(this.includeWrapperid)
            domWrapper.append(`<span class="sp">(${domDiv.attr('id')})</span>`)
        domDiv.append(domWrapper);
        parentEl.append(domDiv);
        if(object.parsed){
            var proppre = _ParserHelpers.getElement(_ParserRenderer.PropertyTag, 'proppre', null, 'proppre');
            domDiv.append(proppre);
            var parsedKeys = Object.keys(object.parsed);
            
            if(parsedKeys.length > 0){
                for(var p of parsedKeys){
                    var it = object.parsed[p];
                    var prop = _ParserHelpers.getElement('div', null, null, 'prop');
                    var jsonprop = '';
                    if(it.indexOf('_json.') > -1){
                        jsonprop = it;
                        it = '';
                    }
                    prop.html(p+"="+it);
                    if(jsonprop){
                        var domDivLeaf = _ParserHelpers.getElement('span', 'jsontext', null, 'proppre');
                        domDivLeaf.html(jsonprop);
                        prop.append(domDivLeaf);
                    }
                    if(this.includeWrapperid)
                        prop.append(`<span class="sp">(${prop.attr('id')})</span>`)
                    proppre.append(prop);
                }
            }
        }
        return domDiv;
    }

    static AppendJson(parentEl, content) {      
        this.AppendText(parentEl, JSON.stringify(content, null, 2));
    }

    static AppendText(parentEl, content) {
        var domDivLeaf = _ParserHelpers.getElement('div', 'jsontext', null, 'proppre');
        domDivLeaf.append('TEXT:' + content);
        parentEl.append(domDivLeaf);
    }
    
    static LastDomDiv = null;
    static AppendPre(object, parent){
        var parentEl = this.getParentElement(parent);

        var content = object;
        if(typeof object === 'object')        
            content = object.el;
            
        var domDiv = null;
        if(_ParserHelpers.StringIsHtml(content)){
            domDiv = this.AppendHtml(parentEl, object, content);
            this.LastDomDiv = domDiv;
            return domDiv;
        }
        else if(_ParserHelpers.StringIsJson(content)){
            this.AppendJson(parentEl, content);
        }
        else{  
            // console.log('this.LastDomDiv.children', this.LastDomDiv.children()[0]);
            // console.log('content', content);
            this.AppendText($(this.LastDomDiv.children()[0]), content);
        }
        return parentEl;
    }
}

class _Parser {    
    static ids = [];
    static parsedResult = null;
    static divToGet = null;

    static ParseAndRender(divToGet) {
        this.Parse(divToGet);
        _ParserRenderer.Render(this.parsedResult, this.divToGet);
    }
    static Parse(divToGet){
        this.divToGet = divToGet;
        var layout = $(divToGet);
        var stuff = layout.html();
        $(divToGet).empty();
        stuff = _ParserHelpers.removeScript(stuff);
        this.parsedResult = this.parseHtml(stuff);
    }

    static getElementHtml(element){
        var inner = element.html();
        element.empty();
        var div2 = $('<div>');
        div2.html(element);
        var t = div2.html();
        var parsedEl = this.parseDomEl(t);
        var start = _ParserHelpers.getDomStart(t);
        return {start: start, el: t, parsed: parsedEl, rest: inner};

    }

    static parseResultJson(item){
        if(item.rest){
            var children = _ParserHelpers.getChildren(item.rest);
            if(children.length > 0){
                children.each((i, el) => {
                    var j = this.getElementHtml($(el));
                    if(!item.children)
                        item.children = [];
                    item.children.push(j);
                    delete item.rest;
                });
            }
        } 
        if(item.children){
            for(var ch=0;ch<item.children.length;ch++)
            {
                this.parseResultJson(item.children[ch]);
            }
        }
    }
    static parseDomEl(el){
        var result = {};
        var $el = $(el);
        result = _ParserHelpers.getAttributes($(el));
        return result;
    };

    static parseHtml(text){
        var result = [];
        result.push({el: '<body>', rest:text});
        this.parseResultJson(result[0]);
        return result[0];
    }
}

class _ParserHelpers {
    static getElement(tag, classes, id, idPrefix){
        var el = $(`<${tag}>`);
        if(!id)
            id = (idPrefix ? idPrefix : '') + _ParserHelpers.getRandomInt(1, 1000);
        if(classes)
            el.addClass(classes);
        el.attr('id', id);
        return el;
    }
    static encodeHtml(html){        
        var encodedStr = html.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
        return encodedStr
    }
    static removeScript(text){
        var idx = text.split('<script');
        return idx[0].trim();
    }
    
    static StringIsHtml(str){
        if(!str){
            //debugger;
            return str;
        }
        return str.trim().indexOf('<') > -1;
    }
    static StringIsJson(str){
        return str.trim().indexOf('{') > -1 || str.trim().indexOf('[]') > -1;
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static getDomStart(t){
        var start = t.split(' ')[0];
        start = start + '>';
        if(start.indexOf('>>') > -1){
            start = start.split('>')[0];
            start = start + '>';
        }
        return start;
    }
    static getAttributes ( $node ) {
        var attrs = {};
        $.each( $node[0].attributes, function ( index, attribute ) {
            attrs[attribute.name] = attribute.value;
        } );
        return attrs;
    }
    
    static getChildren(html){//move to helper
        var div = $('<div>');
        div.html(html);
        return div.children();
    }
}
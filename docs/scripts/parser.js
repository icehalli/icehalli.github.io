class _ParserRenderer {
    static includeWrapperid = true;
    static Render(parsedResult, divToGet) {
        this.renderHtml(parsedResult, 0, divToGet);
    }
    static renderHtml(item, indent=0, parent){
        var parent = this.AppendPre(item,indent+4, parent);
        if(item.children) {
            for(var ch of item.children){
                this.renderHtml(ch, indent + 4, parent);
            }
        }
        else if(item.rest){
            if(parent !== 'body')
                this.AppendPre(item.rest,indent, parent);
        }
    }
    
    static AppendPre(object, indent=0, parent){  
        console.log(object, parent);
        var parentEl = null;
        var content = object;
        if(typeof object === 'object')        
            content = object.el;
            
        var pre = _ParserHelpers.getElement('div', 'wrapper', null, 'wrapper');
        if(!parent){
            parentEl = $('body');
        } else {
            parentEl =  $(parent);
            if(parentEl.length === 0){
                debugger
            }

        }
        var domDiv = null;
        if(_ParserHelpers.StringIsHtml(content)){
            if(content === '<body>')
                content = '';
            domDiv = _ParserHelpers.getElement('div', 'domDiv', null, 'domDiv');
            if(indent > 0) {
                domDiv.css({marginLeft: '40px'});
            }
            if(object.start)
                pre.html(_ParserHelpers.encodeHtml(object.start));
            else
                pre.html(_ParserHelpers.encodeHtml(content));
            if(this.includeWrapperid)
                pre.append(`<span class="sp">(${domDiv.attr('id')})</span>`)
            domDiv.append(pre);
            parentEl.append(domDiv);
            if(object.parsed){
                var proppre = _ParserHelpers.getElement('div', 'proppre', null, 'proppre');
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
        }
        else if(_ParserHelpers.StringIsJson(content)){
            pre.html(JSON.stringify(content, null, 2));
            parentEl.append(pre);
        }
        else{  
            var domDivLeaf = $('<span>')
            var proppreId = 'proppre'+_ParserHelpers.getRandomInt(1, 1000);
            domDivLeaf.attr('id', proppreId);
            domDivLeaf.addClass('jsontext');
            domDivLeaf.append(content);
            parentEl.append(domDivLeaf);
        }
        return domDiv && domDiv.length > 0 ? '#'+ domDiv.attr('id') : '#'+ parentEl.attr('id'); // '#'+ pre.attr('id');
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
            debugger;
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
        return t.split(' ')[0] + '>';
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
class _ParserRenderer {
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
        var pre = $('<div>');
        var wrapperid = 'wrapper'+_ParserHelpers.getRandomInt(1, 1000);
        pre.attr('id', wrapperid);
        pre.addClass('wrapper');
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
            domDiv = $('<div>');
            var domdivId = 'domDiv'+_ParserHelpers.getRandomInt(1, 1000);
            domDiv.attr('id', domdivId);
            if(indent > 0) {
                domDiv.css({marginLeft: '40px'});
            }
            domDiv.addClass('domdiv');
            if(object.start)
                pre.html(_ParserHelpers.encodeHtml(object.start));
            else
                pre.html(_ParserHelpers.encodeHtml(content));
            if(this.includeWrapperid)
                pre.append(`<span class="sp">(${domdivId})</span>`)
            domDiv.append(pre);
            parentEl.append(domDiv);
            if(object.parsed){
                var proppre = $('<div>')
                var proppreId = 'proppre'+_ParserHelpers.getRandomInt(1, 1000);
                proppre.addClass('proppre')
                proppre.attr('id', proppreId);
                domDiv.append(proppre);
                var parsedKeys = Object.keys(object.parsed);
                
                if(parsedKeys.length > 0){
                    for(var p of parsedKeys){
                        var it = object.parsed[p];
                        var prop = $('<div>');
                        var propId = 'prop'+_ParserHelpers.getRandomInt(1, 1000);
                        prop.attr('id', propId);
                        var jsonprop = '';
                        if(it.indexOf('_json.') > -1){
                            jsonprop = it;
                            it = '';
                        }
                        prop.html(p+"="+it);
                        if(jsonprop){
                            var domDivLeaf = $('<span>')
                            var proppreId = 'proppre'+_ParserHelpers.getRandomInt(1, 1000);
                            domDivLeaf.attr('id', proppreId);
                            domDivLeaf.addClass('jsontext');
                            domDivLeaf.html(jsonprop);
                            prop.append(domDivLeaf);
                        }
                        if(this.includeWrapperid)
                            prop.append(`<span class="sp">(${propId})</span>`)
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
    static includeWrapperid = true;
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

    static parseResultJson(item){
        if(item.rest){
            var div = $('<div>');
            div.html(item.rest);
            var children = div.children();
            if(children.length > 0){
                children.each((i, el) => {
                    var element = $(el);
                    console.log(element.html());
                    var inner = element.html();
                    element.empty();
                    var div2 = $('<div>');
                    div2.html(element);
                    var t = div2.html();
                    if(!item.children)
                        item.children = [];
                    var parsedEl = this.parseDomEl(t);
                    var start = _ParserHelpers.getDomStart(t);
                    item.children.push({start: start, el: t, parsed: parsedEl, rest: inner});
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
        
        console.log('result',result);
        return result[0];
    }
}

class _ParserHelpers {
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
}
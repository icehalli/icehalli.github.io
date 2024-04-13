console.log('index.js');
class _Global {
    static initialize() {
        _Config.urlDetection(window.location.href);//https://icehalli.github.io/docs/plans/
        document.title = _Config.title;
    }
}

class _Config {
    static url = null;
    static isMock = false;
    static title = '';
    static folder = '';

    static urlDetection(url) {
        //debugger;
        _Config.url = new URL(url);
        _Config.isMock = _Config.url.origin === 'file://';
        _Config.title = _Url.last(_Config.url);
        _Config.title = _Utils.upperCaseFirst(_Config.title);
        let last = _Config.url.pathname.split('/');
        last = last[last.length-1];
        _Config.folder = this.getPart(_Config.url.pathname, 'docs/', '/' + last);
    }
    static getPart(str, a, b) {
        var mySubString = str.substring(
            str.indexOf(a) + a.length, 
            str.lastIndexOf(b)
        );
        return mySubString;
    }
}

class _Url_Tests {
    static success = true;
    static test() {
        const file_root = "file:///C:/dev/icehalli/icehalli.github.io/docs/index.html";
        _Config.urlDetection(file_root);
        if(_Config.folder !== '/') {
            success = false;
            console.error(file_root, 'folder fail');
        }

        console.info('TEST SUCCESSFUL:', this.success)
    }
}

class _Url {
    static last(uriObject) {
        const parts = uriObject.pathname.split('/');
        const last = parts[parts.length -1];
        if(last === '' || last === 'index.html')
            return parts[parts.length - 2] + ' - index'; //folder        
        const res = last.split('.')[0];
        return res;     
    }
}

class _Utils {
    static upperCaseFirst(str) {        
        return str.charAt(0).toUpperCase() + str.slice(1);

    }
}

class _Page {
    static getLoading(text, wrapDiv = true) {
        let res = `Loading ${text} <i class="fa-solid fa-spinner fa-spin"></i>`
        if(wrapDiv) {
            return `<div>${res}</div>`;
        }
        return res;
    }
    static getBreadCrumbs(data) {
        return [
            {
                "label": 'a',
            },
            {
                "label": 'b',
                "active": true
            }
        ];
    }
    static setup(){
        var nav = $(_Page.getLoading('nav')).attr('id', 'nav');
        var breadcrumbs = $(_Page.getLoading('breadcrumbs')).attr('id', 'breadcrumbs');
        var header = $(_Page.getLoading('header')).attr('id', 'header');
        var content = $(_Page.getLoading('content')).attr('id', 'content');
        $('body').append(nav);
        // $('body').append(breadcrumbs);
        $('body').append(header);
        $('body').append(content);
        // setTimeout(function(){

        _Ajax.get("index.json", function( data ) {
            console.log('_Ajax.get:index.json', data);
            let headerHtml = '';
            let navHtml = '';
            let breadcrumbsHtml = '';
            breadcrumbsHtml = _Nav.getBreadCrumbs(_Page.getBreadCrumbs(data));
            if(typeof data === 'object') {
                headerHtml = _Nav.getHeader(data);
                navHtml = _Nav.get(data);
                //breadcrumbsHtml = _Page.getBreadCrumbs(data);
            } 
            else {
                headerHtml = 'No header data';
                navHtml = 'No nav data';
                //breadcrumbsHtml = 'No breadcrumbs data';
            }
            $('#header').html(headerHtml);
            $('#nav').html(navHtml); 
            // $('#breadcrumbs').html(breadcrumbsHtml); 
        });
        _Ajax.get('index.md', function(d){
            console.log('_Ajax.get:index.md', d);
          const result = _Md.render(d);
          $('#content').html(result);
          $('table').addClass('table').addClass('table-striped');
          $('.md-file').on('click', function(){
            var url = $(this).attr('data-url');
            _Ajax.get(url, function(d){
              const result = _Md.render(d);
              $('#content').html(result);
            });
          });
        });
        
    //}, 3000);

    }
}

_Global.initialize();
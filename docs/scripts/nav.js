class _Nav {
    static getHeader(obj) {
      return `<h1>${obj.header}</h1>`;
    }
    
    static getLis(obj) {
      console.log('getlis', obj);
      var res = '';
      for(var o of obj) {
        console.log('getlis:o', o);
        let url = o.url;
        if(url.indexOf('.md') > -1){
          url = "#";
          classname = " md-file";
        }
        res += `        
        <li class="nav-item">
          <a class="nav-link active ${classname}" data-url="${o.url}" aria-current="page" href="${url}">${o.label}</a>
        </li>
        `;
      }
      return res;
    }
    static get(obj) {
      console.log('get');
        return `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        ${this.getLis(obj.lis)}
      </ul>
    </div>
  </div>
</nav>`;
    }
}


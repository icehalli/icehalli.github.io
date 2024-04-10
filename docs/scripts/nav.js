class _Nav {
    static getHeader(obj) {
      return `<h1>${obj.header}</h1>`;
    }

    static getLis(obj) {
      var res = '';
      for(var o of obj) {
        let url = o.url;
        let classname = '';
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
        return `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="https://icehalli.github.io/docs">Home</a>
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


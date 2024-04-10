class _Nav {
    static a(o) {
        const a = new _Template('a');
        a.classes('nav-link active');
        a.addProp(`aria-current="page"`);
        return li.getJQ();
    }

    static navbar() {
        const navbar = new _Template('nav');
        navbar.id('navbar');
        navbar.classes('navbar navbar-expand-lg navbar-light bg-light');
        return navbar;
    }

    static li(o){        
        const li = new _Template('li');
        li.classes('nav-item');
        return li.getJQ();

        return `
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="${o.href}">${o.label}</a>
        </li>`;
    }
    static getLis(obj) {
      console.log('getlis', obj);
      var res = '';
      for(var o of obj) {
        console.log('getlis:o', o);
        res += `        
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="${o.url}">${o.label}</a>
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


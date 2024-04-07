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
    static get() {
        return `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li>
      </ul>
    </div>
  </div>
</nav>`;
    }
}


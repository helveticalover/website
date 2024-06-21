const template = document.createElement('template');
template.innerHTML = 
`<style>
.header {
    margin: 0;
    padding: 25.5px;
    display: flex;
    flex-direction: column;
    z-index: 2;
    background-color: var(--website-background-color);
    transition: top .25s ease-in-out;
}
.title {
    display: flex;
    align-items: center;
    justify-content: center;
}
.mobile-expand {
    display: none;
}
.mobile-expand-lbl {
    display: none;
    cursor: pointer;
    transition: all 0.25s ease-out;
}
.mobile-expand-lbl:hover {
    color: var(--background-color-major);
}
#mobile-expand-content {
    max-height: auto;
    overflow: hidden;
    transition: max-height .25s ease-in-out;
}
.mobile-expand:checked ~ #mobile-expand-content {
    max-height: 100vh;
}
.menu-icon {
    display: inline-flex;
    height: 32px;
    width: auto;
    margin: auto;
    align-items: center;
}
.menu-icon > * {
    height: 100%;
    width: auto !important;
    max-width: 100%;
    max-height: 100%;
}
nav {
    margin: 10px 0px 20px 0px;
}
nav ul {
    padding: 0px;
    margin: 0px;
}
nav li {
    display: inline;
}
nav a {
    display: inline-block;
    margin: 4px 2px;
}
nav .button {
    padding: 6px 18px;
}

@media only screen and (max-width: 768px) {
    .header {
        position: fixed;
        width: 100%;
        padding: 0px;
        top: 0px;
    }
    .banner {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px 20px;
    }
    nav {
        margin: 0px;
    }
    nav a {
        margin: 4px 0px;
    }
    nav ul {
        margin: 0px 0px 10px 0px;
    }
    nav .button {
        border-radius: 0px;
    }
    .nav li {
        display: inline-block;
        width: 100%;
    }
    .mobile-expand-lbl {
        display: block;
        top: 2px;
        position: relative;
        float: right;
    }
    #mobile-expand-content {
        max-height: 0px;
    }
    .nav a {
        width: 100%;
    }
}
</style>
<div class="header" id="navbar">
    <nav class="center">
      <input id="id_nav-collapsible" class="mobile-expand" type="checkbox">
      <div class="banner">
        <a href="{{ '/projects' | url }}"><div class="title">
            <slot name="title">
                Title
            </slot>
        </div></a>
        <div style="width: 100%;">
          <label for="id_nav-collapsible" class="mobile-expand-lbl" data-target="id_nav">
            <slot name="nav-icon" class="menu-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="48" width="48" viewBox="0 0 48 48"><path d="M6 36v-3h36v3Zm0-10.5v-3h36v3ZM6 15v-3h36v3Z"/></svg>
            </slot>
          </label>
        </div>
      </div>
      <div id="mobile-expand-content">
        <ul class="nav" id="id_nav">
        </ul>
      </div>
    </nav>
</div>`

class CollapsibleNavComponent extends HTMLElement {
    constructor() {
        super();

        this._onScroll = this._onScroll.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        Promise.all([
            customElements.whenDefined('collapsible-nav-li'),
          ])
            .then(_ => this._populateNav());
    }

    connectedCallback() {
        this._prevScrollPosition = window.scrollY;

        window.addEventListener("scroll", this._onScroll);
    }

    disconnectedCallback() {
        window.removeEventListener("scroll", this._onScroll);
    }

    _populateNav() {
        let lis = Array.from(this.querySelectorAll('collapsible-nav-li'));
        
    }

    _onScroll() {
        let diff = window.scrollY - prevScrollPos;
        if (diff < -5 || window.scrollY < 44) {
        // TODO: need to not hardcode this!!!
          document.getElementById("navbar").style.top = "0px";
        } else if (diff > 0) {
          document.getElementById("navbar").style.top = "-44px";
          document.getElementById("id_nav-collapsible").checked = false;
        }
        prevScrollPos = window.pageYOffset;
    }
}

customElements.define("collapsible-nav", CollapsibleNav);

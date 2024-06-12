const template = document.createElement('template');
template.innerHTML = 
`<style>
.modal {
    z-index: 999;
    position: fixed;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    transition: opacity 0.2s;
}

.modal.hidden {
    visibility: hidden;
    opacity: 0;
}

.modal.displayed {
    visibility: visible;
    opacity: 1;
}

.modal .modal-background {
    position: relative;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.9);
    width: 100%;
    height: 100%;
    overflow: auto;
}

.modal .modal-content {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.modal .modal-img {
    max-width: calc(100vw - var(--modal-padding));
    max-height: calc(100vh - 1em - var(--modal-padding));
}

.modal .modal-caption {
    position: block;
    margin: auto;
    display: block;
    width: 80%;
    max-width: 700px;
    color: #ccc;
    padding: 5px 0;
}

.modal .modal-close {
    position: fixed;
    float: right;
    top: -5px;
    right: 15px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    transition: 0.2s;
    z-index: 1;
}

.modal .modal-close:hover,
.modal .modal-close:focus {
    color: #bbb;
    text-decoration: none;
    cursor: pointer;
}
</style>
<div class="modal hidden">
    <div class="modal-close">
    <slot name="exit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48" viewBox="0 0 48 48">
            <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"/>
        </svg>
    </slot>
    </div>
    <div class="modal-background">
        <div class="modal-content">
            <img class="modal-img">
            <span class="modal-caption">default caption</span>
        </div>
    </div>
</div>`

class ModalComponent extends HTMLElement {
    constructor() {
        super();

        this._onClick = this._onClick.bind(this);
        this._showImageOnLoad = this._showImageOnLoad.bind(this);

        const shadow = this.attachShadow({mode: 'open'});
        shadow.appendChild(template.content.cloneNode(true));

        this._openImageModal = {};

        this._modal = shadow.querySelector(".modal");
        this._background = shadow.querySelector(".modal-background");
        this._exit = shadow.querySelector(".modal-close");
        this._modalImg = shadow.querySelector(".modal-img");
        this._captionText = shadow.querySelector(".modal-caption");
    }

    connectedCallback() {
        this._background.addEventListener('click', this._onClick);
        this._exit.addEventListener('click', this._onClick);
        this._modalImg.addEventListener('load', this._showImageOnLoad);

        let images = document.querySelectorAll(`[data-modaltarget="${this.id}"]`);
        for (let image of images)
        {
            if (image.href == "")
            {
                this._openImageModal[image] = (event) => this._openModal(image.dataset.modalsrc, image.dataset.modalalt);
                this._openImageModal[image] =  this._openImageModal[image].bind(this);
                image.addEventListener('click', this._openImageModal[image]);
            }
        }
    }

    disconnectedCallback() {
        this._background.removeEventListener('click', this._onClick);
        this._exit.removeEventListener('click', this._onClick);
        this._modalImg.removeEventListener('load', this._showImageOnLoad);

        let images = document.querySelector(`[data-modalTarget=${this.id}]`);
        for (let image of images)
        {
            if (image.href == "")
            {
                image.removeEventListener('click', this._openImageModal[image]);
            }
        }
        this._openImageModal = {}
    }

    _openModal(modalSrc, modalAlt) {
        this._modalImg.src = modalSrc;
        this._captionText.innerHTML = modalAlt;
    }

    _showImageOnLoad(event) {
        this._modal.classList.remove("hidden");
        this._modal.classList.add("displayed");
    }

    _onClick(event) {
        this._modal.classList.remove("displayed");
        this._modal.classList.add("hidden");
    }
}

customElements.define("popup-modal", ModalComponent);
class Modal {
    #modals;
    constructor() {
        if (document.readyState === "complete")
        {
            this.#initModals();
        }
        document.addEventListener('DOMContentLoaded', () => this.#initModals());
    }

    #initModals()
    {
        this.#modals = document.getElementsByClassName("modal");

        for (let modal of this.#modals)
        {
            this.#setUpModalEvents(modal);
        }

        this.#targetImagesToModal();
    }

    #setUpModalEvents(modal)
    {
        let background = modal.querySelector(".modal-background");
        
        let span = modal.querySelector(".modal-close");
        span.onclick = function() {
            modal.classList.remove("displayed");
            modal.classList.add("hidden");
        }
        
        background.onclick = span.onclick;
    }

    #targetImagesToModal()
    {
        let images = document.getElementsByClassName("modal-image");
        for (let image of images)
        {
            image.onclick = () => this.openModal(image.dataset.modaltarget, image.dataset.modalsrc, image.dataset.modalalt);
            image.ontouchend = () => this.openModal(image.dataset.modaltarget, image.dataset.modalsrc, image.dataset.modalalt);
        }
    }

    openModal(modalId, modalSrc, modalAlt)
    {
        let modal = this.#modals[0];
        if (modalId)
        {
            modal = document.getElementById(modalId);
        }
    
        const modalImg = modal.querySelector(".modal-img");
        const captionText = modal.querySelector(".modal-caption");

        modalImg.src = modalSrc;
        captionText.innerHTML = modalAlt;
        modalImg.onload = function () {
            modal.classList.remove("hidden");
            modal.classList.add("displayed");
        }
    }
}
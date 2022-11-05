// Get the modal
var modal = document.getElementById("myModal");
var background = modal.querySelector(".background");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function showInModal(src, alt) {
    modalImg.src = src;
    captionText.innerHTML = alt;
    modalImg.onload = function () {
        modal.classList.remove("hidden");
        modal.classList.add("displayed");
    }
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.classList.remove("displayed");
    modal.classList.add("hidden");
}

background.onclick = span.onclick;

modalImg.onclick = function(e) {
    e.stopPropagation();
}
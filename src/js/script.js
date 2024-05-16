document.addEventListener('DOMContentLoaded', function() {
  const vagaButtons = document.querySelectorAll('.vaga');
  const infoCard = document.getElementById('info-card');

  vagaButtons.forEach(button => {
      button.addEventListener('click', function() {
          infoCard.classList.toggle('visible');
      });
  });
});

// Obtém o modal
var popup = document.getElementById("myPopup");

// Obtém o botão que abre o modal
var btn = document.getElementById("openPopupBtn");

// Obtém o elemento <span> que fecha o modal
var span = document.getElementById("closePopupBtn");

// Quando o usuário clica no botão, abre o modal
btn.onclick = function() {
    popup.style.display = "block";
}

// Quando o usuário clica no <span> (x), fecha o modal
span.onclick = function() {
    popup.style.display = "none";
}

// Quando o usuário clica em qualquer lugar fora do modal, fecha o modal
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}
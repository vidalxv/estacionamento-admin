document.addEventListener('DOMContentLoaded', function() {
  const vagaButtons = document.querySelectorAll('.vaga');
  const infoCard = document.getElementById('info-card');

  vagaButtons.forEach(button => {
      button.addEventListener('click', function() {
          infoCard.classList.toggle('visible');
      });
  });
});

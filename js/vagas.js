import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js';

const database = getDatabase();
const vagasRef = ref(database, 'vagas');

onValue(vagasRef, (snapshot) => {
    const vagas = snapshot.val();
    console.log(vagas);

    if (vagas) {
        Object.keys(vagas).forEach((vagaKey) => {
            const vagaData = vagas[vagaKey];
            const button = document.querySelector(`[data-vaga="${vagaKey}"]`);
            if (button) {
                if (vagaData.ocupada) {
                    button.classList.add('ocupada');
                    // Cria uma imagem
                    const img = document.createElement('img');
                    img.src = 'assets/carro_branco.png'; 
                    img.width = '60'; 
                    img.alt = 'Carro'; 
                    img.style.transform = 'rotate(90deg)';
                    
                    button.innerHTML = '';
                    button.appendChild(img);
                } else {
                    button.classList.remove('ocupada');
                    button.innerHTML = ''; 
                }
            }
        });
    }
});

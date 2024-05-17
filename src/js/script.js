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

document.addEventListener('DOMContentLoaded', () => {
    const vagaButtons = document.querySelectorAll('.vaga');
    const popup = document.getElementById('info-card');
    const placaInput = document.getElementById('placa');
    const modeloInput = document.getElementById('modelo');
    const corInput = document.getElementById('cor');
    const anoInput = document.getElementById('ano');
    const addButton = document.querySelector('.add');
    const deleteButton = document.querySelector('.delete');
    let currentVaga = null;

    // Objeto com as URLs das imagens por cor
    const imagensCarro = {
        branco: '../src/assets/carro_branco.png',
        preto: '../src/assets/carro_preto.png',
        azul: '../src/assets/carro_azul.png',
        vermelho: '../src/assets/carro_vermelho.png',
        laranja: '../src/assets/carro_laranja.png',
        marrom: '../src/assets/carro_marrom.png',
        prata: '../src/assets/carro_prata.png',
        rosa: '../src/assets/carro_rosa.png',
        roxo: '../src/assets/carro_roxo.png',
        verde: '../src/assets/carro_verde.png',
        cinza: '../src/assets/carro_cinza.png',
        amarelo: '../src/assets/carro_amarelo.png'
    };

    vagaButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentVaga = event.currentTarget.dataset.vaga;
            openPopup();
        });
    });

    function openPopup() {
        placaInput.value = '';
        modeloInput.value = '';
        corInput.value = '';
        anoInput.value = '';

        popup.style.display = 'block';
    }

    document.querySelector('.close').addEventListener('click', () => {
        popup.style.display = 'none';
    });

    addButton.addEventListener('click', (event) => {
        event.preventDefault();
        const modelo = modeloInput.value;
        const cor = corInput.value;
        const ano = anoInput.value;
    
        if (modelo && cor && ano) {
            if (validarCor(cor)) {
                updateVaga(currentVaga, modelo, cor, ano);
                popup.style.display = 'none';
            } else {
                alert('A cor digitada não existe. Por favor, escolha uma cor válida.');
            }
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });

    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        clearVaga(currentVaga);
        popup.style.display = 'none';
    });

    function updateVaga(vaga, modelo, cor, ano) {
        const vagaButton = document.querySelector(`button[data-vaga="${vaga}"]`);
        if (vagaButton) {
            vagaButton.innerHTML = `<img class="car-image" src="${imagensCarro[cor.toLowerCase()]}" alt="${modelo}" width="60px">`;
        }
    }

    function clearVaga(vaga) {
        const vagaButton = document.querySelector(`button[data-vaga="${vaga}"]`);
        if (vagaButton) {
            vagaButton.innerHTML = `<span>${vaga}</span>`;
        }
    }

    function validarCor(cor) {
        // Lista de cores permitidas
        const coresPermitidas = Object.keys(imagensCarro);
        return coresPermitidas.includes(cor.toLowerCase());
    }
});

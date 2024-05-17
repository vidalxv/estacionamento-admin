

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
        branca: '../src/assets/carro_branco.png',
        preto: '../src/assets/carro_preto.png',
        preta: '../src/assets/carro_preto.png',
        azul: '../src/assets/carro_azul.png',
        vermelho: '../src/assets/carro_vermelho.png',
        vermelha: '../src/assets/carro_vermelho.png',
        laranja: '../src/assets/carro_laranja.png',
        marrom: '../src/assets/carro_marrom.png',
        prata: '../src/assets/carro_prata.png',
        rosa: '../src/assets/carro_rosa.png',
        roxo: '../src/assets/carro_roxo.png',
        verde: '../src/assets/carro_verde.png',
        cinza: '../src/assets/carro_cinza.png',
        amarelo: '../src/assets/carro_amarelo.png',
        amarela: '../src/assets/carro_amarelo.png'
    };

    // Objeto para rastrear quais vagas estão ocupadas
    const vagasOcupadas = {
        vaga1: false,
        vaga2: false,
        vaga3: false,
        vaga4: false,
        vaga5: false,
        vaga6: false,
        vaga7: false,
        vaga8: false,
        vaga9: false,
        vaga10: false,
        vaga11: false,
        vaga12: false,
    };

    vagaButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentVaga = event.currentTarget.dataset.vaga;
            openPopup();
        });
    });

    function openPopup() {
        if (currentVaga && vagasOcupadas[currentVaga]) {
            showPopupMessage('A vaga já está ocupada.');
            return;
        }

        placaInput.value = '';
        modeloInput.value = '';
        corInput.value = '';
        anoInput.value = '';

        // Remove o elemento label existente antes de adicionar um novo
        const existingVagaLabel = document.querySelector('.vaga-label');
        if (existingVagaLabel) {
            existingVagaLabel.remove();
        }

        // Chamar a função para mostrar o número da vaga
        showVagaLabel(currentVaga);

        popup.style.display = 'block';
    }

    function showVagaLabel(vaga) {
        const placaInput = document.getElementById('placa');
        const vagaLabel = document.createElement('label');
        vagaLabel.setAttribute('for', 'placa');
        vagaLabel.textContent = `Vaga ${vaga}`;
        vagaLabel.classList.add('vaga-label');
        placaInput.parentNode.insertBefore(vagaLabel, placaInput);
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
                vagasOcupadas[currentVaga] = true; // Marcar a vaga como ocupada
                popup.style.display = 'none';
            } else {
                showPopupMessage('A cor digitada não existe. Por favor, coloque uma cor válida.');
            }
        } else {
            showPopupMessage('Por favor, preencha todos os campos corretamente.');
        }
    });

    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        clearVaga(currentVaga);
        vagasOcupadas[currentVaga] = false; // Marcar a vaga como desocupada
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

    function showPopupMessage(message) {
        const popupMessage = document.getElementById('popup-message');
        popupMessage.textContent = message;
        popupMessage.classList.add('show');

        setTimeout(() => {
            popupMessage.classList.remove('show');
        }, 3000);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const placaInput = document.getElementById('placa');
    const modeloInput = document.getElementById('modelo');
    const corInput = document.getElementById('cor');
    const anoInput = document.getElementById('ano');

    function handleInputs(inputElement) {
        let inputValue = inputElement.value;

        if (inputElement === placaInput) {
            inputValue = inputValue.toUpperCase();

            if (inputValue.length > 7) {
                inputValue = inputValue.slice(0, 7);
            }
        } else if (inputElement === anoInput) {
            inputValue = inputValue.replace(/\D/g, '');
            inputValue = inputValue.slice(0, 4);
        } else {
            inputValue = inputValue.toUpperCase();
        }

        inputElement.value = inputValue;
    }

    placaInput.addEventListener('input', () => {
        handleInputs(placaInput);
    });

    modeloInput.addEventListener('input', () => {
        handleInputs(modeloInput);
    });

    corInput.addEventListener('input', () => {
        handleInputs(corInput);
    });

    anoInput.addEventListener('input', () => {
        handleInputs(anoInput);
    });
});



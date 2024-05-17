document.addEventListener('DOMContentLoaded', () => {
        const vagaButtons = document.querySelectorAll('.vaga');
        const popup = document.getElementById('info-card');
        const placaInput = document.getElementById('placa');
        const modeloInput = document.getElementById('modelo');
        const corInput = document.getElementById('cor');
        const anoInput = document.getElementById('ano');
        const addButton = document.querySelector('.add');
        const deleteButton = document.querySelector('.delete');

        vagaButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const vaga = event.currentTarget.dataset.vaga;
                openPopup(vaga);
            });
        });

        function openPopup(vaga) {
            placaInput.value = '';
            modeloInput.value = '';
            corInput.value = '';
            anoInput.value = '';

            addButton.dataset.vaga = vaga;
            deleteButton.dataset.vaga = vaga;

            popup.style.display = 'block';
        }

        document.querySelector('.close').addEventListener('click', () => {
            popup.style.display = 'none';
        });

        addButton.addEventListener('click', (event) => {
            event.preventDefault();
            const vaga = event.currentTarget.dataset.vaga;
            const modelo = modeloInput.value;
            const cor = corInput.value;
            const ano = anoInput.value;
            
            if (modelo && cor && ano) {
                updateVaga(vaga, modelo, cor, ano);
                popup.style.display = 'none';
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });

        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            const vaga = event.currentTarget.dataset.vaga;
            clearVaga(vaga);
            popup.style.display = 'none';
        });

        function updateVaga(vaga, modelo, cor, ano) {
            const vagaButton = document.querySelector(`button[data-vaga="${vaga}"]`);
            if (vagaButton) {
                vagaButton.innerHTML = `<img src="./src/assets/carro_${cor.toLowerCase()}.png" alt="${modelo}" width="60px">`;
            }
        }

        function clearVaga(vaga) {
            const vagaButton = document.querySelector(`button[data-vaga="${vaga}"]`);
            if (vagaButton) {
                vagaButton.innerHTML = `<span>${vaga}</span>`;
            }
        }
    });

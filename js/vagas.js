import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCpSbUs_N6J58qWrl6K_RnD6fl6v9gIKMU",
    authDomain: "estacionamento-web.firebaseapp.com",
    databaseURL: "https://estacionamento-web-default-rtdb.firebaseio.com",
    projectId: "estacionamento-web",
    storageBucket: "estacionamento-web.appspot.com",
    messagingSenderId: "244370712518",
    appId: "1:244370712518:web:0b498b8090794a3c3cb4c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reservasRef = collection(db, 'reservas');
const database = getDatabase();
const vagasRef = ref(database, 'vagas');

async function carregarReservas() {
    try {
        const querySnapshot = await getDocs(reservasRef);
        const reservas = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Armazenando o ID do documento
            // Formatar a data para uma string legível (opcional)
            if (data.data_reserva) {
                data.data_reserva = new Date(data.data_reserva.seconds * 1000).toLocaleString();
            }
            reservas.push(data);
        });
        return reservas;
    } catch (error) {
        console.log("Erro ao carregar reservas:", error);
        return [];
    }
}

async function exibirReservasEmVagas() {
    const reservas = await carregarReservas();
    onValue(vagasRef, (snapshot) => {
        const vagas = snapshot.val();
        console.log(vagas);

        if (vagas) {
            Object.keys(vagas).forEach((vagaKey) => {
                const vagaData = vagas[vagaKey];
                const button = document.querySelector(`[data-vaga="${vagaKey}"]`);
                if (button) {
                    button.innerHTML = ''; // Limpa o conteúdo do botão
                    button.removeAttribute('data-reserva');
                    button.removeAttribute('data-hora-inicio');
                    button.removeAttribute('data-hora-fim');
                    button.removeAttribute('data-nome-estacionamento');
                    button.removeAttribute('data-endereco-estacionamento');

                    const reservaAtual = reservas.find(reserva => reserva.vaga === vagaKey);

                    if (vagaData.ocupada) {
                        button.classList.add('ocupada');
                        const img = document.createElement('img');
                        img.src = 'assets/carro_branco.png'; 
                        img.width = '60'; 
                        img.alt = 'Carro'; 
                        img.style.transform = 'rotate(90deg)';
                        button.appendChild(img);
                    } else if (reservaAtual) {
                        button.classList.add('reservada');

                        // Adiciona os dados da reserva ao botão
                        button.setAttribute('data-reserva', reservaAtual.id);
                        button.setAttribute('data-hora-inicio', reservaAtual.hora_inicio);
                        button.setAttribute('data-hora-fim', reservaAtual.hora_fim);
                        button.setAttribute('data-nome-estacionamento', reservaAtual.nome_estacionamento);
                        button.setAttribute('data-endereco-estacionamento', reservaAtual.endereco_estacionamento);
                        button.style.backgroundColor = 'black';
                        // Exibir os dados da reserva como texto no botão (opcional)
                        button.innerHTML += `
                            <strong>RESERVADO</strong>
                        `;
                    } else {
                        button.classList.remove('ocupada', 'reservada');
                    }
                }
            });
        }
    });
}

exibirReservasEmVagas();

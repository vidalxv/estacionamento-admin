import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

function showPopupMessage(message) {
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popupMessage.classList.add('show');

    setTimeout(() => {
        popupMessage.classList.remove('show');
    }, 3000);
}

async function adicionarVeiculo() {
    console.log('clicado');
    const placa = document.getElementById("placa").value;
    const modelo = document.getElementById("modelo").value;
    const nome = document.getElementById("nome").value;
    const contato = document.getElementById("contato").value;

    const dataHoraAtual = new Date();
    const dataFormatada = dataHoraAtual.toLocaleDateString();
    const horaFormatada = dataHoraAtual.toLocaleTimeString();

    if (placa === "" || modelo === "" || nome === "" || contato === "") {
        showPopupMessage('Por favor, preencha todos os campos corretamente.');
        return;
    }

    try {
        await addDoc(collection(db, "veiculos"), {
            placa: placa,
            modelo: modelo,
            nome: nome,
            contato: contato,
            data: dataFormatada,
            hora: horaFormatada
        });

        console.log("Veículo adicionado com sucesso!");
        document.getElementById("placa").value = "";
        document.getElementById("modelo").value = "";
        document.getElementById("nome").value = "";
        document.getElementById("contato").value = "";

        const ddd = contato.substring(0, 2);
        const numero = contato.substring(2);
        const chatId = `55${ddd}${numero}@c.us`;

        const messageBody = {
            chatId: "557582951810@c.us",
            contentType: "string",
            content: `*TICKET EMITIDO*    Placa: ${placa}, Modelo: ${modelo}, Data: ${dataFormatada}, Hora: ${horaFormatada}`
        };

        const response = await fetch('http://localhost:3000/client/sendMessage/estacionamento', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'x-api-key': 'estacionamento',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageBody)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar mensagem: ' + response.statusText);
        }

        const result = await response.json();
        console.log("Mensagem enviada com sucesso:", result);
    } catch (error) {
        console.error("Erro ao adicionar veículo ou enviar mensagem:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector("#btn");
    if (btn) {
        btn.addEventListener("click", adicionarVeiculo);
    }
});
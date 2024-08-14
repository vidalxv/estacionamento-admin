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
    let contato = document.getElementById("contato").value;

    const dataHoraAtual = new Date();
    const dataFormatada = dataHoraAtual.toLocaleDateString();
    const horaFormatada = dataHoraAtual.toLocaleTimeString();

    // Remover caracteres não numéricos do número de telefone
    contato = contato.replace(/\D/g, "");

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
        const ddi = "55"; // Código do Brasil
        const telefoneFormatado = `${ddi}${ddd}${numero}`;

        const xhr = new XMLHttpRequest();
        const url = 'https://8ce9-179-48-182-22.ngrok-free.app/enviar-mensagem';
        const apiKey = 'daniel';
        const messageBody = {
            to: `55${ddd}${numero}`,
            contentType: "string",
            message: `*TICKET EMITIDO*    Placa: ${placa}, Modelo: ${modelo}, Data: ${dataFormatada}, Hora: ${horaFormatada}`
        };

        xhr.open('POST', url, true);
        xhr.setRequestHeader('accept', '*/*');
        xhr.setRequestHeader('x-api-key', apiKey);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText); // Aqui você pode lidar com a resposta da requisição
                } else {
                    console.error('Erro ao fazer a requisição:', xhr.status);
                }
            }
        };

        xhr.send(JSON.stringify(messageBody));

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

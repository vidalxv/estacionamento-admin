import { db } from "./firebase.js";
import { collection, doc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const veiculosRef = collection(db, "veiculos");

function carregarClientes() {
    getDocs(veiculosRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const newRow = document.createElement("div"); 
            newRow.classList.add("ticket");
            newRow.innerHTML = `
            <div class="ticket-header">Ticket do Estacionamento</div>
            <p>Data: ${data.data}</p>
            <p>Hora: ${data.hora}</p>
            <p>Placa: ${data.placa}</p>
            <p>Modelo: ${data.modelo}</p>
            <p>Nome: ${data.nome}</p>
            <div class="ticket-footer">
                <button class="add" data-id="${doc.id}"><i class="fa-solid fa-cart-shopping"></i> Finalizar</button>
            </div>
        `;
            document.getElementById("info-pay").appendChild(newRow);
        });
    }).catch((error) => {
        console.log("Erro ao carregar ticket:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarClientes();

    document.getElementById("info-pay").addEventListener("click", async (event) => {
        const target = event.target;
        if (target && target.classList.contains("add")) {
            console.log("Botão 'Finalizar' clicado");

            try {
                const docId = target.getAttribute("data-id");
                const docSnapshot = await getDoc(doc(db, "veiculos", docId));

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    const placa = data.placa;
                    const modelo = data.modelo;
                    const nome = data.nome;

                    // Debugging logs
                    console.log("Data:", data.data);
                    console.log("Hora:", data.hora);

                    // Formatar data e hora para o formato adequado
                    const dataParts = data.data.split('/');
                    const formattedDate = `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}`;
                    const dataHoraEntradaString = `${formattedDate}T${data.hora}`;

                    console.log("DataHoraEntradaString:", dataHoraEntradaString);

                    const dataHoraEntrada = new Date(dataHoraEntradaString);
                    console.log("DataHoraEntrada:", dataHoraEntrada);

                    const dataHoraSaida = new Date(); // Data e hora atuais
                    console.log("DataHoraSaida:", dataHoraSaida);

                    // Calcular a diferença de tempo em milissegundos
                    const tempoEstacionamentoEmMilissegundos = dataHoraSaida - dataHoraEntrada;
                    const tempoEstacionamentoEmMinutos = Math.ceil(tempoEstacionamentoEmMilissegundos / (1000 * 60)); // Converter para minutos e arredondar para cima

                    console.log("TempoEstacionamentoEmMinutos:", tempoEstacionamentoEmMinutos);

                    const configuracoesRef = doc(db, "configuracoes", "custoPorMinuto");
                    const configuracoesSnapshot = await getDoc(configuracoesRef);

                    if (configuracoesSnapshot.exists()) {
                        const custoPorMinuto = configuracoesSnapshot.data().valor;
                        console.log("Custo por minuto:", custoPorMinuto);

                        const custoTotal = custoPorMinuto * tempoEstacionamentoEmMinutos;
                        console.log("Custo total:", custoTotal);

                        const mensagem = `
                            <p class="msgp">Placa: ${placa}</p>
                            <p class="msgp">Nome: ${nome}</p>
                            <p class="msgp">Tempo de estacionamento: ${tempoEstacionamentoEmMinutos} minutos</p>
                            <p class="msgp">Custo por minuto: R$ ${custoPorMinuto}</p>
                            <p class="msgp">Custo total: R$ ${custoTotal.toFixed(2)}</p>
                            <button id="pagar">Pagar Agora</button>
                        `;
                        document.getElementById("popup-ticket").innerHTML = mensagem;
                        document.getElementById("popup").style.display = "block"; // Exibe o popup
                    } else {
                        console.log("Documento 'custoPorMinuto' não encontrado.");
                    }
                } else {
                    console.log("Documento do veículo não encontrado.");
                }
            } catch (error) {
                console.log("Erro ao obter informações do veículo:", error);
            }
        }
    });

    // Fechar o popup ao clicar no botão de fechar
    document.getElementById("close").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    // Fechar o popup ao clicar fora dele
    window.addEventListener("click", (event) => {
        const popup = document.getElementById("popup");
        if (event.target == popup) {
            popup.style.display = "none";
        }
    });

    // Adiciona um evento de clique ao botão "Pagar Agora"
    document.getElementById("pagar").addEventListener("click", () => {
        // Redireciona o usuário para a página de pagamento
        window.location.href = "pagina_de_pagamento.html"; // Substitua com a URL da sua página de pagamento
    });
});

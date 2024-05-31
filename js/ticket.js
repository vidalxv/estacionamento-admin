import { db } from "./firebase.js";
import { collection, doc, getDocs, getDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const veiculosRef = collection(db, "veiculos");

function carregarClientes() {
    getDocs(veiculosRef).then((querySnapshot) => {
        const tickets = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tickets.push({ id: doc.id, ...data });
        });
        displayTickets(tickets);
    }).catch((error) => {
        console.log("Erro ao carregar tickets:", error);
    });
}

function displayTickets(tickets) {
    const infoPayElement = document.getElementById("info-pay");
    infoPayElement.innerHTML = '';

    tickets.forEach(ticket => {
        const newRow = document.createElement("div");
        newRow.classList.add("ticket");
        newRow.innerHTML = `
            <div class="ticket-header">Ticket do Estacionamento</div>
            <p>Data: ${ticket.data}</p>
            <p>Hora: ${ticket.hora}</p>
            <p>Placa: ${ticket.placa}</p>
            <p>Modelo: ${ticket.modelo}</p>
            <p>Nome: ${ticket.nome}</p>
            <div class="ticket-footer">
                <button class="add" data-id="${ticket.id}"><i class="fa-solid fa-cart-shopping"></i> Finalizar</button>
            </div>
        `;
        infoPayElement.appendChild(newRow);
    });
}

function filterAndDisplayTickets(searchTerm) {
    getDocs(veiculosRef).then((querySnapshot) => {
        const tickets = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tickets.push({ id: doc.id, ...data });
        });

        const filteredTickets = tickets.filter(ticket =>
            ticket.placa.toLowerCase().includes(searchTerm)
        );

        filteredTickets.sort((a, b) => a.placa.localeCompare(b.placa));

        displayTickets(filteredTickets);
    }).catch((error) => {
        console.log("Erro ao carregar tickets:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarClientes();

    document.getElementById("search-input").addEventListener("input", function (event) {
        const searchTerm = event.target.value.toLowerCase();
        filterAndDisplayTickets(searchTerm);
    });

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
                        const custoTotalInt = Number(custoTotal.toFixed(2));
                        console.log("Custo total:", custoTotal);

                        const popupTicketElement = document.getElementById("popup-ticket");
                        if (popupTicketElement) {
                            const mensagem = `
                                <p class="msgp">Placa: ${placa}</p>
                                <p class="msgp">Nome: ${nome}</p>
                                <p class="msgp">Tempo de estacionamento: ${tempoEstacionamentoEmMinutos} minutos</p>
                                <p class="msgp">Custo por minuto: R$ ${custoPorMinuto}</p>
                                <p class="msgp">Custo total: R$ ${custoTotal.toFixed(2)}</p>
                                <button id="pagar">PAGAR COM PIX</button>
                                <button id="pagarmanual">PAGAR MANUALMENTE</button>
                            `;
                            popupTicketElement.innerHTML = mensagem;
                            document.getElementById("popup").style.display = "block"; // Exibe o popup

                            document.getElementById("pagarmanual").addEventListener("click", async () => {
                                try {
                                    document.getElementById("popup").style.display = "none";
                                    const caixaRef = collection(db, "caixa");

                                    // Add the record to the "caixa" collection
                                    await addDoc(caixaRef, {
                                        placa: placa,
                                        nome: nome,
                                        tempo_estacionamento_minutos: tempoEstacionamentoEmMinutos,
                                        custo_total: custoTotalInt,
                                        data: new Date().toLocaleDateString(),
                                        formpag: "MANUAL"
                                    });

                                    // Remove the record from the "veiculos" collection
                                    const veiculoDocRef = doc(db, "veiculos", docId);
                                    await deleteDoc(veiculoDocRef);

                                    console.log("Documento removido da coleção 'veiculos'.");
                                } catch (error) {
                                    console.error("Erro ao remover o documento da coleção 'veiculos':", error);
                                }
                            });


                            // Adiciona um evento de clique ao botão "Pagar Agora"
                            document.getElementById("pagar").addEventListener("click", async () => {
                                try {
                                    const xhr = new XMLHttpRequest();
                                    xhr.open('POST', 'https://mercadopago-roan.vercel.app/payments');
                                    xhr.setRequestHeader('Content-Type', 'application/json');

                                    xhr.onload = async function () {
                                        if (xhr.status === 200) {
                                            const data = JSON.parse(xhr.responseText);
                                            if (data && data.point_of_interaction && data.point_of_interaction.transaction_data && data.point_of_interaction.transaction_data.qr_code_base64 && data.id) {
                                                const qrCodeContainer = document.getElementById("popup-ticket");
                                                const idPagamento = data.id;
                                                const qrCodeBase64 = data.point_of_interaction.transaction_data.qr_code_base64;
                                                qrCodeContainer.innerHTML = `
                                                    <img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code" width="100%"/>
                                                    <div style="display: flex; justify-content: flex-end; align-items: flex-end;">
                                                        <p style="width: 100%;">Aguardando Pagamento...</p>
                                                        <img src="https://www.previcaceres.com.br/aposentadoria/images/loading_verde.gif" width="50px" style="position: absolute;"></img>
                                                    </div>`;

                                                await checkPaymentStatusPeriodically(idPagamento, placa, nome, tempoEstacionamentoEmMinutos, custoTotalInt, docId);
                                            } else {
                                                alert('Não foi possível obter o URL do ticket.');
                                            }
                                        } else {
                                            console.error(xhr.responseText);
                                            alert('Erro ao criar pagamento.');
                                        }
                                    };

                                    xhr.onerror = function () {
                                        console.error(xhr.responseText);
                                        alert('Erro ao criar pagamento.');
                                    };

                                    xhr.send(JSON.stringify({ transaction_amount: custoTotalInt }));
                                } catch (error) {
                                    console.error(error);
                                    alert('Erro ao criar pagamento.');
                                }
                            });
                        } else {
                            console.log("Elemento 'popup-ticket' não encontrado.");
                        }
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
    document.getElementById("close").addEventListener ("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    // Fechar o popup ao clicar fora dele
    window.addEventListener("click", (event) => {
        const popup = document.getElementById("popup");
        if (event.target == popup) {
            popup.style.display = "none";
        }
    });
});

async function checkPaymentStatus(paymentId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.mercadopago.com/v1/payments/${paymentId}`);
        xhr.setRequestHeader('accept', '*/*');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer APP_USR-3711647004423148-051914-487239491cac569bacf34fbbde8783e1-1265716188');
        xhr.onload = function () {
            if (xhr.status === 200) {
                const paymentInfo = JSON.parse(xhr.responseText);
                resolve(paymentInfo.status);
            } else {
                reject(new Error('Erro ao verificar pagamento. Status: ' + xhr.status));
            }
        };
        xhr.onerror = function () {
            reject(new Error('Erro de rede ao verificar pagamento.'));
        };
        xhr.send();
    });
}


async function checkPaymentStatusPeriodically(paymentId, placa, nome, tempoEstacionamentoEmMinutos, custoTotalInt, docId) {
    const interval = setInterval(async () => {
        try {
            const status = await checkPaymentStatus(paymentId);
            console.log("Status do pagamento:", status);
            if (status === "approved") {
                clearInterval(interval);

                const pagamento = document.getElementById("popup-ticket");
                pagamento.innerHTML = `<img src="https://cdn3.emoji.gg/emojis/1134-verified-animated.gif" alt="QR Code" width="100%"/>`;
                
                const caixaRef = collection(db, "caixa");
                await addDoc(caixaRef, {
                    placa: placa,
                    nome: nome,
                    tempo_estacionamento_minutos: tempoEstacionamentoEmMinutos,
                    custo_total: custoTotalInt,
                    data: new Date().toLocaleDateString(),
                    formpag: "PIX"
                });

                const veiculoDocRef = doc(db, "veiculos", docId);
                await deleteDoc(veiculoDocRef);

                console.log("Documento removido da coleção 'veiculos' após pagamento.");
            }
        } catch (error) {
            console.error("Erro ao verificar status do pagamento:", error);
            clearInterval(interval); // Em caso de erro, pare de verificar o pagamento
        }
    }, 5000); // Verificar a cada 5 segundos
}


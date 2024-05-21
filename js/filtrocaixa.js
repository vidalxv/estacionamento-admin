import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const caixaRef = collection(db, "caixa");

async function carregarDadosCaixa() {
    try {
        const querySnapshot = await getDocs(caixaRef);
        const registrosCaixa = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Armazenando o ID do documento, se necessário
            registrosCaixa.push(data);
        });
        console.log("Registros de caixa carregados:", registrosCaixa); // Log para depuração
        return registrosCaixa;
    } catch (error) {
        console.error("Erro ao carregar dados do caixa:", error);
        return [];
    }
}

function exibirCaixa(registrosCaixa) {
    const tbody = document.getElementById("tabelaCaixa").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    registrosCaixa.forEach((data) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${data.data}</td>
            <td>${data.tempo_estacionamento_minutos}</td>
            <td>${data.placa}</td>
            <td>${data.modelo}</td>
            <td>${data.custo_total}</td>
        `;
        tbody.appendChild(newRow);
    });
}

function filtrarPorData(registrosCaixa, dataSelecionada) {
    // Converter a data selecionada para o formato dd/mm/yyyy
    const [ano, mes, dia] = dataSelecionada.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    console.log("Data selecionada:", dataSelecionada); // Log para depuração
    console.log("Data formatada:", dataFormatada); // Log para depuração

    const registrosFiltrados = registrosCaixa.filter(registro => registro.data === dataFormatada);

    console.log("Registros filtrados:", registrosFiltrados); // Log para depuração

    exibirCaixa(registrosFiltrados);
}

document.addEventListener("DOMContentLoaded", async () => {
    const registrosCaixa = await carregarDadosCaixa();
    exibirCaixa(registrosCaixa);

    document.getElementById("filterDate").addEventListener("change", (event) => {
        const dataSelecionada = event.target.value;
        filtrarPorData(registrosCaixa, dataSelecionada);
    });
});
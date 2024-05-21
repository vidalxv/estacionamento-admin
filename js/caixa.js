import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const veiculosRef = collection(db, "caixa");

async function carregarClientes() {
    try {
        const querySnapshot = await getDocs(veiculosRef);
        const clientes = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Armazenando o ID do documento, se necessário
            clientes.push(data);
        });
        console.log("Clientes carregados:", clientes); // Log para depuração
        return clientes;
    } catch (error) {
        console.log("Erro ao carregar clientes:", error);
        return [];
    }
}

function exibirCaixa(clientes) {
    const tbody = document.getElementById("tabelaCaixa").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    clientes.forEach((data) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                    <td>${data.data}</td>
                    <td>${data.placa}</td>
                    <td>${data.modelo}</td>
                    <td>${data.contato}</td>
                    <td>${data.nome}</td>
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

    // Filtrar os registros com base na data formatada
    const registrosFiltrados = registrosCaixa.filter(registro => {
        // Converter a data do registro para o mesmo formato
        const registroData = registro.data; // Supondo que a data já esteja no formato dd/mm/yyyy

        // Verificar se a data do registro corresponde à data selecionada
        return registroData === dataFormatada;
    });

    console.log("Registros filtrados:", registrosFiltrados); // Log para depuração

    // Exibir os registros filtrados na tabela
    exibirCaixa(registrosFiltrados);
}



document.addEventListener("DOMContentLoaded", async () => {
    const clientes = await carregarClientes();
    exibirCaixa(clientes);

    document.getElementById("filterData").addEventListener("change", (event) => {
        const dataSelecionada = event.target.value;
        filtrarPorData(clientes, dataSelecionada);
    });
});
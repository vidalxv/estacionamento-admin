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

async function exibirCaixa(clientes) {
    console.log("Exibindo caixa...");

    const tbody = document.getElementById("tabelaCaixa").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    clientes.forEach((data) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                    <td>${data.data}</td>
                    <td>${data.tempo_estacionamento_minutos} MINUTOS</td>
                    <td>${data.placa}</td>
                    <td>${data.nome}</td>
                    <td>R$${data.custo_total}</td>
                    <td>${data.formpag}</td>
                `;
        tbody.appendChild(newRow);
    });

    // Calcular e exibir a soma dos valores
    const totalCusto = clientes.reduce((total, cliente) => total + parseFloat(cliente.custo_total), 0);
    document.getElementById("totalCusto").innerText = `Total: R$${totalCusto.toFixed(2)}`;

    console.log("Caixa exibido."); // Log para depuração
}

function filtrarPorIntervaloDeDatas(registrosCaixa, dataInicio, dataFim) {
    console.log("Filtrando por intervalo de datas...");
    console.log("Data de início:", dataInicio);
    console.log("Data de fim:", dataFim);
    console.log("Registros para filtrar:", registrosCaixa);

    // Formatar as datas de início e fim para o formato "dd/mm/yyyy" se estiverem no formato "yyyy-mm-dd"
    const dataInicioFormatada = dataInicio.includes('/') ? formatarData(dataInicio) : dataInicio;
    const dataFimFormatada = dataFim.includes('/') ? formatarData(dataFim) : dataFim;

    console.log("Data de início formatada:", dataInicioFormatada);
    console.log("Data de fim formatada:", dataFimFormatada);

    // Filtrar os registros com base no intervalo de datas
    const registrosFiltrados = registrosCaixa.filter(registro => {
        if (!registro.data) {
            console.log("Registro sem data:", registro);
            return false; // Ignorar registros sem data
        }
        // Converter a data do registro para o mesmo formato
        const [diaRegistro, mesRegistro, anoRegistro] = registro.data.split(/[/-]/); // Permitir tanto "-" quanto "/"
        const dataRegistroFormatada = `${anoRegistro}-${mesRegistro}-${diaRegistro}`;
        console.log("Data do registro:", registro.data);

        // Criar objetos de data para facilitar a comparação
        const dataRegistro = new Date(dataRegistroFormatada);
        const dataInicioFiltro = new Date(dataInicioFormatada);
        const dataFimFiltro = new Date(dataFimFormatada);

        console.log("Data do registro formatada:", dataRegistro);

        // Verificar se a data do registro está dentro do intervalo especificado
        return dataRegistro >= dataInicioFiltro && dataRegistro <= dataFimFiltro;
    });

    console.log("Registros filtrados:", registrosFiltrados); // Log para depuração

    // Exibir os registros filtrados na tabela
    exibirCaixa(registrosFiltrados);
}

function formatarData(data) {
    const [dia, mes, ano] = data.split("/");
    // Construir a data no formato esperado pelo objeto Date (ano, mês - 1, dia)
    return new Date(ano, mes - 1, dia);
}

document.addEventListener("DOMContentLoaded", async () => {
    const clientes = await carregarClientes();
    exibirCaixa(clientes);

    document.getElementById("filterInterval").addEventListener("click", () => {
        const dataInicio = document.getElementById("dataInicio").value;
        const dataFim = document.getElementById("dataFim").value;

        console.log("Data de início:", dataInicio);
        console.log("Data de fim:", dataFim);

        filtrarPorIntervaloDeDatas(clientes, dataInicio, dataFim);
    });
});
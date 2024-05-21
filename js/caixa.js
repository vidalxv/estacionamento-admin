import { db } from "./firebase.js";
import { collection, doc, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", async () => {
    const tabelaCaixa = document.getElementById("tabelaCaixa");
    const tbody = tabelaCaixa.querySelector("tbody");

    // Função para buscar dados do banco de dados Firestore
    async function buscarDadosCaixa() {
        try {
            // Fazer a consulta à coleção "caixa" no Firestore
            const querySnapshot = await getDocs(collection(db, "caixa"));

            // Limpar os dados anteriores da tabela
            tbody.innerHTML = "";

            // Preencher a tabela com os novos dados
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.data}</td>
                    <td>${data.tempo_estacionamento_minutos}</td>
                    <td>${data.placa}</td>
                    <td>${data.modelo}</td>
                    <td>${data.custo_total}</td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error("Erro ao buscar dados do caixa:", error);
        }
    }

    // Chamar a função para buscar e exibir os dados do caixa quando a página carrega
    await buscarDadosCaixa();

    // Evento de mudança do filtro de data
    document.getElementById("filterDate").addEventListener("change", async () => {
        // Aqui você pode adicionar a lógica para filtrar os dados por data
        // Por exemplo, chamar a função buscarDadosCaixa() novamente com o parâmetro de data selecionado
        await buscarDadosCaixa();
    });
});
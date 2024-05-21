import { db } from "./firebase.js";
        import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

        const veiculosRef = collection(db, "veiculos");

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

        function exibirClientes(clientes) {
            const tbody = document.getElementById("tabelaClientes").getElementsByTagName("tbody")[0];
            tbody.innerHTML = "";
            clientes.forEach((data) => {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                    <td>${data.data}</td>
                    <td>${data.hora}</td>
                    <td>${data.placa}</td>
                    <td>${data.modelo}</td>
                    <td>${data.contato}</td>
                    <td>${data.nome}</td>
                `;
                tbody.appendChild(newRow);
            });
        }

        function filtrarPorData(clientes, dataSelecionada) {
            // Converter a data selecionada para o formato dd/mm/yyyy
            const [ano, mes, dia] = dataSelecionada.split("-");
            const dataFormatada = `${dia}/${mes}/${ano}`;

            console.log("Data selecionada:", dataSelecionada); // Log para depuração
            console.log("Data formatada:", dataFormatada); // Log para depuração

            const clientesFiltrados = clientes.filter(cliente => cliente.data === dataFormatada);

            console.log("Clientes filtrados:", clientesFiltrados); // Log para depuração

            exibirClientes(clientesFiltrados);
        }

        document.addEventListener("DOMContentLoaded", async () => {
            const clientes = await carregarClientes();
            exibirClientes(clientes);

            document.getElementById("filterDate").addEventListener("change", (event) => {
                const dataSelecionada = event.target.value;
                filtrarPorData(clientes, dataSelecionada);
            });
        });
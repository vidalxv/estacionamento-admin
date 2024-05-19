import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const veiculosRef = collection(db, "veiculos");

function carregarClientes() {
    getDocs(veiculosRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${data.data}</td>
                <td>${data.hora}</td>
                <td>${data.placa}</td>
                <td>${data.modelo}</td>
                <td>${data.contato}</td>
                <td>${data.nome}</td>
            `;
            document.getElementById("tabelaClientes").getElementsByTagName("tbody")[0].appendChild(newRow);
        });
    }).catch((error) => {
        console.log("Erro ao carregar clientes:", error);
    });
}

document.addEventListener("DOMContentLoaded", carregarClientes);

import { db } from "./firebase.js";
import { collection, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const custoPorMinutoInput = document.querySelector("#addvalor");

async function preencherCustoPorMinutoAtual() {
    try {
        const docRef = doc(db, "configuracoes", "custoPorMinuto");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const custoPorMinuto = docSnap.data().valor;
            custoPorMinutoInput.value = custoPorMinuto;
        } else {
            console.log("Documento não encontrado!");
        }
    } catch (error) {
        console.error("Erro ao obter o valor do custo por minuto:", error);
    }
}

document.addEventListener("DOMContentLoaded", preencherCustoPorMinutoAtual);

async function atualizarValor() {
    const novoCustoPorMinuto = custoPorMinutoInput.value;
    try {
        await updateDoc(doc(db, "configuracoes", "custoPorMinuto"), {
            valor: novoCustoPorMinuto
        });
        console.log("Valor atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar o valor:", error);
    }
}

const btnAtualizarValor = document.querySelector("#atualizar");
btnAtualizarValor.addEventListener("click", atualizarValor);

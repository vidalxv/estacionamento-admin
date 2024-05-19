const inputContato = document.getElementById('contato');

// Função para adicionar máscara de telefone
function formatarTelefone(value) {
    // Remove todos os caracteres que não são números
    const cleaned = ('' + value).replace(/\D/g, '');
    // Adiciona a máscara para telefone
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
        return (!match[2] ? match[1] : '(' + match[1] + ') ') + (match[2] ? match[2] + '-' + match[3] : '');
    }
    return value;
}

// Event listener para formatar o telefone enquanto o usuário digita
inputContato.addEventListener('input', function (e) {
    const target = e.target;
    const input = target.value;
    const formattedInput = formatarTelefone(input);
    // Atualiza o valor do campo de entrada com o telefone formatado
    target.value = formattedInput;
});

const inputPlaca = document.getElementById('placa');

// Função para adicionar máscara de placa de carro no padrão Mercosul
function formatarPlacaMercosul(value) {
    // Remove todos os caracteres que não são letras ou números
    const cleaned = ('' + value).toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Adiciona a máscara para placa de carro no padrão Mercosul
    const match = cleaned.match(/^([A-Z]{0,3})(\d{0,1}[A-Z]{0,1}\d{0,2})$/);
    if (match) {
        return match[1] + (match[2] ? '-' + match[2] : '');
    }
    return value;
}

// Event listener para formatar a placa enquanto o usuário digita
inputPlaca.addEventListener('input', function (e) {
    const target = e.target;
    const input = target.value;
    const formattedInput = formatarPlacaMercosul(input);
    // Atualiza o valor do campo de entrada com a placa formatada
    target.value = formattedInput;
});

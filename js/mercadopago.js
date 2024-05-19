// Import node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Definir o access token
const accessToken = 'TEST-3711647004423148-051914-67cf424b6a3e5a4fe69ef19debcf169a-1265716188';

// Definir o endpoint
const userId = 1265716188;
const storeId = 61835222;
const posId = 'ABCCAIXA'; // Substitua pelo seu POS ID
const endpoint = `https://api.mercadopago.com/instore/qr/seller/${userId}/stores/${storeId}/pos/${posId}/orders`;

// Construir o payload do pedido
const payload = {
    items: [
        {
            title: 'Produto 1',
            quantity: 1,
            unit_price: 10.00
        },
        {
            title: 'Produto 2',
            quantity: 2,
            unit_price: 20.00
        }
    ],
    total_amount: 50.00,
};

// Fazer a requisição para criar o pedido
fetch(endpoint, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log('Pedido criado:', data);
})
.catch(error => {
    console.error('Erro ao criar o pedido:', error);
});

console.log('Endpoint:', endpoint);
console.log('Headers:', {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
});
console.log('Payload:', payload);

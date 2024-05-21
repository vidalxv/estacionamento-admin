const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: 'TEST-3711647004423148-051914-67cf424b6a3e5a4fe69ef19debcf169a-1265716188', options: { timeout: 5000, idempotencyKey: 'd' } });

const payment = new Payment(client);
const createPayment = async () => {
    try {
        const body = {
            transaction_amount: 1.20,
            description: 'Estacionamento AutoSavvy',
            payment_method_id: 'pix',
            payer: {
                email: 'email@cliente.com'
            },
        };

        const requestOptions = {
            idempotencyKey: 'd',
        };

        const paymentResponse = await payment.create({ body, requestOptions });
        console.log(paymentResponse);
        return paymentResponse;
    } catch (error) {
        console.error(error);
    }
}; 

createPayment();

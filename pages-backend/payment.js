const express = require('express');
const { v4 } = require('uuid');
const mercadoPago = require('mercadopago');
const db = require('./db'); 
const sessionMiddleware = require('./sessionMiddleware');

const paymentRouter = express.Router();

mercadoPago.configure({
  sandbox: true, // Modo desenvolvimento
  access_token: "segredinho"
});

paymentRouter.use(sessionMiddleware);

// Rota para listar os pagamentos
paymentRouter.get('/payments', (req, res) => {
  res.render('payment', { payments: database.payments });
});

// Rota para gerar um pagamento
paymentRouter.get('/pay/:product_id', async (req, res) => {
  const id = v4();
  const emailpagador = 'emailPagado@gmail.com';
  const product_id = req.params.product_id;

  const product = database.products.find(product => product.id === product_id);

  if (!product) {
    return res.sendStatus(404);
  }

  const dados = {
    items: [
      {
        id: id,
        title: product.name,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: parseFloat(product.price)
      }
    ],
    payer: {
      email: emailpagador
    },
    external_reference: id
  };

  try {
    const pagamento = await mercadoPago.preferences.create(dados);

    if (pagamento.status === 'authorized') {
      const userId = req.session.login.userId;
      const produtoComprado = product.name;

      const query = "UPDATE login SET Plano = ?, DataDeCompra = ? WHERE NomeDeUsuario = ?";
      const values = [produtoComprado, new Date(), userId];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Erro ao atualizar o banco de dados do usuário:", err);
        } else {
          console.log("Banco de dados do usuário atualizado com sucesso.");
        }
      });
    }

    // Insira um novo pagamento
    database.payments.push({
      email: emailpagador,
      id_payment: id,
      name: product.name,
      price: parseFloat(product.price),
      status: 'A pagar'
    });

    // Redirecione para o checkout
    return res.redirect(pagamento.body.init_point);
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = paymentRouter;

const express = require('express');
const db = require('./db');
const sessionMiddleware = require('./sessionMiddleware');

const accountRouter = express.Router();
accountRouter.use(sessionMiddleware);

// Sistema de login

/*
accountRouter.post('/',(req,res)=>{

    const login = req.body.login;
    const senha = req.body.password;
  
    db.query('SELECT * FROM login WHERE NomeDeUsuario = ? AND SenhaDoUsuario = ?', [login, senha], (err, results) => {
      if (err) {
        console.error('Erro ao executar a consulta:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor.' });
      } else if (results.length === 1) {
        
        req.session.login = login;
        res.render('logado')
  
      }else{
        res.render('index')
      }
    });
  
})
*/

accountRouter.post('/getAccounts', (req, res) => {
  if (!req.session.login) {
    return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
  }

  const userName = req.session.login;

  db.query('SELECT NomeDeUsuario, EmailDoUsuario, Plano FROM login WHERE NomeDeUsuario = ?', [userName], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar informações do usuário:', err);
      res.status(500).json({ success: false, message: 'Erro no servidor.' });
    } else if (rows.length === 0) {
      console.log('Usuário não encontrado no banco de dados.');
      res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    } else {
      const user = {
        NomeDeUsuario: rows[0].NomeDeUsuario,
        EmailDoUsuario: rows[0].EmailDoUsuario,
        Plano: rows[0].Plano,
      };
      res.status(200).json({ success: true, user });
    }
  });
});


// Rota para criar uma conta

accountRouter.post('/create-account', (req, res) => {
  const createUsername = req.body.login;
  const createPassword = req.body.password;
  const createPassword2 = req.body.second_password;
  const createEmail = req.body.email;

  if (createPassword === createPassword2) {
      db.query('SELECT * FROM login WHERE NomeDeUsuario = ? OR EmailDoUsuario = ?', [createUsername, createEmail], (err, rows) => {
          if (err) {
              console.error('Erro ao verificar a conta:', err);
              res.status(500).json({ success: false, message: 'Erro no servidor.' });
          } else if (rows.length > 0) {
              console.log('Usuário ou email já existe.');
              res.status(400).json({ success: false, message: 'Usuário ou email já existem.' });
          } else {
              db.query('INSERT INTO login (NomeDeUsuario, SenhaDoUsuario, EmailDoUsuario) VALUES (?, ?, ?)', [createUsername, createPassword, createEmail], (err, result) => {
                  if (err) {
                      console.error('Erro ao criar a conta:', err);
                      res.status(500).json({ success: false, message: 'Erro no servidor.' });
                  } else {
                      req.session.login = createUsername;
                      res.render('logado');
                  }
              });
          }
      });
  } else {
      console.log('As senhas não coincidem.');
      res.status(400).json({ success: false, message: 'As senhas não coincidem.' });
  }
});

  
  // Sistema de Licensa
  
  accountRouter.post('/get-license', (req, res) => {
    if (req.session.login) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }
  });
  

module.exports = accountRouter;

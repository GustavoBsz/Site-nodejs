/* Sistema de Sessão */

const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const express = require('express');

/* Sistema de Rotas */

const db = require('./pages-backend/db');
const routes = require('./pages-backend/routes');
const createAccountRouter = require('./pages-backend/account');
const sessionMiddleware = require('./pages-backend/sessionMiddleware');

const app = express();
const port = 8080;
const path = require('path'); 
app.use(sessionMiddleware);

/* Sistema de envio de html */

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.set('views', path.join(__dirname, '/views'));

/* App.use */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(routes);
app.use(createAccountRouter);


require('dotenv/config');

// Se tiver logado vai puxar a index

app.get('/', (req, res) => {
  if (req.session.login) {
    res.render('logado')
  } else {
    res.render('index');
  }
});

app.post('/login', (req, res) => {
  if (req.body.registrar === "Criar sua conta") {
    res.render('registrar');
  } else if (req.session.login) {
    res.render('logado');
  }else if(req.body.acao === "Entrar"){
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
  } else {
    res.render('login');
  }
});


app.post('/comecar', (req, res) => {
  if (req.session.login) {
    res.render('logado')
  } else {
    res.render('registrar');
  }
});

/* Portas */

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
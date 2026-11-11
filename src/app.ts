import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseModel } from './model/DatabaseModel.js';
import { AuthController } from './controller/AuthController.js';
import { ClienteController } from './controller/ClienteController.js';
import { EquipamentoController } from './controller/EquipamentoController.js';
import { AgendamentoController } from './controller/AgendamentoController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas da Aplicação
app.post('/login', AuthController.login);

app.get('/clientes', ClienteController.listarOuBuscar);
app.post('/clientes', ClienteController.cadastrar);
app.put('/clientes/:id', ClienteController.editar);
app.delete('/clientes/:id', ClienteController.excluir);

app.post('/equipamentos', EquipamentoController.cadastrar);

app.get('/agendamentos', AgendamentoController.listarOrdenadoPorData);
app.patch('/agendamentos/:id/data', AgendamentoController.atualizarData);

// Testar conexão com a base de dados antes de arrancar o servidor
new DatabaseModel().testeConexao().then((resbd) => {
    if (resbd) {
        app.listen(port, () => {
            console.log(`Servidor a rodar em http://localhost:${port}`);
        });
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
});
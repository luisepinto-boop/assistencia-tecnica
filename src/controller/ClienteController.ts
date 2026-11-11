import { Request, Response } from 'express';
import { DatabaseModel } from '../model/DatabaseModel.js';
import { Security } from '../utils/Security.js';

const db = new DatabaseModel();

export class ClienteController {
    public static async listarOuBuscar(req: Request, res: Response) {
        const { busca } = req.query;
        try {
            let queryText = 'SELECT * FROM clientes';
            let params: any[] = [];

            if (busca) {
                queryText += ' WHERE nome ILIKE $1 OR email ILIKE $1';
                params.push(`%${busca}%`);
            }

            const result = await db.pool.query(queryText, params);
            
            // Descriptografar CPF ao retornar para a interface
            const clientes = result.rows.map(cliente => ({
                ...cliente,
                cpf: Security.decryptCPF(cliente.cpf_criptografado)
            }));

            return res.json(clientes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar clientes.' });
        }
    }

    public static async cadastrar(req: Request, res: Response) {
        const { nome, cpf, telefone, email } = req.body;
        try {
            const cpfCriptografado = Security.encryptCPF(cpf);
            const queryText = 'INSERT INTO clientes (nome, cpf_criptografado, telefone, email) VALUES ($1, $2, $3, $4) RETURNING *';
            const result = await db.pool.query(queryText, [nome, cpfCriptografado, telefone, email]);

            return res.status(201).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
        }
    }

    public static async editar(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, cpf, telefone, email } = req.body;
        try {
            const cpfCriptografado = Security.encryptCPF(cpf);
            const queryText = 'UPDATE clientes SET nome=$1, cpf_criptografado=$2, telefone=$3, email=$4 WHERE id=$5 RETURNING *';
            const result = await db.pool.query(queryText, [nome, cpfCriptografado, telefone, email, id]);

            return res.json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao editar cliente.' });
        }
    }

    public static async excluir(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await db.pool.query('DELETE FROM clientes WHERE id = $1', [id]);
            return res.json({ message: 'Cliente removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Não foi possível remover o cliente devido a restrições de integridade.' });
        }
    }
}
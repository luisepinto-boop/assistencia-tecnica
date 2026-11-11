import { Request, Response } from 'express';
import { DatabaseModel } from '../model/DatabaseModel.js';

const db = new DatabaseModel();

export class EquipamentoController {
    public static async cadastrar(req: Request, res: Response) {
        const { cliente_id, tipo, marca, modelo, numero_serie } = req.body;

        if (!cliente_id) {
            return res.status(400).json({ error: 'O cliente_id é obrigatório para registar um equipamento.' });
        }

        try {
            // Verificar se cliente existe
            const checkCliente = await db.pool.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
            if (checkCliente.rows.length === 0) {
                return res.status(404).json({ error: 'Cliente informado não encontrado.' });
            }

            const queryText = `
                INSERT INTO equipamentos (cliente_id, tipo, marca, modelo, numero_serie)
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            const result = await db.pool.query(queryText, [cliente_id, tipo, marca, modelo, numero_serie]);

            return res.status(201).json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao cadastrar equipamento.' });
        }
    }
}
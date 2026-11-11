import { Request, Response } from 'express';
import { DatabaseModel } from '../model/DatabaseModel.js';

const db = new DatabaseModel();

export class AgendamentoController {
    public static async listarOrdenadoPorData(req: Request, res: Response) {
        try {
            const queryText = `
                SELECT 
                    a.id, 
                    a.data_agendamento, 
                    a.status, 
                    a.descricao,
                    c.nome AS cliente_nome,
                    c.email AS cliente_email,
                    e.tipo AS equipamento_tipo,
                    e.marca AS equipamento_marca,
                    e.modelo AS equipamento_modelo
                FROM agendamentos a
                JOIN clientes c ON a.cliente_id = c.id
                JOIN equipamentos e ON a.equipamento_id = e.id
                ORDER BY a.data_agendamento ASC
            `;
            const result = await db.pool.query(queryText);
            return res.json(result.rows);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar agendamentos.' });
        }
    }

    public static async atualizarData(req: Request, res: Response) {
        const { id } = req.params;
        const { data_agendamento } = req.body;

        try {
            const queryText = 'UPDATE agendamentos SET data_agendamento = $1 WHERE id = $2 RETURNING *';
            const result = await db.pool.query(queryText, [data_agendamento, id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }

            return res.json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar data do agendamento.' });
        }
    }
}
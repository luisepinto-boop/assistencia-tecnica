import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DatabaseModel } from '../model/DatabaseModel.js';
import { Security } from '../utils/Security.js';

const db = new DatabaseModel();

export class AuthController {
    public static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const queryText = 'SELECT * FROM utilizadores WHERE email = $1';
            const result = await db.pool.query(queryText, [email]);

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const user = result.rows[0];
            const isValid = await Security.comparePassword(password, user.senha_hash);

            if (!isValid) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            // Sessão temporizada (expira em 1 hora)
            const token = jwt.sign(
                { id: user.id, nome: user.nome, email: user.email },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '1h' }
            );

            return res.json({
                message: 'Login efetuado com sucesso',
                token,
                user: { id: user.id, nome: user.nome, email: user.email }
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro no servidor ao realizar login.' });
        }
    }
}
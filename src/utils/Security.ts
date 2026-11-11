import bcrypt from 'bcrypt';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.scryptSync(process.env.CRYPTO_SECRET || 'secret_key', 'salt', 32);
const IV = Buffer.alloc(16, 0); // IV simplificado para fins didáticos

export class Security {
    // Hash de palavra-passe
    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    // Criptografia simétrica para CPF
    public static encryptCPF(cpf: string): string {
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
        let encrypted = cipher.update(cpf, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    public static decryptCPF(encryptedCpf: string): string {
        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
        let decrypted = decipher.update(encryptedCpf, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseModel {
    private _config: object;
    private _pool: pg.Pool;
    private _client: pg.Client;

    constructor() {
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
            max: 10,
            idleTimeoutMillis: 10000
        };

        this._pool = new pg.Pool(this._config);
        this._client = new pg.Client(this._config);
    }

    public async testeConexao(): Promise<boolean> {
        try {
            await this._client.connect();
            console.log('Database connected!');
            await this._client.end();
            return true;
        } catch (error) {
            console.log('Error to connect database :(');
            console.log(error);
            try { await this._client.end(); } catch {}
            return false;
        }
    }

    public get pool(): pg.Pool {
        return this._pool;
    }
}
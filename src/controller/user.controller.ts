import { Request, Response } from 'express';
import pool from "../config/db.js";

export const register = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.status(201).json(result.rows[0]); 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}
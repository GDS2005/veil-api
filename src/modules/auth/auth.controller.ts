import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import pool from "../../config/db.js";
import { RequestBody } from "../auth/auth.interface.js"

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;


export const register = async (
    req: Request<{}, {}, RequestBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ error: "Password must be at least 8 characters" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid email format" });
            return;
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            res.status(409).json({ error: "Email already registered" });
            return;
        }

        const hashedPassword = await argon2.hash(password, {
            memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536'),
            timeCost: parseInt(process.env.ARGON2_TIME_COST || '3'),
            parallelism: parseInt(process.env.ARGON2_PARALLELISM || '1'),
        });

        const result = await pool.query(
            `INSERT INTO users (email, password) 
             VALUES ($1, $2) 
             RETURNING id, email`,
            [email.toLowerCase(), hashedPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                email: user.email
            },
            token
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request<{}, {}, RequestBody>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required" });
            return;
        }

        const result = await pool.query(
            "SELECT id, email, password FROM users WHERE email = $1",
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const user = result.rows[0];
        const isValidPassword = await argon2.verify(user.password, password);

        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
        );

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
            },
            token
        });

    } catch (error) {
        next(error);
    }
};
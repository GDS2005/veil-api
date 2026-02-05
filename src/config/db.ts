import mysql from "mysql2/promise"

export function db(){
    try{
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_NAME,
        });

        console.log('Connected to Database: ',process.env.DB_NAME);
    }catch (error) {
        console.error('Error connecting to the database:', error);
    }
}
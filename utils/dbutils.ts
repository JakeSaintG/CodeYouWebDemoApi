import sqlite from 'sqlite3';

export class DbUtils {
    
    public dbContext!: sqlite.Database;
    private createTable: string = `
        CREATE TABLE employees (
            employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            last_name NVARCHAR(20)  NOT NULL,
            first_name NVARCHAR(20)  NOT NULL,
            title NVARCHAR(20),
            address NVARCHAR(100),
            country_code INTEGER
        )
    `;

    constructor() {
        
    }

    public createDbContext = () => {
        this.dbContext = new sqlite.Database('./emp_database.db', (error: Error | null) => {
            if (error) {
                console.error(`Error opening database: ${error.message}`);
            } else {
        
                this.dbContext.run(this.createTable, (err: unknown) => {
                    if (err) {
                        console.log("Table already exists.");
                    }
                    let insert = 'INSERT INTO employees (last_name, first_name, title, address, country_code) VALUES (?,?,?,?,?)';
                    this.dbContext.run(insert, ["Chandan", "Praveen", "SE", "Address 1", 1]);
                    this.dbContext.run(insert, ["Samanta", "Mohim", "SSE", "Address 2", 1]);
                    this.dbContext.run(insert, ["Gupta", "Pinky", "TL", "Address 3", 1]);
                });
            }
        });
    }




}
import "dotenv/config"
import mysql from "mysql2/promise"

const CONFIG = {
    host: process.env.MYSQL_HOST_LOCAL,
    user: process.env.MYSQL_USER_LOCAL,
    password: process.env.MYSQL_PASSWORD_LOCAL,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT_LOCAL,
    ssl: {
        rejectUnauthorized: false
    }
}

export async function getFeedback() {
    const posts = await connection.query(
        `SELECT title, description, category_name category, status, upvotes, COUNT(comments.id) comments
        FROM feedback
        JOIN status ON feedback.status_id = status.id
        JOIN categories ON feedback.category_id = categories.id
        LEFT JOIN comments ON feedback_id = feedback.id
        GROUP BY feedback.id`
    )

    return posts[0]
}

const connection = await mysql.createConnection(CONFIG)
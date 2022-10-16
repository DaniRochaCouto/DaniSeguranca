const { randomUUID } = require('crypto');

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
 
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: 3306,
        user: 'test',
        password: 'test',
        database: 'finalProjectSubst',
        multipleStatements: true
      } );
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function getAllProducts(){
    const conn = await connect();
    
    const query = `SELECT * FROM products LIMIT 1000;`;
    console.log(`Executando a query: ${query}`);
     
    const [rows, fields] = await connection.execute(query);
    //console.log(`Rows: ${JSON.stringify(rows)}`);
    console.log(`message`,rows.length);
    if(rows.length == 0){
        throw {statusCode: 404, message: 'Não há nenhum Produto cadastrado!'};    
    }
    return rows;
}

async function getProductById(id){
    const conn = await connect();
    
    const query = `SELECT * FROM products WHERE id = ?;`;
    
    
    const [rows, fields] = await connection.execute(query, [id]);
    console.log(`Executando query: ${query}`);
    
    return rows;


}


async function updateProductById(id, name, description, value){
    try{
        const conn = await connect();
    
        const query = `UPDATE products SET name = ?, description = ?, value = ? WHERE id = ?;`;
        
        
        const [rows] = await conn.execute(query,[name, description, value, id]);
        
        console.log(`Executando query: ${query}`);
        return rows;
    }catch(err){
        console.log("Retorno SQL: " + JSON.stringify(err));
        throw {code: 500, message: 'Erro inesperado ao tentar cadastrar usuário'};
    }
}

async function deleteProductById(id){
    const conn = await connect();
    
    const query = `DELETE FROM products WHERE id = ?;`;
    console.log(`Executando query: ${query}`);

    await connection.execute(query,[id]);
}

async function insertProduct(name, description, value){
    const conn = await connect();

    const query = `INSERT INTO products(id, name, description, value) VALUES (?, ?, ?, ?);`;
    console.log(`Executando query: ${query}`);

    try{
        await connection.execute(query,[randomUUID(), name, description, value]);
    }catch(err){
        if(err.errno === 1062){
            throw {code: 400, message: 'Já existe um produto cadastrado com este nome!'};
        }else{
            throw {code: 500, message: 'Erro inesperado ao tentar cadastrar o produto'};
        }
    }
}

module.exports = {getProductById, getAllProducts, insertProduct, updateProductById, deleteProductById}

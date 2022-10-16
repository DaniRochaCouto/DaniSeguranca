var http = require('http'); 

const express = require('express') 
const app = express()
const port = 3001

const db = require("./db");

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');
var RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
    windowMs: 15*60*1000,
    max: 40,
    delayMs: 0,
    message: "Too many accounts created from this IP, please try again after an hour"
});
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get('/products', async (req, res, next) => { 
    try{
        var resp = await db.getAllProducts();
        res.status(200).json(resp);
    }catch (err) {
        next(err);
      }
    
    
    
});

app.post('/products', async (req, res, next) => { 

    try{
        var name = req.body.name;
        var description = req.body.description
        var value = req.body.value
        
        await db.insertProduct(name, description, value);
        return res.status(200).json({message: 'Produto cadastrado com sucesso!'});

    }catch(err){
        //return res.status(err.code).json(err);
        next(err);
    }
});


app.get('/products/:id', async (req, res, next) => { 

    try{
        var id = req.params.id;
        const [rows] = await db.getProductById(id);
        if(rows){
            return res.status(200).send(rows);
        }else{
        return res.status(404).send(`Produto ${id} não encontrado!`);
        }
    }catch(err){
       // return res.status(err.code).json(err);
       next(err);
    }
});

app.put('/products/:id', async (req, res, next) => { 

    try{
        var id = req.params.id;

        var name = req.body.name;
        var description = req.body.description
        var value = req.body.value
        
        const rows = await db.updateProductById(id, name, description, value);
        if(rows){
            return res.status(200).send({message: "Produto atualizado com sucesso!"});
        }
        return res.status(404).send(`Produto ${id} não encontrado!`);
    }catch(err){
        //return res.status(err.code).json(err);
        next(err);
    }
});

app.delete('/products/:id', async (req, res, next) => {

    try{
        var id = req.params.id;
        await db.deleteProductById(id);
        return res.status(200).send({message: `Produto ${id} deletado com sucesso!`}); 

    }catch(err){
       // return res.status(err.code).json(err);
       next(err);
    }
});


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.errMessage);
    res.status(statusCode).json({ message: err.message });
  });
  
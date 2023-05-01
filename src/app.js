import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT ||8080;
const server = app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
const io = new Server(server);      //Levanto mi server

app.engine('handlebars',handlebars.engine());   //Creo handlebars como motor de plantillas
app.set('views',`${__dirname}/views`);  //Apunto a la ruta de las vistas
app.set('view engine','handlebars');    //El motor que leerá las vistas es handlebars

app.use(express.json());//Me permite leer jsons en las peticiones.
app.use(express.urlencoded({extended:true})); //Objetos codificados desde URL
app.use(express.static(`${__dirname}/public`)); //permite acceder a imagenes dentro de la ruta

//creo middleware para referenciar mi io
app.use((req,res,next) => {
    req.io = io;
    next();
})

app.use('/api/products', productsRouter); //Cuando llegue la peticion la redirije a usersRouter
app.use('/api/carts', cartsRouter);
app.use('/',viewsRouter);

io.on('connection',socket=>{
    console.log("Socket conectado");
})
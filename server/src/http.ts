import express from "express";
import { createServer } from "http";
import path from "path";
import { Server, Socket } from "socket.io";
import "./database";
import routes from "./routes";

const app = express();

//Indicando o caminho da nossa pasta public onde estará nosso front end para conseguirmos testar nosso socket io
app.use(express.static(path.join(__dirname, "..", "public")));

//Indicando onde estará nossas views
app.set("views", path.join(__dirname, "..", "public"));

/* 
por padrão a engine utilizada pelo node é a ejs, então vamos informar que vamos utilizar o html para rodar nosso html
para que funcione, precisamos instalar a lib ejs no nosso projeto
*/
app.engine("html", require("ejs").renderFile);

//aqui estamos setando nossa view engine
app.set("view engine", "html");

//criando uma rota para testar, dentro dela estamos chamando um render html/client.html que é nosso 'front-end'
app.get("/pages/client", (req, res) => {
  return res.render("html/client.html");
});

const http = createServer(app); //criando protocolo http atribuindo nosso app a ele
const io = new Server(http); // criado protocolo ws do socket io e atribuindo nosso http a ele

io.on("connection", (socket: Socket) => {
  console.log("conectado!", socket.id);
});

app.use(express.json());
app.use(routes);

export { http, io };


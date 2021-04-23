import { http } from "./http";
import "./websocket/client";

//então na hora que damos o listen ele inicia nosso servidor e como ele está recebendo nosso app como parâmetro no createServer ele puxa todas as propriedades que criamos anteriormente
http.listen(3333, () => console.log("server is running on port 3333"));

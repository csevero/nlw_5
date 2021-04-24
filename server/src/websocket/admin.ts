import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  //criando um listener para o evento entre aspas, nesse caso nós além do params passamos também um callback que irá servir para ajudar a gente a repassar dados para quem está emitindo esse evento, então a gente listou todas as mensagens de um user específico e com o callback retornamos essa lista para o ouvinte

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  //estamos criando um listener para ouvir o evento dentro da string, e nesse caso temos que fazer a comunicação não só com o admin enviando uma mensagem como também informamos o usuário que chegou uma nova mensagem do administrador
  socket.on("admin_send_message", async (params) => {
    const { user_id, text } = params;

    await messagesService.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    //Nesse caso usamos o io diretamente pois o socket envia apenas para os usuários que estão conectados, enquanto o io.emit ele vai emitir para todos os admins que estão escutando esse evento
    const { socket_id } = await connectionsService.findByUserId(user_id);

    //aqui usamos o to para definir um cliente específico que tenha o socket id passado como parâmetro e o emit para transmitir um evento para todos os clientes que tiverem esse socket id
    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id,
    });
  });

  socket.on("admin_user_in_support", async (params) => {
    const { user_id } = params;
    await connectionsService.updateAdminID(user_id, socket.id);

    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  });
});

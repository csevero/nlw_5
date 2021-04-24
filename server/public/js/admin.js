const socket = io();
let connectionsUsers = [];
let connectionInSupport = [];

//criando um listener para os eventos com mesmo nome da string
socket.on("admin_list_all_users", (connections) => {
  connectionsUsers = connections;

  //pegando a lista de usuário e usando o innerHTML para conseguirmos manipular o html usando js
  document.getElementById("list_users").innerHTML = "";

  let template = document.getElementById("template").innerHTML;

  //usando o forEach como se fosse um .map, rodando para cada connection ele faz uma ação e monta um componente dentro do template que definimos acima
  connections.forEach((connection) => {
    //Estamos usando uma lib mustache para conseguirmos fazer alterações no front, como se fosse dentro do react onde abrimos {} e conseguimos manipular o html
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    //usando o += no final para que ele adicione todos, sem substituir, se usar apenas um = ele vai substituindo, dessa forma ele vai concatenando os elementos
    document.getElementById("list_users").innerHTML += rendered;
  });
});

//function que está dentro do button de iniciar uma conversa
function call(id) {
  //estamos usando o find (prop que é usada em um array) para encontrarmos o item com id especifico ao que foi clicado
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === id
  );

  connectionInSupport.push(connection);

  //pegando o admin_template que é a tela de chat do admin
  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  //renderizando as telas de mensagem dentro da div supports
  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit("admin_user_in_support", params);

  //emitindo um evento para listar as mensagens pelo usuário, foi o método que usamos o callback para enviar as mensagem para cá
  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );

    messages.forEach((message) => {
      //usando js para criação de elementos(div)
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {
        //adicionando uma className a div criada acima
        createDiv.className = "admin_message_client";

        //adicionando elementos dentro dessa div e passando variáveis dentro dela
        createDiv.innerHTML = `<span>${connection.user.email} </span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;

        //formatando as datas, usando a lib dayjs
        createDiv.innerHTML += `<span class="admin_date">${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}</span>`;
      } else {
        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date>${dayjs(
          message.created_at
        ).format("DD/MM/YYYY HH:mm:ss")}`;
      }

      divMessages.appendChild(createDiv);
    });
  });
}

//pegando a função sendMessage do chat do admin
function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    text: text.value,
    user_id: id,
  };

  //emitindo um event passando os params
  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date>${dayjs().format(
    "DD/MM/YYYY HH:mm:ss"
  )}`;

  divMessages.appendChild(createDiv);

  text.value = "";
}

socket.on("admin_receive_message", (data) => {
  console.log(data);
  const connection = connectionInSupport.find(
    (connection) => connection.socket_id === data.socket_id
  );

  const divMessages = document.getElementById(
    `allMessages${connection.user_id}`
  );

  const createDiv = document.createElement("div");

  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email} </span>`;
  createDiv.innerHTML += `<span>${data.message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date">${dayjs(
    data.message.created_at
  ).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);
});

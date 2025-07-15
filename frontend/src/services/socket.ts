/**
 * Esta função cria e gere a nossa ligação WebSocket nativa.
 */
function createWebSocket() {
  const socketURL = `ws://${window.location.host}/ws`;
  const socket = new WebSocket(socketURL);

  socket.onopen = () => {
    console.log('Ligação WebSocket estabelecida com sucesso via proxy.');
  };

  // --- ADIÇÃO: LÓGICA DE HEARTBEAT ---
  // A função 'onmessage' agora também lida com os pings do servidor.
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'ping') {
        socket.send(JSON.stringify({ type: 'pong' }));
        return; // Não precisa de passar esta mensagem para a store.
      }
    } catch (e) {
      console.error('Mensagem do WebSocket não é um JSON válido:', event.data);
    }
  };

  socket.onclose = () => {
    console.log('Ligação WebSocket fechada.');
  };

  socket.onerror = (error) => {
    console.error('Erro no WebSocket:', error);
  };

  return socket;
}

export const socket = createWebSocket();

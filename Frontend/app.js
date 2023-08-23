// Função para fazer a Instância 2 falar o texto recebido do servidor
function speak(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  speech.lang = 'pt-BR';
  speech.volume = 1; // Volume (0 a 1)
  speech.rate = 1; // Velocidade (0.1 a 10)
  speech.pitch = 1; // Tom de voz (0 a 2)

  window.speechSynthesis.speak(speech);
}

// Função para exibir o conteúdo no console da página
// Função para exibir o conteúdo no console da página
// Restante do código do app.js

// Função para exibir o conteúdo no console da página
function displayConsoleOutput(content) {
  const consoleOutput = document.getElementById('consoleOutput');

  // Se o conteúdo estiver vazio ou nulo, exibe a mensagem "Fale 'Jarvis' para começar"
  if (!content) {
    consoleOutput.innerHTML = 'Fale "Jarvis" para começar';
  } else {
    // Remove a mensagem "Fale 'Jarvis' para começar" caso ela esteja presente
    if (consoleOutput.innerHTML === 'Fale "Jarvis" para começar') {
      consoleOutput.innerHTML = '';
    }

    // Verifica se a mensagem começa com "Resposta da OpenAI:" e adiciona quebra de linha conforme necessário
    if (content.startsWith('Resposta da OpenAI:')) {
      // Adiciona um espaço após "Resposta da OpenAI:" antes de exibir o conteúdo
      const openaiContent = content.substring('Resposta da OpenAI:'.length).trim();
      consoleOutput.innerHTML += `Resposta da OpenAI: ${openaiContent}<br>`;
    } else {
      // Remove qualquer quebra de linha anterior ao adicionar a nova mensagem
      if (consoleOutput.innerHTML.endsWith('<br>')) {
        consoleOutput.innerHTML = consoleOutput.innerHTML.slice(0, -4);
      }
      consoleOutput.innerHTML += `${content}<br>`;
    }
  }

  consoleOutput.scrollTop = consoleOutput.scrollHeight; // Scroll automático para a parte inferior
}

// Restante do código do app.js



// Redirecionar a saída do console para a função displayConsoleOutput
(function () {
  const originalConsoleLog = console.log;
  console.log = function () {
    for (let i = 0; i < arguments.length; i++) {
      if (arguments[i].indexOf('Ouvindo (Instância') === -1 && arguments[i].indexOf('Nada a mostrar (Instância') === -1 && arguments[i].indexOf('Reconhecimento encerrado (Instância') === -1 && arguments[i].indexOf('Reiniciando Instância') === -1) {
        displayConsoleOutput(arguments[i]);
      }
    }
    originalConsoleLog.apply(console, arguments); // Manter o comportamento padrão do console.log
  };
})();

// Função para enviar a transcrição para o servidor usando Fetch API
function sendTranscriptionToServer(transcription) {
  if (!transcription) {
    console.log('Transcrição vazia. Nenhuma requisição será enviada para o servidor.');
    return;
  }

  fetch('https://jarvis-gpt-wheat.vercel.app/processar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ transcript: transcription })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição ao servidor');
    }
    return response.json();
  })
  .then(data => {
    const answer = data.response;
    console.log('Resposta da OpenAI:', answer); // Exibindo a resposta no console
    speak(answer); // Falar a resposta usando a função speak
  })
  .catch(error => {
    console.error('Erro ao enviar transcrição para o servidor:', error);
  });
}

// Instância 1
const recognition1 = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition1.lang = 'pt-BR'; // Defina o idioma adequado

let isListening1 = false; // Variável para controlar se o reconhecimento 1 está ativo

recognition1.addEventListener('start', () => {
  isListening1 = true;
  // console.log('Ouvindo (Instância 1)...'); // Comentado para evitar log indesejado
});

recognition1.addEventListener('end', () => {
  // console.log('Reconhecimento encerrado (Instância 1).'); // Comentado para evitar log indesejado
  if (!isListening2) {
    // console.log('Reiniciando Instância 1...'); // Comentado para evitar log indesejado
    startRecognition1(); // Reinicia o reconhecimento apenas se a Instância 2 não estiver ativa
  }
});

recognition1.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();
  // console.log('Transcrição (Instância 1):', transcript); // Comentado para evitar log indesejado

  if (transcript.toLowerCase() === 'jarvis') {
    // Inicia a segunda instância de reconhecimento de fala somente se a palavra "jarvis" for detectada na primeira instância
    startRecognition2();
    // Responder "como posso ajudar?" na Instância 1
    console.log('Como posso ajudar?'); // Comentado para evitar log indesejado
    speak('Como posso ajudar?');
  }
};

recognition1.onerror = (event) => {
  try {
    if (event.error === 'no-speech') {
      // console.log('Nada a mostrar (Instância 1)...'); // Comentado para evitar log indesejado
    } else {
      console.error('Erro no reconhecimento de fala (Instância 1):', event.error);
    }
  } catch (error) {
    console.error('Erro ao tratar evento de erro (Instância 1):', error);
  }
};

function startRecognition1() {
  try {
    recognition1.start(); // Inicia o reconhecimento de fala automaticamente (Instância 1)
  } catch (error) {
    console.error('Erro ao iniciar reconhecimento (Instância 1):', error);
    isListening1 = false;
    startRecognition1(); // Reinicia a Instância 1 em caso de erro
  }
}

// Instância 2
const recognition2 = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition2.lang = 'pt-BR'; // Defina o idioma adequado

let isListening2 = false; // Variável para controlar se o reconhecimento 2 está ativo

function startRecognition2() {
  try {
    recognition1.stop(); // Para a primeira instância antes de iniciar a segunda
    recognition2.start(); // Inicia o reconhecimento de fala automaticamente (Instância 2)
    isListening2 = true;
    // console.log('Ouvindo (Instância 2)...'); // Comentado para evitar log indesejado
  } catch (error) {
    console.error('Erro ao iniciar reconhecimento (Instância 2):', error);
    isListening2 = false;
    isListening1 = false;
    startRecognition1(); // Reinicia a Instância 1 em caso de erro na Instância 2
  }
}

recognition2.addEventListener('end', () => {
  if (isListening2) {
    // console.log('Reiniciando Instância 2...'); // Comentado para evitar log indesejado
    startRecognition2(); // Reinicia o reconhecimento da Instância 2 em loop
  } else {
    // console.log('Reconhecimento encerrado (Instância 2).'); // Comentado para evitar log indesejado
    // console.log('Reiniciando Instância 1...'); // Comentado para evitar log indesejado
    isListening1 = false;
    startRecognition1(); // Reinicia o reconhecimento da Instância 1 quando a Instância 2 é encerrada
  }
});

recognition2.onresult = (event) => {
  const transcript = event.results[0][0].transcript.trim();
  // console.log('Transcrição (Instância 2):', transcript); // Comentado para evitar log indesejado

  if (transcript.toLowerCase() === 'sair') {
    // console.log('Comando "pare" detectado. Encerrando Instância 2...'); // Comentado para evitar log indesejado
    isListening2 = false;
    recognition2.stop(); // Encerra a Instância 2 quando o comando "pare" é detectado
  } else {
    // Enviar a transcrição para o servidor
    sendTranscriptionToServer(transcript);
  }
};

recognition2.onerror = (event) => {
  console.error('Erro no reconhecimento de fala (Instância 2):', event.error);
};

function startRecognition1() {
  recognition1.start(); // Inicia o reconhecimento de fala automaticamente (Instância 1)
}

startRecognition1(); // Inicia a Instância 1

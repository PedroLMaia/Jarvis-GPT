import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openAIKey = process.env.OPENAI_KEY; // Substitua pela sua chave da API OpenAI

app.use(bodyParser.json());
app.use(cors());

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post('/processar', async (req, res) => {
  const { transcript } = req.body;

  try {
    let response;
    let retryAttempts = 0;
    const maxRetryAttempts = 3;
    const retryDelay = 1000; 

    while (retryAttempts < maxRetryAttempts) {
      try {
        response = await axios.post(
          'https://api.openai.com/v1/engines/text-davinci-003/completions',
          {
            prompt: transcript,
            max_tokens: 50,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openAIKey}`,
            },
          }
        );
        break; 
      } catch (error) {
        if (error.response && error.response.status === 429) {
          retryAttempts++;
          await sleep(retryDelay); 
        } else {
          throw error;
        }
      }
    }

    if (response) {
      const { text } = response.data.choices[0];
      let formattedAnswer = text.trim();

      // Verifique se a resposta formatada contém '\n\n'
      const newLineIndex = formattedAnswer.indexOf('\n\n');
      if (newLineIndex !== -1) {
        // Extraia o texto após '\n\n' (incluindo 2 novas linhas) como resposta
        formattedAnswer = formattedAnswer.slice(newLineIndex + 2).trim();
      }

      // console.log('Resposta da OpenAI:', response.data);
      console.log('Resposta da OpenAI:', formattedAnswer);

      res.json({ response: formattedAnswer });
    } else {
      // Se todas as novas tentativas falharem, envie uma resposta de erro
      res.status(500).json({ response: 'Desculpe, ocorreu um erro ao processar sua solicitação.' });
    }
  } catch (error) {
    console.error('Erro ao chamar a API da OpenAI:', error);
    res.status(500).json({ response: 'Desculpe, ocorreu um erro ao processar sua solicitação.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
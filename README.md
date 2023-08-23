# Jarvis - Seu Assistente Pessoal de IA

![Cap](https://raw.githubusercontent.com/PedroLMaia/Portfolio/main/public/jar.png)

## Descrição
O Jarvis é um assistente de IA inteligente que fornece transcrição de voz para texto e respostas utilizando a API da OpenAI. Com o Jarvis, você pode interagir facilmente com a IA usando sua voz e receber respostas úteis em retorno.

## Instalação BackEnd

Instale as dependências necessárias usando o [npm](https://www.npmjs.com/), entrando na pasta Backend e executando:

```bash
npm install
```
Crie uma conta na openIA e use sua key criando uma arquivo .env e passando nele a sua variavel:

```bash
OPENAI_KEY=sk-EXEMPLO
```

## Uso
Para dar start no server use:

```bash
npm start
```
Para dar start no FrontEnd use:

```bash
Abra o index.html usando a extensão LiveServer.
```

## Como Usar o Jarvis

Quando o servidor estiver rodando, abra o index.html em seu navegador usando o LiveServer

Diga "Jarvis" para acionar o assistente de IA e ouça o prompt, "Como posso ajudar?"

Faça suas perguntas ou forneça comandos, e o Jarvis responderá adequadamente.


## Uso Geral
Transcrição de Voz para Texto: O Jarvis pode converter sua voz em texto para uma interação mais fácil.

Respostas Rápidas: Obtenha respostas instantâneas para suas perguntas e comandos, tornando suas interações mais fluidas.

Configuração Fácil: Basta seguir as instruções na seção "Instalação" para configurar o Jarvis rapidamente.

## Tecnologias Utilizadas
HTML, CSS e JavaScript para a interface do FrontEnd.

Node.js e Express.js para o servidor Backend.

API da OpenAI para processamento de linguagem natural e respostas.

## Informações Úteis
Para economizar recursos a API da OpenAI esta configurada para usar o modelo de linguagem [ text-davinci-003 ], que é mais barato que o [ ChatGPT-3.5 Turbo].

Para trocar o modelo de linguagem, siga a [documentação](https://platform.openai.com/docs/guides/gpt) da OpenAI.
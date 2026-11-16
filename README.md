---
title: PerguntaDev
emoji: 💬
colorFrom: blue
colorTo: green
sdk: static
pinned: false
models:
  - Qwen/Qwen2.5-0.5B-Instruct
---

# PerguntaDev

Assistente experimental de programação em português. O protótipo executa inferência no próprio navegador com Transformers.js e pesos ONNX do `Qwen2.5-0.5B-Instruct`. Usa WebGPU quando disponível e tenta WASM/CPU como alternativa. Não requer servidor de inferência nem chave de API.

## O que demonstra

- Integração de um LLM instrucional pré-existente por Transformers.js.
- Inferência no navegador com um modelo ONNX quantizado em 4 bits.
- Construção de prompt de sistema e manutenção de histórico recente.
- Interface web responsiva em HTML, CSS e JavaScript.

Este projeto não treinou nem ajustou o modelo. O código configura a inferência e a interface; os pesos são baixados do Hugging Face pelo navegador e podem ocupar centenas de megabytes. O tempo de carga e a velocidade dependem do dispositivo. WebGPU ainda apresenta diferenças entre navegadores; WASM/CPU pode ser mais lento.

## Modelo

O projeto usa os pesos ONNX do [Qwen2.5-0.5B-Instruct](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct), adaptados para Transformers.js. O modelo base é [Qwen2.5-0.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct), com licença Apache 2.0 e suporte multilíngue que inclui português. Consulte os model cards para detalhes e limitações.

## Executar localmente

Sirva os arquivos com um servidor HTTP local, pois módulos ES não funcionam de forma confiável ao abrir o HTML diretamente como `file://`:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. O primeiro carregamento baixa o modelo. Use um navegador com suporte a WebGPU para melhor desempenho; se não estiver disponível, a aplicação tenta WASM/CPU.

## Publicar no Hugging Face Spaces

Crie um Space público com SDK **Static** e envie `index.html`, `app.js`, `styles.css` e este `README.md`. Static Spaces são hospedados sem precisar de uma instância Gradio/Docker com compute.

## Limitações

Este é um protótipo educacional. O modelo tem 0,5 bilhão de parâmetros e pode cometer erros, gerar explicações incompletas ou produzir código inseguro. Revise as respostas e execute código apenas em ambiente apropriado. As mensagens da conversa permanecem no navegador; o modelo e a biblioteca são baixados de fontes públicas do Hugging Face e CDNjs.

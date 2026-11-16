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

Assistente experimental de programação em português. Integra Transformers.js e os pesos ONNX do Qwen2.5-0.5B-Instruct para executar inferência localmente no navegador. Usa WebGPU quando disponível e tenta WASM/CPU como alternativa; não requer servidor de inferência ou chave de API.

## Demonstração

Experimente no [Hugging Face Spaces](https://huggingface.co/spaces/sauloengineer/perguntadev).

## Funcionalidades e implementação

- Interface web em HTML, CSS e JavaScript.
- Modelo ONNX quantizado em 4 bits, carregado com Transformers.js.
- Seleção de WebGPU com fallback para WASM/CPU.
- Prompt de sistema em português e manutenção de histórico recente.
- Configuração de parâmetros para geração de respostas.
- Testes locais comparativos de inicialização do modelo e geração de texto em WebGPU e WASM/CPU. O desempenho varia conforme dispositivo, navegador e cache.

## Modelo

A integração usa os pesos ONNX do [Qwen2.5-0.5B-Instruct da onnx-community](https://huggingface.co/onnx-community/Qwen2.5-0.5B-Instruct), preparados para Transformers.js. O modelo base é [Qwen2.5-0.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct), com licença Apache 2.0 e suporte multilíngue que inclui português.

## Executar localmente

Sirva os arquivos com um servidor HTTP local, pois módulos ES não funcionam de forma confiável ao abrir HTML diretamente como `file://`:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. O primeiro carregamento baixa os pesos do modelo, que podem ocupar centenas de megabytes.

## Limitações

Protótipo educacional. O modelo pode cometer erros, gerar explicações incompletas ou produzir código inseguro. Revise as respostas e execute código apenas em ambiente apropriado. O histórico da conversa permanece no navegador; o modelo e a biblioteca são baixados de fontes públicas do Hugging Face e CDNjs.

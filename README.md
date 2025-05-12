# Flow Editor - Editor de Fluxos de Automação

Um editor visual de fluxos de automação desenvolvido com Next.js, React Flow e Shadcn UI, permitindo a criação e gerenciamento de fluxos de automação para WhatsApp e Assistentes Virtuais.

## 🚀 Tecnologias

- Next.js
- React Flow
- Shadcn UI
- Zustand (Gerenciamento de Estado)
- TypeScript
- Axios

## 📋 Funcionalidades

- Editor visual de fluxos com drag-and-drop
- Suporte a diferentes tipos de nós (início, fim, ação, condição, webhook)
- Integração com WhatsApp e OpenAI
- Autosave automático
- Editor de JSON do fluxo
- Painel de configuração de nós
- CRUD completo de fluxos
- Input e OutPut para troca de dados entre nós

## 🏗️ Estrutura do Projeto

```
src/
  ├── components/     # Componentes React
  ├── lib/           # Utilitários e configurações
  ├── store/         # Gerenciamento de estado (Zustand)
  ├── types/         # Definições de tipos TypeScript
  └── pages/         # Páginas da aplicação
```

## 🔄 Estrutura de Dados

### Flow (Fluxo)

```json
{
  "id": "flow-123",
  "attributes": {
    "name": "Fluxo de Vendas WhatsApp",
    "status": "draft",
    "data": {
      "nodes": [...],
      "edges": [...]
    }
  }
}
```

### Nodes (Nós)

#### Nó de Início
```json
{
  "id": "node-1",
  "type": "trigger",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Início",
    "type": "init",
    "input": "",
    "output": ""
  }
}
```

#### Nó de WhatsApp
```json
{
  "id": "node-2",
  "type": "action",
  "position": { "x": 300, "y": 100 },
  "data": {
    "label": "Enviar Mensagem",
    "type": "whatsapp",
    "config": {
      "action": "send_message | receive_message",
      "input": "",
      "output": ""
    }
  }
}
```

#### Nó de OpenAI
```json
{
  "id": "node-3",
  "type": "action",
  "position": { "x": 500, "y": 100 },
  "data": {
    "label": "Assistente Virtual",
    "type": "openai",
    "config": {
      "model": "gpt-4",
      "memory": "redis | mysql",
      "action": "response_with_text | response_with_audio | generate_image",
      "baseScript": "Seja um Assistente",
      "credentials": "url",
      "input": "",
      "output": ""
    }
  }
}
```

#### Nó de Condição
```json
{
  "id": "node-4",
  "type": "condition",
  "position": { "x": 700, "y": 100 },
  "data": {
    "input": "",
    "label": "Condição",
    "output": "",
    "operator": "==",
    "firstValue": "1",
    "secondValue": "1",
    "firstValueType": "value"
  }
}
```

#### Nó de Delay
```json
{
  "id": "node-5",
  "type": "delay",
  "position": { "x": 900, "y": 100 },
  "data": {
    "label": "Aguardar 5 minutos",
    "input": "",
    "output": "",
    "config": {
      "seconds": 1
    }
  }
}
```

### Edges (Conexões)
```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "type": "smoothstep",
  "animated": true
}
```

### Condition Edges (Conexões)
```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "type": "smoothstep",
  "animated": true,
  "data": {
    "condition": "true | false"
  }
}
```

## 🚀 Como Executar

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Execute o projeto
```bash
npm run dev
```

4. Acesse `http://localhost:3000`

## 📝 Notas de Desenvolvimento

- O projeto utiliza autosave com debounce de 2 segundos
- As atualizações são feitas primeiro localmente e depois sincronizadas com a API
- Todos os componentes são tipados com TypeScript
- O estado é gerenciado com Zustand para melhor performance

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

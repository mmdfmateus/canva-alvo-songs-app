# 🚀 Guia de Publicação do App Canva - Alvo Songs

Este guia explica passo a passo como publicar seu app Canva e torná-lo acessível aos usuários do Canva.

## 📋 Pré-requisitos

Antes de começar, certifique-se de que:

- ✅ O app está funcionando corretamente em desenvolvimento
- ✅ Você tem uma conta no [Canva Developer Portal](https://www.canva.com/developers/apps)
- ✅ O app foi criado com distribuição **pública** (não pode ser alterado depois)

## 📝 Checklist Antes da Submissão

### 1. Preparação do Código

- [ ] **Build de produção**: Execute `npm run build` para gerar o bundle
- [ ] **Testes**: Execute `npm test` e verifique se tudo está funcionando
- [ ] **Linting**: Execute `npm run lint` e corrija todos os erros
- [ ] **Type checking**: Execute `npm run lint:types` para verificar tipos TypeScript

### 2. Conteúdo do App

- [ ] **Dados**: Adicione todas as músicas necessárias ao `songs.json`
- [ ] **Funcionalidades**: Teste todas as funcionalidades principais
- [ ] **Tratamento de erros**: Verifique se os erros são tratados adequadamente
- [ ] **Acessibilidade**: Certifique-se de que o app segue as diretrizes de acessibilidade

### 3. Assets Visuais

Você precisará criar e preparar:

- [ ] **Ícone do App**: 512x512 pixels (PNG)
- [ ] **Imagem em destaque**: 1920x1080 pixels (PNG ou JPG)
- [ ] **Screenshots**: Pelo menos 3-5 screenshots do app em uso

### 4. Textos e Descrições

Prepare os seguintes textos:

- [ ] **Nome do App**: Nome curto e descritivo
- [ ] **Descrição curta**: 1-2 frases sobre o que o app faz
- [ ] **Descrição completa**: Explicação detalhada das funcionalidades
- [ ] **Benefícios**: Lista de benefícios para os usuários
- [ ] **Instruções de uso**: Como usar o app

## 🔨 Passo 1: Gerar o Bundle de Produção

1. Abra o terminal no diretório do projeto
2. Execute o comando de build:

```bash
npm run build
```

Isso criará uma pasta `dist/` com o código compilado e otimizado para produção.

**Importante**: O bundle gerado é o que será enviado para o Canva. Certifique-se de que está funcionando corretamente.

## 🌐 Passo 2: Acessar o Developer Portal

1. Acesse [https://www.canva.com/developers/apps](https://www.canva.com/developers/apps)
2. Faça login com sua conta Canva
3. Selecione seu app "alvo-songs" (ou o nome que você deu ao app)

## 📤 Passo 3: Fazer Upload do Código

1. No Developer Portal, vá para a seção **"Code upload"**
2. Na seção **"App source"**, clique em **"Upload"** ou **"Choose file"**
3. Selecione o arquivo ZIP do bundle gerado na pasta `dist/`
4. Aguarde o upload ser concluído

**⚠️ IMPORTANTE**: Antes de fazer o upload, certifique-se de:

- Remover ou limpar a **Development URL** (se houver)
- O app não deve apontar para `localhost:8080` em produção

## 🎨 Passo 4: Configurar o App Listing

Vá para a seção **"App listing details"** e preencha:

### Informações Básicas

- **Nome do App**: Ex: "Alvo Songs - Letras Automáticas"
- **Descrição curta**: Ex: "Crie slides com letras de músicas automaticamente"
- **Descrição completa**: Descreva todas as funcionalidades

### Assets Visuais

1. **Ícone do App** (512x512px):
   - Deve representar visualmente o propósito do app
   - Use cores vibrantes e design claro

2. **Imagem em Destaque** (1920x1080px):
   - Mostre o app em ação
   - Inclua screenshots ou mockups

3. **Screenshots**:
   - Mostre a interface do app
   - Demonstre o processo de criação de slides
   - Mostre o resultado final

### Categorias e Tags

- Selecione categorias relevantes (ex: "Productivity", "Design Tools")
- Adicione tags que ajudem os usuários a encontrar seu app

## 📋 Passo 5: Instruções de Teste (se necessário)

Se seu app requer autenticação ou credenciais especiais:

1. Vá para a seção **"Testing instructions"**
2. Forneça:
   - Credenciais de teste (se aplicável)
   - Instruções sobre como testar o app
   - Informações sobre integrações com plataformas de terceiros

**Nota**: Seu app não requer autenticação externa, então esta etapa pode não ser necessária.

## ✅ Passo 6: Submeter para Revisão

1. Vá para a seção **"Submit app"** ou **"App status"**
2. Leia e aceite os **Termos e Condições** do Canva Developer
3. Clique em **"Submit app"**

### O que acontece depois?

- ✅ O app será adicionado à fila de revisão do Canva
- ✅ Um ticket do Jira Service Desk será criado para acompanhar o progresso
- ✅ A equipe do Canva revisará seu app
- ✅ Você receberá atualizações via email e pelo ticket

## ⏱️ Tempo de Revisão

O processo de revisão geralmente leva:

- **Primeira revisão**: 5-10 dias úteis
- **Revisões subsequentes**: 3-5 dias úteis (se houver solicitações de mudanças)

## 🔄 Após a Aprovação

Quando seu app for aprovado:

1. **Status mudará para "Approved"**
2. Você poderá **"Release"** (liberar) o app
3. O app ficará disponível no **Apps Marketplace** do Canva
4. Usuários poderão encontrar e instalar seu app

## 🛠️ Comandos Úteis

```bash
# Build de produção
npm run build

# Verificar tipos TypeScript
npm run lint:types

# Verificar linting
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint:fix

# Formatar código
npm run format

# Executar testes
npm test
```

## 📚 Recursos Adicionais

- [Documentação de Submissão de Apps](https://www.canva.dev/docs/apps/submitting-apps)
- [Checklist de Submissão](https://www.canva.dev/docs/apps/submission-checklist)
- [Processo de Revisão](https://www.canva.dev/docs/apps/app-review-process)
- [Diretrizes de App Listing](https://www.canva.dev/docs/apps/app-listing-guidelines)
- [Developer Portal](https://www.canva.com/developers/apps)

## ❓ Problemas Comuns

### O upload falha

- Verifique se o arquivo ZIP não está corrompido
- Certifique-se de que o bundle foi gerado corretamente
- Tente gerar um novo bundle

### O app não aparece no preview

- Verifique se a Development URL foi removida
- Certifique-se de que o bundle foi enviado corretamente
- Aguarde alguns minutos para o processamento

### A revisão foi rejeitada

- Leia os comentários da equipe de revisão
- Faça as correções necessárias
- Reenvie o app após corrigir os problemas

## 🎯 Dicas para Sucesso

1. **Teste extensivamente**: Teste o app em diferentes cenários antes de submeter
2. **Documentação clara**: Forneça descrições claras e detalhadas
3. **Assets de qualidade**: Use imagens de alta qualidade para o listing
4. **Siga as diretrizes**: Certifique-se de seguir todas as diretrizes do Canva
5. **Seja paciente**: O processo de revisão pode levar tempo

## 📞 Suporte

Se você tiver problemas durante o processo de publicação:

- **Documentação**: [canva.dev/docs](https://www.canva.dev/docs)
- **Comunidade**: [community.canva.dev](https://community.canva.dev)
- **Suporte**: Através do ticket do Jira Service Desk criado durante a submissão

---

**Boa sorte com a publicação do seu app! 🚀**



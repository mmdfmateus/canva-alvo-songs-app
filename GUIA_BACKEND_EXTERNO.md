# 🌐 Guia: Hospedando Songs.json em Backend Externo

Este guia explica como hospedar o arquivo `songs.json` em um servidor externo (S3, API, CDN) para poder atualizá-lo sem precisar submeter uma nova versão do app no Canva.

## ✅ Vantagens

- ✅ **Atualizações instantâneas**: Adicione novas músicas sem reenviar o app
- ✅ **Sem revisão do Canva**: Mudanças nos dados não requerem nova submissão
- ✅ **Escalabilidade**: Pode hospedar milhares de músicas sem aumentar o tamanho do bundle
- ✅ **Cache inteligente**: O app cacheia os dados para melhor performance
- ✅ **Fallback local**: Se o servidor externo falhar, usa dados locais como backup

## 🏗️ Arquitetura

```
┌─────────────┐
│  Canva App  │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────────┐
│  Servidor Externo│
│  (S3/API/CDN)   │
│  songs.json     │
└─────────────────┘
       │
       │ (fallback se falhar)
       ▼
┌─────────────┐
│ Local JSON  │
│ (bundle)    │
└─────────────┘
```

## 📦 Opções de Hospedagem

### 1. Amazon S3 (Recomendado)

**Vantagens:**

- ✅ Muito confiável e escalável
- ✅ Baixo custo (quase grátis para pequenos volumes)
- ✅ Fácil de configurar
- ✅ Suporta CORS

**Passos:**

1. **Criar bucket no S3:**

   ```bash
   # Via AWS CLI
   aws s3 mb s3://seu-bucket-songs
   ```

2. **Configurar CORS no bucket:**

   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Fazer upload do songs.json:**

   ```bash
   aws s3 cp src/data/songs.json s3://seu-bucket-songs/songs.json \
     --content-type "application/json" \
     --acl public-read
   ```

4. **URL pública:**
   ```
   https://seu-bucket-songs.s3.amazonaws.com/songs.json
   ```

### 2. Cloudflare R2 (Alternativa ao S3)

**Vantagens:**

- ✅ Compatível com S3 API
- ✅ Sem taxas de egress (download)
- ✅ Fácil integração

### 3. GitHub Pages / Raw GitHub

**Vantagens:**

- ✅ Grátis
- ✅ Fácil de atualizar (git push)
- ✅ CDN automático

**URL:**

```
https://raw.githubusercontent.com/seu-usuario/seu-repo/main/songs.json
```

**Limitações:**

- ⚠️ Rate limiting (60 requests/hora por IP)
- ⚠️ Não recomendado para produção com muitos usuários

### 4. API Backend Próprio

**Vantagens:**

- ✅ Controle total
- ✅ Pode adicionar autenticação
- ✅ Pode adicionar lógica customizada

**Exemplo com Express.js:**

```javascript
// server.js
const express = require("express");
const app = express();

app.get("/api/songs", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.sendFile(__dirname + "/songs.json");
});

app.listen(3000);
```

### 5. Vercel / Netlify (Static Hosting)

**Vantagens:**

- ✅ Grátis para projetos pequenos
- ✅ CDN global
- ✅ Fácil deploy

## 🔧 Implementação no App

O código já foi implementado! Veja como usar:

### Configuração Básica

No arquivo `src/intents/design_editor/app.tsx`, o app já está configurado para usar o loader externo:

```typescript
import { loadSongs } from "../../utils/songsLoader";

// No componente:
const [songs, setSongs] = useState<Song[]>([]);
const [isLoadingSongs, setIsLoadingSongs] = useState(true);

useEffect(() => {
  loadSongs({
    songsUrl: "https://seu-bucket.s3.amazonaws.com/songs.json",
    cacheDurationMs: 5 * 60 * 1000, // 5 minutos
    enableCache: true,
  })
    .then((loadedSongs) => {
      setSongs(loadedSongs);
      setIsLoadingSongs(false);
    })
    .catch((error) => {
      console.error("Error loading songs:", error);
      setIsLoadingSongs(false);
      // Fallback para dados locais já acontece automaticamente
    });
}, []);
```

### Configuração via Variável de Ambiente

Para facilitar, você pode usar uma variável de ambiente:

1. **Criar arquivo `.env`:**

   ```env
   CANVA_SONGS_URL=https://seu-bucket.s3.amazonaws.com/songs.json
   CANVA_SONGS_CACHE_DURATION=300000
   ```

2. **No código:**

   ```typescript
   const songsUrl = process.env.CANVA_SONGS_URL;
   const cacheDuration = parseInt(
     process.env.CANVA_SONGS_CACHE_DURATION || "300000",
   );

   loadSongs({
     songsUrl,
     cacheDurationMs: cacheDuration,
   });
   ```

**⚠️ IMPORTANTE**: Variáveis de ambiente no Canva Apps funcionam apenas em desenvolvimento. Para produção, você precisa:

- **Opção 1**: Hardcode a URL no código (não ideal, mas funciona)
- **Opção 2**: Usar um backend que retorna a URL configurada
- **Opção 3**: Usar a URL do Developer Portal (se suportado)

## 🔒 Segurança e CORS

### Configuração CORS (S3)

Se usar S3, configure CORS no bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://*.canva-apps.com", "https://*.canva.com"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

### Autenticação (Opcional)

Se quiser proteger o acesso:

```typescript
// Com API Key
const response = await fetch(url, {
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

// Com query parameter
const response = await fetch(`${url}?apiKey=${API_KEY}`);
```

**⚠️ ATENÇÃO**: Não coloque chaves secretas no código do app! Use:

- Variáveis de ambiente (dev)
- Backend proxy (produção)
- Signed URLs (S3)

## 📊 Cache e Performance

O loader implementa cache automático:

- **Cache em memória**: Dados ficam em cache por 5 minutos (configurável)
- **Fallback local**: Se o servidor externo falhar, usa dados locais
- **Validação**: Verifica se os dados são válidos antes de usar

### Ajustar Cache

```typescript
loadSongs({
  songsUrl: "https://...",
  cacheDurationMs: 10 * 60 * 1000, // 10 minutos
  enableCache: true,
});
```

### Limpar Cache Manualmente

```typescript
import { clearSongsCache } from "../../utils/songsLoader";

// Limpar cache (útil para testes)
clearSongsCache();
```

## 🧪 Testando

### 1. Teste Local

```bash
# Iniciar servidor local para testar
python -m http.server 8000

# Acessar: http://localhost:8000/songs.json
```

### 2. Teste com S3

```bash
# Upload
aws s3 cp src/data/songs.json s3://seu-bucket/songs.json --acl public-read

# Testar URL
curl https://seu-bucket.s3.amazonaws.com/songs.json
```

### 3. Verificar no App

1. Abra o DevTools do navegador
2. Vá para a aba Network
3. Procure pela requisição para `songs.json`
4. Verifique se retorna 200 OK

## 🔄 Atualizando Dados

### Processo de Atualização

1. **Editar songs.json localmente**
2. **Fazer upload para S3:**
   ```bash
   aws s3 cp src/data/songs.json s3://seu-bucket/songs.json \
     --content-type "application/json" \
     --acl public-read
   ```
3. **Invalidar cache (opcional):**
   - Os usuários verão os novos dados após o cache expirar (5 min)
   - Ou limpe o cache no app se necessário

### Automatizar com CI/CD

**GitHub Actions exemplo:**

```yaml
name: Update Songs
on:
  push:
    paths:
      - "src/data/songs.json"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Upload to S3
        run: |
          aws s3 cp src/data/songs.json s3://seu-bucket/songs.json \
            --content-type "application/json" \
            --acl public-read
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 📝 Checklist de Implementação

- [ ] Escolher serviço de hospedagem (S3 recomendado)
- [ ] Configurar CORS no servidor
- [ ] Fazer upload do `songs.json` inicial
- [ ] Testar URL pública (deve retornar JSON válido)
- [ ] Atualizar código do app com a URL
- [ ] Testar no app Canva (dev)
- [ ] Verificar fallback local funciona
- [ ] Testar cache e performance
- [ ] Documentar processo de atualização

## 🚨 Troubleshooting

### Erro: "Failed to fetch songs"

**Causas possíveis:**

- ❌ CORS não configurado
- ❌ URL incorreta
- ❌ Servidor offline
- ❌ Formato JSON inválido

**Solução:**

- Verifique CORS no servidor
- Teste a URL no navegador
- Verifique console do navegador para erros detalhados
- O app deve usar fallback local automaticamente

### Cache não atualiza

**Solução:**

- Aguarde o cache expirar (5 min padrão)
- Ou reduza `cacheDurationMs`
- Ou limpe cache manualmente: `clearSongsCache()`

### Dados não aparecem

**Verifique:**

- ✅ Formato JSON válido
- ✅ Array no topo: `[{...}, {...}]`
- ✅ Campos obrigatórios: `id`, `title`, `lyrics`
- ✅ `lyrics` é um array de strings

## 📚 Recursos Adicionais

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CORS Configuration](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Canva Apps - Using Backend](https://www.canva.dev/docs/apps/using-backend)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Pronto! Agora você pode atualizar suas músicas sem precisar reenviar o app! 🎉**


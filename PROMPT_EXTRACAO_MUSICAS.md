# Prompt para Extração de Músicas do PDF

## Instruções

Você precisa extrair músicas de um PDF que contém slides de letras de músicas e convertê-las para o formato JSON usado neste projeto.

## Formato JSON Esperado

O arquivo deve ser um array de objetos, onde cada objeto representa uma música com a seguinte estrutura:

```json
{
    "id": "número_sequencial_como_string",
    "title": "Título da Música",
    "artist": "Nome do Artista ou string vazia",
    "lyrics": [
        "Linha 1 da letra",
        "Linha 2 da letra",
        "",
        "Linha 3 da letra",
        ...
    ]
}
```

## Regras de Extração

### 1. Identificação de Músicas

- **Slides de Título**: Slides que contêm apenas um título (geralmente com fundo colorido e ícone musical) indicam o início de uma nova música. Use o texto desse slide como `title`.
- **Slides de Letras**: Slides que contêm letras da música fazem parte da música identificada pelo último slide de título encontrado.
- **Mudança de Música**: Quando encontrar um novo slide de título, comece uma nova entrada no JSON.

### 2. Campo `id`

- Use números sequenciais começando de "1", "2", "3", etc.
- Sempre como string (entre aspas).

### 3. Campo `title`

- Se houver um slide de título (ex: "Salmo 108"), use esse texto como título.
- Caso contrário, use a primeira linha significativa da letra como título.
- Remova indicadores de repetição como `[2x]`, `[4x]` do título.

### 4. Campo `artist`

- Se o artista estiver explicitamente mencionado no slide, use esse valor.
- **IMPORTANTE**: Se o artista não for reconhecido ou não estiver presente, use uma **string vazia** `""`.
- Não use o logo "Alvo DIL" como artista a menos que seja explicitamente mencionado como artista nos slides.

### 5. Campo `lyrics`

- Cada linha de letra deve ser um elemento separado no array.
- **Preserve espaçamentos**: Use strings vazias `""` para representar linhas em branco entre versos ou seções.
- **Tratamento de Repetições**:
  - Quando encontrar indicadores como `[2x]` ou `[4x]` no final de uma linha, você pode:
    - Opção 1: Repetir a linha o número de vezes indicado (recomendado para melhor legibilidade)
    - Opção 2: Manter a linha uma vez com o indicador `[2x]` ou `[4x]` no texto
  - Para parênteses com repetições como "(despertai, saltério)", mantenha o texto entre parênteses como parte da linha.
- **Remover elementos do rodapé**:
  - Ignore o rodapé cinza que contém informações como "SALMO 108" e o logo "Alvo DIL".
  - Esses elementos não fazem parte da letra da música.
- **Limpeza de texto**:
  - Remova espaços extras no início e fim de cada linha.
  - Mantenha a capitalização original.

### 6. Estrutura das Letras

- Organize as letras mantendo a ordem dos slides.
- Se uma música se estende por múltiplos slides, combine todas as linhas em sequência.
- Preserve a estrutura de versos usando linhas vazias quando apropriado.

## Exemplo de Saída

Baseado no slide 199 do PDF fornecido, uma entrada seria:

```json
{
  "id": "1",
  "title": "Salmo 108",
  "artist": "",
  "lyrics": [
    "Firme está o meu coração, oh Deus",
    "Cantarei, entoarei louvores",
    "De toda minh'alma",
    "De toda minh'alma",
    "",
    "Despertai, saltério (despertai, saltério)",
    "Despertai, oh harpa (despertai, oh harpa)",
    "Despertai, oh harpa (despertai, oh harpa)",
    "",
    "Quero acordar a alva",
    "Quero acordar a alva",
    "Quero acordar a alva",
    "Quero acordar a alva"
  ]
}
```

## Checklist de Validação

Antes de finalizar, verifique:

- [ ] Todos os objetos têm os campos `id`, `title`, `artist`, `lyrics`
- [ ] Os IDs são sequenciais e únicos
- [ ] O campo `artist` é string vazia quando não identificado
- [ ] O array `lyrics` contém todas as linhas da música
- [ ] Linhas em branco são representadas por strings vazias `""`
- [ ] Elementos do rodapé foram removidos
- [ ] O JSON está bem formatado e válido
- [ ] Todas as músicas do PDF foram extraídas

## Observações Especiais

- Slides que são apenas títulos (como o slide 198) devem ser usados para identificar o título da música, mas suas linhas não devem aparecer no array `lyrics`.
- Se uma música tiver múltiplos slides de letras, combine-os em uma única entrada.
- Mantenha a ordem cronológica das músicas conforme aparecem no PDF.


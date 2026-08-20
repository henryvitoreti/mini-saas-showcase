# Case: composables de formulário

<span class="status-label status--implemented">Implementado</span>

## 1. Contexto

Clientes, tenants e roles possuem formulários com criação, edição, diferentes
payloads e erros de validação associados aos campos.

Grande parte desses comportamentos se repete entre entidades.

## 2. Problema

Sem uma base compartilhada, cada formulário precisaria reimplementar:

- estado do campo;
- labels e mensagens;
- preenchimento na edição;
- construção do payload;
- suporte a chaves aninhadas;
- associação de respostas 422;
- tratamento comum de erros.

## 3. Decisão técnica

<code>useBaseForm()</code> recebe um conjunto reativo de attributes e concentra
operações comuns.

Cada composable de entidade declara sua própria estrutura, utiliza seu Service e
adiciona somente regras específicas do domínio.

Os inputs permanecem focados na apresentação e não precisam conhecer o contrato
HTTP da API.

## 4. Funcionamento

~~~mermaid
flowchart LR
  Page --> Fields["Componente fields"]
  Fields --> Entity["useCustomerForm"]
  Entity --> Base["useBaseForm"]
  Entity --> Service["CustomerService"]
  Base --> Attributes["attributes reativos"]
  Attributes --> Inputs["AppTextInput etc."]
  Service --> API
  API -. 422 .-> Base
  Base --> Errors["attribute.errorMessage"]
~~~

## 5. Trechos selecionados de código

### Centralização dos attributes

<p class="code-origin">Arquivo privado: <code>frontend/app/composables/forms/CustomerFormComposable.ts</code></p>

~~~ts
const attributes = reactive<CustomerFormAttributes>({
  name: {
    responseKey: 'name',
    payloadKey: 'name',
    value: null,
    label: 'Nome',
    required: true,
    errorMessage: null,
  },
  email: {
    responseKey: 'email',
    payloadKey: 'email',
    value: null,
    label: 'E-mail',
    required: true,
    errorMessage: null,
  },
  isActive: {
    responseKey: 'is_active',
    payloadKey: 'is_active',
    value: true,
    label: 'Ativo',
    required: true,
    errorMessage: null,
  },

  // Trecho omitido para demonstração
});
~~~

<code>responseKey</code> identifica a propriedade recebida da API,
<code>payloadKey</code> define a estrutura enviada e
<code>errorMessage</code> conecta a validação retornada ao input correspondente.

### Preenchimento na edição

<p class="code-origin">Arquivo privado: <code>frontend/app/composables/forms/BaseFormComposable.ts</code></p>

~~~ts
function fillAttributes(data: Record<string, unknown>): void {
  for (const attributeKey in attributes) {
    const attribute = attributes[attributeKey];

    attribute.value = data[attribute.responseKey] ?? null;
    attribute.errorMessage = null;
  }
}
~~~

### Montagem do payload

<p class="code-origin">Arquivo privado: <code>frontend/app/composables/forms/BaseFormComposable.ts</code></p>

~~~ts
function handleDoSendAttributes(formatter?: FormPayloadFormatter): FormPayload {
  const payload: FormPayload = {};

  for (const attributeKey in attributes) {
    const attribute = attributes[attributeKey];

    setPayloadValue(payload, attribute.payloadKey, normalizePayloadValue(attribute.value));
  }

  if (formatter) {
    return formatter(payload);
  }

  return payload;
}
~~~

<code>setPayloadValue()</code> interpreta chaves separadas por ponto e constrói
objetos aninhados.

Isso permite reutilizar o mesmo mecanismo em estruturas como
<code>company</code> e <code>user</code> no cadastro de um tenant.

### Associação de erros 422

<p class="code-origin">Arquivo privado: <code>frontend/app/composables/forms/BaseFormComposable.ts</code></p>

~~~ts
if ((status === 422 && data?.errors) || error?.name === 'ApiValidationError') {
  clearErrors();

  for (const attributeKey in attributes) {
    const attribute = attributes[attributeKey];
    const validationMessage = validationErrors?.[attribute.payloadKey] ?? null;
    const errorMessage = Array.isArray(validationMessage)
            ? validationMessage[0] ?? null
            : validationMessage;

    attribute.errorMessage = typeof errorMessage === 'string' ? errorMessage : null;
  }

  return;
}
~~~

### Base versus entidade

<p class="code-origin">Arquivo privado: <code>frontend/app/composables/forms/CustomerFormComposable.ts</code></p>

~~~ts
async function load(id: number): Promise<Customer|null> {
  let response: Customer|null = null;

  try {
    response = await CustomerService.show(id);
    baseForm.fillAttributes(response);
    syncCustomerTypeAttributes();
  } catch (error) {
    baseForm.handleError(error, 'Ocorreu um erro inesperado ao buscar cliente.');
  }

  return response;
}
~~~

O composable de clientes acrescenta comportamentos específicos, como adaptação
de máscara e labels conforme o tipo do cliente e integração com consulta de
endereço.

Outros domínios reutilizam a mesma base e adicionam suas próprias transformações.

### Responsabilidade do input

<p class="code-origin">Arquivo privado: <code>frontend/app/components/customers/fields.vue</code></p>

~~~vue
<AppTextInput
        name="name"
        :label="attributes.name.label"
        :required="attributes.name.required"
        v-model:value="attributes.name.value"
        :error-message="attributes.name.errorMessage"
/>
~~~

O componente recebe estado e configuração do campo, enquanto a validação
definitiva continua sendo responsabilidade da API.

O atributo <code>required</code> também é utilizado para comunicação visual e
acessibilidade, sem duplicar no navegador todas as regras do backend.

## 6. Como o código é utilizado

O fluxo comum é:

1. a Page utiliza o componente de fields;
2. o componente instancia o composable da entidade;
3. em edição, <code>load(id)</code> preenche os attributes;
4. no submit, a base gera o payload;
5. o Service envia os dados;
6. erros 422 retornam para os respectivos attributes.

Dessa forma, criação e edição compartilham o mesmo contrato de campos.

## 7. Resultado

- Estado dos campos centralizado.
- Menos repetição entre criação e edição.
- Payloads aninhados construídos pela mesma infraestrutura.
- Erros da API apresentados próximos ao campo correspondente.
- Inputs permanecem desacoplados da comunicação HTTP.
- Cada entidade continua podendo adicionar comportamento próprio.

## 8. Trade-offs atuais

- <code>responseKey</code> trabalha atualmente com propriedades de primeiro
  nível.
- Erros 422 dependem da correspondência entre a chave retornada pela API e
  <code>payloadKey</code>.
- Estruturas como arrays de permissões exigem tratamento específico do
  composable de domínio.
- A infraestrutura ainda não possui cobertura automatizada dedicada.
- Integrações externas podem precisar de feedback específico além do tratamento
  padrão do formulário.

## 9. Evoluções previstas

- Suporte a leitura de respostas aninhadas caso novos formulários exijam.
- Adapters específicos para erros de coleções e arrays.
- Testes de preenchimento, payload e associação de erros.
- Padronização de feedback de falhas em serviços externos.
- Inclusão na base apenas de novos estados que se mostrarem realmente
  compartilhados entre formulários.
# 🚗 Rota Certa — Frontend Angular

Aplicação web desenvolvida em **Angular** para gerenciamento e acompanhamento de rotas, pessoas, empresas e informações relacionadas à operação do sistema **Rota Certa**.

O projeto foi estruturado seguindo uma arquitetura modular, com separação entre funcionalidades, componentes compartilhados, infraestrutura da aplicação e elementos de layout.

> **Status:** 🚧 Em desenvolvimento

---

## 📋 Sobre o projeto

O **Rota Certa Frontend** é a camada de apresentação de uma aplicação web voltada ao gerenciamento de informações relacionadas a rotas e operações logísticas.

A aplicação utiliza **Angular 19** e uma arquitetura baseada em componentes, permitindo organizar as funcionalidades em módulos independentes e facilitar a manutenção e evolução do sistema.

O frontend foi desenvolvido para consumir uma API REST responsável pelo processamento e persistência dos dados da aplicação.

### 🎯 Objetivos

* Disponibilizar uma interface web para gerenciamento das informações do sistema;
* Centralizar operações relacionadas às rotas;
* Facilitar o gerenciamento de pessoas e empresas;
* Organizar funcionalidades por domínio;
* Manter uma arquitetura escalável e de fácil manutenção;
* Integrar o frontend com uma API REST;
* Fornecer uma experiência consistente através de componentes reutilizáveis.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia              | Utilização                            |
| ----------------------- | ------------------------------------- |
| **Angular 19**          | Framework principal                   |
| **TypeScript 5.6**      | Linguagem de desenvolvimento          |
| **Angular Material 19** | Componentes e interface               |
| **Angular CDK 19**      | Recursos de construção de componentes |
| **PrimeFlex 4**         | Sistema de utilitários CSS            |
| **RxJS 7.8**            | Programação reativa                   |
| **SCSS**                | Estilização                           |
| **Angular Router**      | Navegação da aplicação                |
| **Angular Forms**       | Formulários e gerenciamento de dados  |
| **Jasmine / Karma**     | Testes unitários                      |
| **Angular CLI 19**      | Desenvolvimento e build               |

---

## 🏗️ Arquitetura

O projeto utiliza uma organização baseada em responsabilidades:

```text
src/
├── app/
│   ├── core/
│   ├── features/
│   ├── layout/
│   ├── shared/
│   │
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.urls.ts
│
├── assets/
├── environments/
│
├── index.html
├── main.ts
└── styles.scss
```

### `core/`

Responsável pelos recursos centrais da aplicação.

Normalmente concentra elementos que possuem escopo global, como:

* Serviços;
* Guards;
* Interceptors;
* Configurações;
* Modelos;
* Recursos relacionados à infraestrutura.

---

### `features/`

Representa os principais domínios e funcionalidades da aplicação.

A separação por `features` permite que cada área do sistema possua seus próprios componentes, serviços e regras, reduzindo o acoplamento entre funcionalidades.

Exemplo conceitual:

```text
features/
├── companies/
├── people/
├── routes/
└── ...
```

---

### `layout/`

Concentra os componentes responsáveis pela estrutura visual da aplicação.

Exemplos:

* Menu;
* Header;
* Sidebar;
* Containers;
* Layout administrativo;
* Elementos estruturais da interface.

---

### `shared/`

Área destinada a componentes e recursos reutilizáveis em diferentes partes da aplicação.

Exemplos:

* Componentes genéricos;
* Pipes;
* Diretivas;
* Componentes de formulário;
* Elementos visuais compartilhados.

---

## 🔄 Comunicação com a API

O frontend foi estruturado para trabalhar com uma **API REST**, mantendo a camada de apresentação separada das regras de negócio e persistência.

Fluxo simplificado:

```text
┌─────────────────────┐
│      Usuário        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Angular Frontend    │
│                     │
│ Components          │
│ Features            │
│ Services            │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│      REST API       │
│                     │
│ Backend / Django    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Database       │
└─────────────────────┘
```

Essa separação permite que frontend e backend evoluam de maneira independente.

---

## 📦 Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

* **Node.js**
* **npm**
* **Angular CLI 19**

Verifique as versões instaladas:

```bash
node --version
npm --version
ng version
```

---

## 🚀 Instalação

Clone o repositório:

```bash
git clone https://github.com/RaybrendoT/Rota-certa-Frontend-Angular.git
```

Entre no diretório:

```bash
cd Rota-certa-Frontend-Angular
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Executando em desenvolvimento

Inicie o servidor Angular:

```bash
npm start
```

ou:

```bash
ng serve
```

Depois acesse:

```text
http://localhost:4200
```

O Angular CLI disponibiliza atualização automática durante o desenvolvimento.

---

## 🏭 Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

ou:

```bash
ng build
```

Os arquivos compilados serão disponibilizados no diretório:

```text
dist/
```

---

## 🧪 Testes

Para executar os testes unitários:

```bash
npm test
```

ou:

```bash
ng test
```

O projeto utiliza:

* Jasmine;
* Karma;
* Angular Testing Utilities.

---

## 🔧 Scripts disponíveis

Os principais scripts definidos no projeto são:

```bash
npm start
npm run build
npm run watch
npm test
```

### Desenvolvimento

```bash
npm start
```

### Build

```bash
npm run build
```

### Build com observação de alterações

```bash
npm run watch
```

### Testes

```bash
npm test
```

---

## 🌎 Configuração de ambientes

As configurações específicas de ambiente ficam organizadas em:

```text
src/environments/
```

Essa abordagem permite separar configurações de desenvolvimento, homologação e produção.

Exemplo conceitual:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};
```

> ⚠️ Ajuste os valores de acordo com o ambiente utilizado e com a configuração da API.

---

## 🔐 Boas práticas

O projeto segue uma estrutura que favorece:

* Separação de responsabilidades;
* Componentização;
* Reutilização de código;
* Organização por domínio;
* Centralização de configurações;
* Uso de serviços para comunicação HTTP;
* Separação entre layout e funcionalidades;
* Tipagem através do TypeScript.

---

## 📁 Organização recomendada

À medida que o projeto crescer, recomenda-se manter a seguinte responsabilidade:

```text
core/
└── Recursos globais da aplicação

features/
└── Regras e funcionalidades específicas de cada domínio

layout/
└── Estrutura visual da aplicação

shared/
└── Recursos reutilizáveis

environments/
└── Configurações por ambiente
```

Essa organização evita transformar o projeto em uma estrutura baseada apenas em tipos técnicos, como:

```text
components/
services/
models/
pages/
```

e favorece uma arquitetura orientada às funcionalidades.

---

## 🔗 Projeto relacionado

O frontend faz parte do ecossistema do **Rota Certa**, sendo responsável pela camada de interface da aplicação.

### Frontend

**Rota Certa — Angular**

https://github.com/RaybrendoT/Rota-certa-Frontend-Angular

### Backend

**Rota Certa — Django**

https://github.com/RaybrendoT/Rota-certa-Backend-Django

---

## 📌 Roadmap

* [x] Estrutura inicial Angular
* [x] Angular Material
* [x] Organização por `core`, `features`, `layout` e `shared`
* [x] Configuração de ambientes
* [x] Configuração de rotas
* [ ] Integração completa com API
* [ ] Autenticação e autorização
* [ ] Dashboard operacional
* [ ] Gerenciamento de rotas
* [ ] Gerenciamento de pessoas
* [ ] Gerenciamento de empresas
* [ ] Relatórios
* [ ] Testes automatizados ampliados
* [ ] Pipeline CI/CD

---

## 👨‍💻 Autor

Desenvolvido por **Raybrendo Trindade** e **José Eduardo**.

GitHub:

https://github.com/RaybrendoT https://github.com/zezinjr

---

## 📄 Licença

Este projeto não possui uma licença open source definida atualmente.

Caso o projeto seja disponibilizado para uso, distribuição ou contribuição externa, recomenda-se definir uma licença apropriada, como **MIT**, conforme os objetivos do projeto.

---

## ⭐ Considerações

O **Rota Certa Frontend** foi desenvolvido utilizando Angular e uma arquitetura modular com foco em organização, reutilização e evolução contínua.

O projeto está em desenvolvimento e sua estrutura pode evoluir conforme novas funcionalidades e integrações sejam adicionadas.

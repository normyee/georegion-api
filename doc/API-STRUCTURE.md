# Decisões arquiteturais e a estrutura do projeto
Este projeto segue os princípios de `Domain-Driven Design (DDD)` e `Clean Architecture`, garantindo uma estrutura modular, escalável e de fácil manutenção. Há `MongoDB` com `Mongoose` para persistência de dados com ReplicaSet, aproveitando queries `geoespaciais` para realizar consultas geométricas de localização. Além de `Mongo Sessions` para atomicidade de transações. A `API` `OpenStreetMap` foi integrada para conversão entre coordenadas e endereços.
Para `logging`, utilizamos `Pino`, garantindo rastreabilidade e monitoramento eficientes das operações. A arquitetura modularizada facilita a evolução do sistema e a futura colaborações.

## Estrutura do projeto
- `.src/@types`: Camada de tipagem.

- `.src/shared`: Camada onde fica funcionalidades compartilhada entre módulos.
  - `auth.provider.ts`: Classe de autenticação com JWT.
  - `env.validation.ts`: Validação das variáveis de ambiente com `Zod`.
  - `get-formatted-date.ts`: Classe utilitária para formatação de data usada com `loggers`.
  - `network.provider.ts`: Abstração do `Axios` para chamadas de `API`.
  - `types.ts`: Folha para todas as tipagens do projeto.

- `.src/server.ts`: Arquivo de inicialização do projeto.

- `.test/all.spec.ts`: Folha de testes unitários.

**`./src/geo-app`**: É o único e o módulo principal do projeto.

- **`.src/application`**: É a camada `application` que faz ponte entre `domain`.
  - `applicaton/abstractions`: Lugar que fica as abstrações da camada.
    - `abstractions/geo-lib.interface`: Contrato da funcionalidade que faz conversão de endereço ↔ coordenadas.

  - `application/common`: É onde organiza código mais generalista e compartilhado entre a camada.
    - `common/dtos`: Onde fica os `DTOS` `region.dto.ts` e `user.dto.ts`.
    - `common/errors`: Agrupamento de classes personalizadas de erro a nível `application`.
    - `common/mappers`: Agrupamento de conversão `DTO` ↔ `ENTITY` com `user.mapper.ts` e `region.mapper.ts`.

  - **`application/use-case`**: Camada dos casos de uso.

  - **`use-case/region`: Casos de uso para `regiões`**.
    - `region/create-region.use-case.ts`: Cria uma região nova. Caso `userId`, capturado via `Bearer Token`, não esteja presente, é lançado o erro `MissingItemError`.
    - `region/delete-region.use-case.ts`: Deleta uma **`região`**.
    - `region/geospatial-proximity.use-case.ts`: Faz busca de regiões a partir de um ponto dada uma distância el quilômetro.
    - `region/get-region.use-case.ts`: Busca uma região por `id`.
    - `region/point-contained-in-region.use-case.ts`: Verifica se um ponto ou coordenada está presente em uma **`região`**.
    - `region/update-region.use-case.ts`: Atualiza os campos de uma **`região`**.

  - **`use-case/user`: Casos de uso para `usuários`**.
    - `user/create-user.use-case.ts`: Cria um **`usuários`** novo que faz uso de `IGeoLib` para obter o endereço a partir de uma coordenada ou o contrário. Caso ambos `coordinates` e `address` sejam passados, é lançado o erro `InvalidUserLocationError`. 
    - `user/delete-user-use-case.ts`: Deleta um **`usuário`**.
    - `user/get-all-users.use-case.ts`: Busca todos os **`usuários`**.
    - `user/get-user.use-case.ts`: Retorna um **`usuário`** pelo `id`.
    - `user/login-user.use-case.ts`: Caso de uso para obter novo `token` a partir do e-mail usado para criar um **`usuário`**.
    - `user/update-user.use-case.ts`: Atualiza um **`usuário`**, mas caso ambos `coordinates` e `address` sejam passados, é lançado o erro `InvalidUserLocationError`.

- **`.src/domain`**: É a camada `domain` da aplicação.
    - `domain/common`: Código comum entre a camada `domain`.
      - `common/errors`: Agrupamento de erros personalizados da camada `domain`.
      - `common/mapper.interface.ts`: Contrato para os `mappers`.

    - `domain/entity`: Local onde fica as entidades `region.entity.ts` e `user.entity.ts`.
      - `entity`: Local onde fica as entidades `region.entity.ts` e `user.entity.ts`.

    - `domain/repositories`: Onde ficam os contratos de `repositories` de `regions` e `users`.

- **`.src/infra`**: Camada de `infraestrutura` da aplicação, onde fica as implementações técnicas.
    - `infra/controllers`: Onde ficam os controllers `region.controller.ts` e `user.controller.ts`.

    - `infra/database/orm/mongoose`: Onde ficam as implementações dos `repositories`, `models` e classe de conexão com `MongoDB`.
      - `mongoose/models`: Onde fica as `models` do banco de dados.
        - `mongoose/models/common/base.ts`: Onde fica a classe base para as `models`.
        - `mongoose/models/region.ts`: Model para `region`.
        - `mongoose/models/user.ts`: Model para `user`.
        - `mongoose/models/repositories`: Local que organiza as implementações dos `repositories` para `regions` e `users`.
        - `mongoose/models/index.ts`: Classe para inicialização e conexão com o `MongoDB`.

    - `infra/middlewares/auth-validation.middleware`: Classe que faz validação dos `Bearer Tokens` e proteção de rotas.

    - `infra/providers`: Onde estão as implementações para `IGeoLib` com `OpenStreetMap` e `Loggers` com `Pino`.

    - `infra/geo-app-module`: Módulo responsável por gerenciar a injeção de dependências com typedi.

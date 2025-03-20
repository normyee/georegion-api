### Solução

Desenvolvi o Backend utilizando `Clean Architecture` e modelagem `DDD`, aplicando injeção de dependências pelo módulo `app-geo.module.ts` e implementando inversão de dependências. Usei o padrão `Repository` para abstrair a persistência e `MongoDB` com `sessions` para garantir a atomicidade das transações. A autenticação é implementada com `JWT`. Para conteinerização, utilizei `Docker Compose`.

Integrei a `API` `OpenStreetMap` para conversão entre coordenadas e endereços. As rotas foram criadas com decorators e implementei um logger eficiente usando Pino. A solução conta com várias abstrações para garantir flexibilidade e manutenção fácil.

## 🔍 **Funcionalidades Implementadas**

### 🧑‍💻 Usuários
- **CRUD completo**.
- Conversão entre endereço e coordenadas via API de geolocalização.
- Validação para evitar envio de ambos ou nenhum dos dados.
- Atualização de localização segue a mesma regra.
- Integração com API OpenStreetMap para conversão entre endereço e coordenadas geográficas.

### 🌍 Regiões
- **CRUD completo**.
- Regiões representadas como polígonos em GeoJSON, associadas a um usuário.
- Listagem de regiões contendo um ponto específico ou dentro de um raio definido.
- Listar regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
- **Geospatial Queries**:
  - Operações avançadas utilizando índices `2dsphere` para suportar consultas espaciais eficientes.
  - Implementação de consultas para localização de regiões e otimização de busca com indexação geoespacial.

### 🚀 Extras
- Autenticação com JsonWebToken (usuário pode ser passado na requisição de criação ou obtido no `/users/login`). ✔️
- Container do MongoDB configurado com ReplicaSet SingleNode ✔️.
- Utilização de **Mongo Sessions** para transações. ✔️
- Documentação completa da API por ✔️.
- Cobertura de código (baixa cobertura de testes) ⚠️. 
- Injeção de dependências utilizando `typedi` para melhor modularidade e testabilidade ✔️
- Implementação de logs estruturados com `Pino` para melhor monitoramento ✔️.
- Uso do `Zod` para garantir a integridade das configurações das variáveis de ambiente. ✔️

### Como executar em minha máquina?

- Clone o projeto em sua máquina: `git clone https://github.com/normyee/ozmap-challenge.git`
- Entre no projeto: `cd ozmap-challenge`
`
- Crie um arquivo no pasta raiz com nome de `.env`
- Abra o `.env.example` e passe no `.env` as mesmas variáveis
- Instale as dependências: `yarn install`
- Inicialize o contêiner: `docker-compose up --wait`
- Inicialize a aplicação: `yarn start:prod`
  
#### Pronto 🎉
- Agora pode criar seu usuário em `localhost:3003/users`
## Documentação
- [Como o Backend está estruturado?](doc/API-STRUCTURE.md/)

### Endpoints
- Utilize `https://geojson.io/` para obter `coordenadas` de um local nas endpoints de criação de usuário (`POST /users`) caso passe `coordinates` em vez do `address`. Se apenas passar o nome de um endereço válido, e automaticamente as coordenadas do endereço serão obtidas. Também use `https://geojson.io/` para obter pontos geométricos para criação de `regions`.

- **CRUD completo para rota /users**.
`POST - /users`
```
http://localhost:3000/users -> Cria um novo usuário no sistema e retorna um Bearer Token de autenticação em todas as outras rotas, exceto esta rota e a de 'localhost:3003/users/login'
```
#### Exemplo Request:
```
{
    "name": "fulano",
    "email": "fulano@gmail.com",
    "coordinates": [-48.47821611448057,-1.4229724705990219]
}
```
#### Response esperada:
```
{
    "status": "success",
    "message": "User has been created successfully",
    "data": {
        "id": "67d503d379222fd1a1bba282",
        "name": "fulano",
        "email": "fulano@gmail.com",
        "address": "Passagem Marinho, Sacramenta, Belém, Região Geográfica Imediata de Belém, Região Geográfica Intermediária de Belém, Pará, Região Norte, 66083-000, Brasil",
        "coordinates": [
            -48.47821611448057,
            -1.4229724705990219
        ]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q1MDNkMzc5MjIyZmQxYTFiYmEyODIiLCJpYXQiOjE3NDIwMTMzOTUsImV4cCI6MTc0MjAzMTM5NX0.--pZDPTGmMO9u6ASWyWggna4YkbP3-dTGEcDtIevpM4"
}

```

----------------------------------------------------------------------------------
`POST - /login`
```
http://localhost:3003/auth/login-> Retorna um Bearer Token que usaremos para acessar todas as outras rotas. *OBS*: O Bearer Token tem expiração de 5h
```

#### Exemplo Request:
```
{
    "email": "fulano@gmail.com",
}
```

#### Response esperada:
```
{
    "status": "success",
    "message": "User has signed in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q1MDNkMzc5MjIyZmQxYTFiYmEyODIiLCJpYXQiOjE3NDIwMTM5NjAsImV4cCI6MTc0MjAzMTk2MH0.-pG-4UP2YEob-6sPWW8ikFBf28_4CBoxZ5WDbfEjSvc"
}
```
----------------------------------------------------------------------------------
- **CRUD completo para rota /regions**.
`POST - /regions`
```
http://localhost:3003/regions-> Cria uma região nova associada a um user. *OBS*: É necessário passar o Bearer Token obtido em POST "/login" ou POST "/users"
```
#### Exemplo Request:
```
{
    "name": "Belém Ponto",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -48.53588241001793,
                    -1.289183889687223
                ],
                [
                    -48.53588241001793,
                    -1.496723909393296
                ],
                [
                    -48.22618185632396,
                    -1.496723909393296
                ],
                [
                    -48.22618185632396,
                    -1.289183889687223
                ],
                [
                    -48.53588241001793,
                    -1.289183889687223
                ]
            ]
        ]
    }
}
```

#### Response esperada:
```
{
    "status": "success",
    "message": "Region has been created successfully",
    "data": {
        "id": "67d5075179222fd1a1bba285",
        "name": "Belém Ponto",
        "userId": "67d503d379222fd1a1bba282",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -48.53588241001793,
                        -1.289183889687223
                    ],
                    [
                        -48.53588241001793,
                        -1.496723909393296
                    ],
                    [
                        -48.22618185632396,
                        -1.496723909393296
                    ],
                    [
                        -48.22618185632396,
                        -1.289183889687223
                    ],
                    [
                        -48.53588241001793,
                        -1.289183889687223
                    ]
                ]
            ]
        }
    }
}
```
----------------------------------------------------------------------------------
`GET - /regions/containing?lng=-48.4782055&lat=-1.4229802&page=1&limit=30`
```
http://localhost:3003/containing -> Retorna listagem de regiões contendo um ponto específico ou dentro de um raio definido
```
- **Parâmetros da rota**
  - `lng` -> longitude
  - `lat` -> latitude
  - `page` -> página atual da busca
  - `limit` -> limitar a quantidade por página

#### Response esperado:
```
{
    "status": "success",
    "message": "Regions containing the point [-48.4782055, -1.4229802] have been found successfully.",
    "data": [
        {
            "_id": "67d5075179222fd1a1bba285",
            "_name": "Belém Ponto",
            "_userId": "67d503d379222fd1a1bba282",
            "_geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -48.53588241001793,
                            -1.289183889687223
                        ],
                        [
                            -48.53588241001793,
                            -1.496723909393296
                        ],
                        [
                            -48.22618185632396,
                            -1.496723909393296
                        ],
                        [
                            -48.22618185632396,
                            -1.289183889687223
                        ],
                        [
                            -48.53588241001793,
                            -1.289183889687223
                        ]
                    ]
                ]
            }
        }
    ]
}
```
----------------------------------------------------------------------------------
`GET - /regions/near?lng=-48.451393226238935&lat=-1.402774657344807&km_distance=10&page=1&limit=10`
```
http://localhost:3003/containing -> Retorna listagem de regiões contendo um ponto específico dentro de um raio definido em quilômetros
```
- **Parâmetros da rota**
  - `lng` -> longitude
  - `lat` -> latitude
  - `km_distance` -> distância em quilômetros do ponto
  - `filter_user` -> `true` para filtragem regiões por usuário
  - `page` -> página atual da busca
  - `limit` -> limitar a quantidade por página

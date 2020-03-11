## cpsc310-rest-demo-server

### Set up
`git clone`  this repo

`yarn install` to install dependencies

`yarn build` to compile

`yarn start` to start the server
 
 The server by default will be listening at http://localhost:11315

### API

|Method|Purpose|Endpoint|Request|
|------|:------|:------|:-----|
GET |query item(s) | /addresses | GET /addresses
PUT | add an item |	/address/:id	| PUT /address/:id {“body”: \<address string\>}
POST | update an item	| /address/:id	| POST /address/:id {“body”: \<address string\>}
DELETE| delete an item|	/address/:id	| DELETE /address/:id

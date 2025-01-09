# Welcome to SUCN project from UNESCO 🇺🇳

## Get started

1. Instale python3, node e npm do noje.js:

2. Instale dependências do projeto:

   ```bash
   npm install
   npm install expo
   ```

3. Em celulares Android, baixe Expo Go na Play Store. Para iOS use apenas a câmera para escanear o código.

4. Rode o programa webscrap.js localizado em back-end/Cepae-esalq/webscrap.js com o comando:

NÃO VAI PRECISAR MAIS PQ JÁ RODA ONLINE EM https://dashboard.render.com/web/srv-ctpip93qf0us73ecfcp0/deploys/dep-ctpj9rq3esus73dihoqg

   ```bash
   node webscrap.js
   ```

5. Abra um novo terminal, vá para a pasta inicial e, caso queira rodar no celular, faça:
   ```bash
   npx expo start
   ```
   E escaneie o QR Code. Se quer rodar no navegador pelo pc, faça:
   ```bash
   npm run web
   ```


# SITE DO PROJETO

Eis aqui os site do projeto: https://expo.dev/accounts/ayrton_filho_dev/projects/SUCN/updates/0e9edeb8-e04f-4c7b-b9df-39131f7be9c6

* Lembre-se que você deve ter uma conta no Expo-Go para tal.
* Lembrando que tem algumas coisas do backend que estão locais. Vou ver de no futuro colocar no github


* Para dar update no projeto em produção, use:

   ```bash
   eas update --channel production --message "Descrição da atualização"
   ```


## Dúvidas (Ayrton):

* Em LabPage, colocar uma lista dos componentes para o produtor rual colocar a quantidade, mais localização (CEP, essas coisas), mais blocos e no final retornar um bloco com todas as informações (bioma, recomendações de solo)
* Se der, colocar calendário para o produtor poder colocar as datas dele (SE DER!!!!) -> Vamos ainda fazer essa ideia? Vai dar trabalho
* Melhorar o UX desing: https://www.youtube.com/watch?v=x5hX06YdRvI


## Atividades do (Eduardo):

* Cuidar do resto do backend.
* Cuidar de todo o processo de login e registro + serviços AWS ou outros serviços de cloud.
* Cuidar do campo Profile 
* Fazer web scrapping disso para pegar dados de produtores rurais como em: https://sncr.serpro.gov.br/sncr-web/consultaPublica.jsf;jsessionid=-iMj9v2I5rCP-vao4gXcRfdV.sncr-web6?windowId=8bf

## Atividades demais membros

* Passar as informações do Lab Page detalhadas e sintetizadas.
* Melhorar a engenharia de prompt do chatbot (somente texto).
* Ver programas sociais para recomendar para o produtor (colocar no chatbot)

## Questões a discutir em grupo

* Ver como funciona o QR code do Expo para mandar no pitch no final. 
* (Ayrton) Creio fielmente que devemos colocar uma ferramenta funcional gratuita no nosso projeto (que poucos conhecem), como a https://www.agroapi.cnptia.embrapa.br/portal/. No github tem algumas dessas API's crackeadas pelo que lembro (tipo de imagem de satélite).


## Observações de problemas

Caso tenha alguns problemas de permissão ao rodar o código, como esse: sh: 1: expo: Permission denied, rode isso (para linux):
chmod +x node_modules/.bin/expo

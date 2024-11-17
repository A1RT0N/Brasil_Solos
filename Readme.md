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

Eis aqui os site do projeto: https://expo.dev/accounts/ayrton_filho_dev/projects/SUCN/updates/84a36750-d3ab-438a-9abe-ec705eff30e6

* Lembre-se que você deve ter uma conta no Expo-Go para tal.
* Lembrando que tem algumas coisas do backend que estão locais. Vou ver de no futuro colocar no github
* Rodar direto: https://expo.dev/preview/update?message=novas%20tarefas&updateRuntimeVersion=1.0.0&createdAt=2024-11-17T23%3A24%3A51.771Z&slug=exp&projectId=4c3cbb8c-d204-4c08-a1cf-59b1d2f235fd&group=84a36750-d3ab-438a-9abe-ec705eff30e6

* Para dar update no projeto em produção, use:

   ```bash
   eas update --channel production --message "Descrição da atualização"
   ```


## TODO (Ayrton):

* Colocar tema preto
* Colocar em Home notícias na área agro nesses sites: agrolink, embrapa, https://www.noticiasagricolas.com.br/, canal rural ->  CHECK
* COLOCAR SUBTÍTULO NAS NOTÍCIAS
* Em LabPage, colocar uma lista dos componentes para o produtor rual colocar a quantidade, mais localização (CEP, essas coisas), mais blocos e no final retornar um bloco com todas as informações (bioma, recomendações de solo)
* Se der, colocar calendário para o produtor poder colocar as datas dele (SE DER!!!!)
* Melhorar o UX desing: https://www.youtube.com/watch?v=x5hX06YdRvI


## Atividades do (Eduardo):

* Cuidar do resto do backend.
* Cuidar de todo o processo de login e registro + serviços AWS ou outros serviços de cloud.
* Cuidar do campo Profile 

## Aticidades demais membros

* Passar as informações do Lab Page detalhadas e sintetizadas.
* Melhorar a engenharia de prompt do chatbot (somente texto).
* Ver programas sociais para recomendar para o produtor (colocar no chatbot)

## Questões a discutir em grupo

* Ver como funciona o QR code do Expo para mandar no pitch no final. 
* (Ayrton) Creio fielmente que devemos colocar uma ferramenta funcional gratuita no nosso projeto (que poucos conhecem), como a https://www.agroapi.cnptia.embrapa.br/portal/

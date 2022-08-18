[![wakatime](https://wakatime.com/badge/github/thomasbnt/DW_P6_Hot_Takes_backend_OC.svg?style=for-the-badge)](https://wakatime.com/badge/github/thomasbnt/DW_P6_Hot_Takes_backend_OC)
[![Build with MongoDB](https://img.shields.io/badge/Build%20with%20mongoDB-%2300f.svg?&color=800&style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/Automattic/mongoose)
[![build with ExpressJS](https://img.shields.io/badge/Build%20with%20Express-%234752C4.svg?&style=for-the-badge&color=white&logo=express&logoColor=black&alt=express)](https://github.com/expressjs/express)

![Hot Takes logo](piiquante.png)

> Projet n°6 OpenClassrooms Développeur Web. — 19 Juin 2022.

## Introduction

- La partie [Frontend](/frontend) est sous **AngularJS**. 
Et provient initialement du dépôt GitHub [OpenClassrooms-Student-Center/Web-Developer-P6](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6).
- La partie [Backend](/backend) est sous **NodeJS** avec **Express**, **Multer** pour les uploads d'images,
**jsonwebtoken** pour l'authentification et **MongoDB** pour la base de donnée.

Chaque partie à son propre **package.json**.

## Installation 
 
Pour pouvoir exécuter ce projet, veuillez suivre ces étapes. 

1. Installez **NodeJS** (>= 16.10 pour Angular) et **npm**.
2. Installez les dépendances nécessaires aux deux parties (frontend et backend).
3. Copiez le fichier [.env.example](/backend/.env.example) en `.env` et remplacez les valeurs par vos propres.
4. N'oubliez pas d'avoir un accès à votre base de données MongoDB (Voir ci-dessous pour les configurations)
5. Exécutez le script backend, à coup de `npm run serve`. _Port 3000_
6. Exécutez le script frontend, à coup de `npm run start`. _Port 4200_ (Ou `ng serve`)
7. Vous pouvez maintenant accéder à l'interface de votre site.

## Partie MongoDB

L'utilisation de MongoDB est présente pour sauvegarder les données de l'application.
Nous utilisons le **Cloud de MongoDB** à l'adresse https://cloud.mongodb.com.

Exemple de `.env` :

```dotenv
MONGODB_USERNAME=USER
MONGODB_PASSWORD=PASS
KEY=key
FRONT_DOMAIN=*
```

> ℹ `FRONT_DOMAIN` est le domaine de votre site, ici utilisé pour des raisons de sécurité (cors), nous délimitons les calls API que depuis ce domaine.

## Cahier des charges

- API conforme aux exigences de sécurité
- Toutes les routes en DEL/POST/PUT pour les sauces et likes sont protégés par Bearer Token.

### Ouvrir les tests API sur Insomnia

[![Run in Insomnia](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run?label=Code&uri=https://raw.githubusercontent.com/thomasbnt/DW_P6_Hot_Takes_backend_OC/main/insomnia.json)

## Développement

- Projet réalisé avec **Intellij**.
- Testé avec [Hoppscotch](https://hoppscotch.io). (_Fichier de configuration : [`.hoppscotch.json`](hoppscotch.json)_)

## Contributions

Les contributions sont toujours les bienvenues ! Lisez les règles pour les contributions avant de pouvoir y participer.

Veuillez vous assurer que votre demande de pull request respecte les lignes directrices suivantes :

- Rechercher des suggestions précédentes avant d'en faire une nouvelle, afin d'éviter les doublons.
- Les fichiers README suggérés devraient être beau ou se démarquer d'une manière ou d'une autre.
- Faire une demande de pull request individuelle pour chaque suggestion.
- De nouvelles catégories ou des améliorations à la catégorisation existante sont les bienvenues.
- Gardez les descriptions courtes et simples, mais descriptives.
- Commencez la description avec une capitale et terminez par un arrêt/période complet.
- Vérifiez votre orthographe et votre grammaire.
- Assurez-vous que votre éditeur de texte est configuré pour supprimer les espaces de fin.

Merci pour vos suggestions !


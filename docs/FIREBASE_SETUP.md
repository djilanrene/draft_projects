# Guide de Configuration Firebase

Ce projet est étroitement intégré à Firebase pour sa base de données, son authentification et son stockage. Pour faire fonctionner l'application en développement local ou pour la déployer, vous devez la connecter à un projet Firebase.

## 1. Fichiers de Configuration Clés

- **`src/firebase/config.ts`** : Ce fichier contient l'objet de configuration de votre application web Firebase. Il est essentiel pour que le SDK Firebase sache à quel projet se connecter.
- **`firestore.rules`** : Ce fichier définit les règles de sécurité pour votre base de données Firestore. Il spécifie qui peut lire et écrire des données et dans quelles conditions.
- **`docs/backend.json`** : Ce fichier est un "plan" ou un schéma de votre backend. Il décrit les différentes entités (projets, articles, etc.) et où elles sont stockées dans Firestore. Il est principalement utilisé comme référence pour le développement et la génération de code, mais il ne provisionne ni ne déploie de ressources.

## 2. Connecter à un Nouveau Projet Firebase

Si vous souhaitez connecter ce code à votre propre projet Firebase, suivez ces étapes.

### Étape 1 : Créer un projet Firebase

1.  Allez sur la [Console Firebase](https://console.firebase.google.com/).
2.  Cliquez sur **"Ajouter un projet"** et suivez les instructions pour créer un nouveau projet.
3.  Une fois le projet créé, allez dans les **Paramètres du projet** (icône d'engrenage en haut à gauche).

### Étape 2 : Créer une Application Web

1.  Dans les paramètres de votre projet, faites défiler vers le bas jusqu'à la section "Vos applications".
2.  Cliquez sur l'icône Web (`</>`) pour créer une nouvelle application web.
3.  Donnez un nom à votre application (ex: "Portfolio Site") et cliquez sur **"Enregistrer l'application"**.
4.  Firebase vous fournira un objet de configuration `firebaseConfig`. Copiez cet objet.

### Étape 3 : Mettre à jour la Configuration Locale

1.  Ouvrez le fichier `src/firebase/config.ts` dans votre éditeur de code.
2.  Remplacez le contenu existant par l'objet `firebaseConfig` que vous venez de copier.

### Étape 4 : Activer les Services Firebase

Dans la console Firebase, vous devez activer les services que nous utilisons :

1.  **Authentication** :
    - Dans le menu de gauche, allez dans **Authentication**.
    - Cliquez sur l'onglet **"Sign-in method"**.
    - Activez le fournisseur **"E-mail/Mot de passe"**. C'est ce qui est utilisé pour la connexion au backoffice.

2.  **Cloud Firestore** :
    - Dans le menu de gauche, allez dans **Cloud Firestore**.
    - Cliquez sur **"Créer une base de données"**.
    - Choisissez de démarrer en **mode production** (les règles de sécurité seront appliquées ensuite).
    - Choisissez l'emplacement de votre base de données.

### Étape 5 : Appliquer les Règles de Sécurité

1.  Dans la section **Cloud Firestore**, allez à l'onglet **"Règles"**.
2.  Copiez le contenu complet du fichier `firestore.rules` de ce projet.
3.  Collez-le dans l'éditeur de règles de la console Firebase, en remplaçant les règles par défaut.
4.  Cliquez sur **"Publier"**.

### Étape 6 : Créer un Utilisateur Administrateur

Pour vous connecter au backoffice, vous avez besoin d'un utilisateur.

1.  Dans la section **Authentication**, allez à l'onglet **"Users"**.
2.  Cliquez sur **"Ajouter un utilisateur"**.
3.  Entrez une adresse e-mail et un mot de passe. Ce seront vos identifiants pour vous connecter à la page `/admin/login`.

Votre projet local est maintenant entièrement connecté à votre propre backend Firebase. Vous pouvez commencer à gérer le contenu via le backoffice.

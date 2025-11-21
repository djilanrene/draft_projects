# Portfolio & Blog Next.js avec Backoffice Firebase

Ce projet est un portfolio moderne et complet, conçu pour présenter des projets et partager des articles de blog. Il est développé avec Next.js et intègre un puissant backoffice en temps réel construit sur Firebase, permettant une gestion de contenu simple et instantanée.

## 🚀 Fonctionnalités

- **Gestion de Projets** : Présentez vos réalisations avec des descriptions détaillées, des galeries d'images, des catégories et des liens vers les technologies utilisées.
- **Moteur de Blog Intégré** : Rédigez et publiez des articles en utilisant la syntaxe Markdown pour un formatage riche.
- **Panneau d'Administration Complet** : Un backoffice sécurisé pour gérer l'intégralité du contenu du site :
    - **Projets** : Ajouter, modifier, publier/dépublier et supprimer des projets.
    - **Articles** : Gérer le cycle de vie complet de vos publications de blog.
    - **Profil** : Mettre à jour votre biographie et vos photos de profil.
    - **Réseaux Sociaux** : Gérer les icônes et les liens dans le pied de page.
    - **CV** : Mettre à jour le lien de téléchargement de votre CV.
- **Mises à jour en Temps Réel** : Grâce à Firebase Firestore, les modifications apportées dans le backoffice sont visibles instantanément sur le site public sans avoir à redéployer.
- **Recherche et Filtrage** : Des fonctionnalités de recherche dynamiques sur les pages des projets et du blog.
- **Thème Sombre et Clair** : Le site propose une expérience visuelle adaptable avec un mode sombre et un mode clair.
- **Design Responsive** : Une interface utilisateur soignée qui s'adapte parfaitement aux ordinateurs de bureau, tablettes et téléphones mobiles.

## 🛠️ Stack Technique

- **Framework Frontend** : [Next.js](https://nextjs.org/) (React)
- **Base de Données & Backend** : [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Composants UI** : [ShadCN/UI](https://ui.shadcn.com/)
- **Gestion de formulaires** : [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)

Pour une description plus détaillée de l'organisation du code, consultez le [Guide d'Architecture](./docs/ARCHITECTURE.md).

## ⚙️ Démarrage Rapide

Ce projet est configuré pour fonctionner dans un environnement de développement cloud. Voici les étapes pour le lancer localement :

1.  **Installer les dépendances** :
    ```bash
    npm install
    ```

2.  **Configurer Firebase** :
    Le projet nécessite une connexion à un projet Firebase pour fonctionner. Suivez le [Guide de Configuration Firebase](./docs/FIREBASE_SETUP.md) pour connecter votre propre projet.

3.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

    L'application sera disponible à l'adresse `http://localhost:3000` (ou un autre port s'il est déjà utilisé).

## 🗂️ Structure du Projet

- `src/app/` : Cœur de l'application Next.js avec l'App Router.
    - `(admin)/` : Contient toutes les pages du backoffice (protégées par authentification).
    - `(public)/` : Contient les pages publiques (accueil, blog, projets, etc.).
- `src/components/` : Composants React réutilisables, y compris les composants `ui` de ShadCN.
- `src/firebase/` : Toute la configuration et les hooks pour l'interaction avec Firebase.
- `src/lib/` : Utilitaires, définitions de types TypeScript et autres logiques partagées.
- `docs/` : Documentation complète du projet.

## 👨‍💻 Utilisation du Panneau d'Administration

Pour accéder au backoffice, naviguez vers `/admin/login` et connectez-vous avec les identifiants d'administrateur configurés dans votre projet Firebase Authentication.

Pour un guide complet sur l'utilisation du panneau d'administration, consultez le [Guide du Backoffice](./docs/ADMIN_PANEL_GUIDE.md).

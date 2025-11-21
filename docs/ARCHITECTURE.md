# Guide d'Architecture

Ce document fournit une vue d'ensemble de l'architecture technique du projet, des technologies utilisées et de l'organisation du code.

## 1. Vue d'ensemble de la Stack

- **Framework** : [Next.js](https://nextjs.org/) avec l'App Router. Nous utilisons les React Server Components (RSC) par défaut pour optimiser les performances, et les Client Components (`'use client'`) pour l'interactivité.
- **Base de Données et Auth** : [Firebase](https://firebase.google.com/) est utilisé pour la base de données en temps réel (Firestore), l'authentification (Firebase Auth) et le stockage de fichiers (Firebase Storage).
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) pour un styling rapide et personnalisable.
- **Composants UI** : [ShadCN/UI](https://ui.shadcn.com/) fournit une base de composants accessibles et stylisés, construits sur Radix UI.
- **Gestion de l'état** : L'état global est minimal. L'état du serveur est géré via les hooks de Firebase qui écoutent les données en temps réel. L'état local de l'interface utilisateur est géré avec les hooks de React (`useState`, `useContext`).

## 2. Structure des Dossiers

```
/
├── docs/                      # Documentation du projet
│   ├── ARCHITECTURE.md        # Ce fichier
│   ├── ADMIN_PANEL_GUIDE.md   # Guide d'utilisation du backoffice
│   ├── FIREBASE_SETUP.md      # Instructions de configuration Firebase
│   └── backend.json           # Schéma de la structure de la base de données
│
├── src/
│   ├── app/                   # Fichiers de l'application Next.js
│   │   ├── (admin)/           # Groupe de routes pour le backoffice
│   │   │   ├── articles/
│   │   │   ├── projects/
│   │   │   └── ...            # Autres pages d'administration
│   │   │   └── layout.tsx     # Layout sécurisé pour le backoffice
│   │   │
│   │   ├── (public)/          # Groupe de routes pour le site public
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   ├── projects/
│   │   │   └── page.tsx       # Page d'accueil
│   │   │
│   │   └── layout.tsx         # Layout racine
│   │
│   ├── components/            # Composants React
│   │   ├── ui/                # Composants de base de ShadCN (boutons, cartes, etc.)
│   │   ├── FirebaseErrorListener.tsx  # Gestionnaire d'erreurs Firebase
│   │   ├── project-card.tsx   # Carte de présentation d'un projet
│   │   └── site-header.tsx    # En-tête du site
│   │
│   ├── firebase/              # Tout ce qui concerne Firebase
│   │   ├── config.ts          # Configuration Firebase
│   │   ├── provider.tsx       # Fournisseur de contexte Firebase et hooks associés
│   │   ├── client-provider.tsx # Initialisation de Firebase côté client
│   │   ├── errors.ts          # Erreurs personnalisées pour les règles de sécurité
│   │   └── firestore/
│   │       ├── use-collection.tsx # Hook pour écouter une collection Firestore
│   │       └── use-doc.tsx        # Hook pour écouter un document Firestore
│   │
│   ├── hooks/                 # Hooks React personnalisés
│   │   └── use-toast.ts       # Hook pour afficher des notifications
│   │
│   └── lib/                   # Librairies et utilitaires
│       ├── types.ts           # Définitions TypeScript globales
│       └── utils.ts           # Fonctions utilitaires (ex: `cn` pour Tailwind)
│
├── firestore.rules            # Règles de sécurité de la base de données Firestore
└── ...                        # Autres fichiers de configuration (tailwind, next, etc.)
```

## 3. Flux de Données avec Firebase

Le projet s'appuie fortement sur l'écoute en temps réel de Firestore pour maintenir l'interface utilisateur synchronisée avec la base de données.

- **`src/firebase/provider.tsx`** : Ce fichier est crucial. Il initialise le contexte Firebase qui met à disposition les instances de `firestore`, `auth` et `storage` à toute l'application. Il contient également la logique pour écouter les changements d'état d'authentification de l'utilisateur.

- **`useCollection` et `useDoc`** : Ces hooks personnalisés (situés dans `src/firebase/firestore/`) sont le principal moyen d'interroger Firestore depuis les composants React. Ils prennent une référence de collection ou de document Firestore et retournent les données (`data`), l'état de chargement (`isLoading`) et les erreurs (`error`). Ils gèrent automatiquement la souscription et la désinscription aux flux de données en temps réel.

- **Mises à jour non bloquantes** : Pour les opérations d'écriture (`setDoc`, `addDoc`, etc.), nous utilisons des fonctions "non bloquantes" (`src/firebase/non-blocking-updates.tsx`). Cela signifie que l'interface utilisateur est mise à jour immédiatement de manière optimiste, sans attendre la confirmation du serveur, offrant une expérience utilisateur très réactive.

## 4. Gestion de l'Authentification

- **Firebase Authentication** est utilisé pour sécuriser le backoffice.
- Le layout `src/app/admin/layout.tsx` est un composant client qui utilise le hook `useUser` pour vérifier si un utilisateur est connecté. S'il ne l'est pas, il est automatiquement redirigé vers la page `/admin/login`.
- Toutes les pages à l'intérieur du dossier `(admin)` sont ainsi protégées.
- Les règles de sécurité dans `firestore.rules` s'assurent que seuls les utilisateurs authentifiés (`isAdmin()`) peuvent écrire des données.

## 5. Styling et Composants

L'approche de styling est basée sur **Tailwind CSS** et **ShadCN/UI**.

- **`src/app/globals.css`** : Contient les variables de thème (couleurs, espacements) pour ShadCN, définies en utilisant des variables CSS HSL. Cela permet de personnaliser facilement le thème de l'application, y compris les modes sombre et clair.
- **`src/components/ui/`** : Contient les composants de base (primitives) fournis par ShadCN. Ces composants sont conçus pour être personnalisés et composés pour créer des interfaces plus complexes.
- **Composants personnalisés** : Dans `src/components/`, nous créons nos propres composants (ex: `SiteHeader`, `ProjectCard`) en assemblant les primitives de `ui`.

Cette architecture modulaire et basée sur des services clairs (Firebase) permet une grande flexibilité et une bonne séparation des préoccupations.

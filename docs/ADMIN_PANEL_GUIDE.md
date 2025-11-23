### Formulaire de Projet

- **Publier** : Un interrupteur pour rendre le projet visible ou non sur le site public. Très utile pour préparer un projet en brouillon.
- **Titre** : Le nom de votre projet.
- **Résumé (Excerpt)** : Une phrase courte qui apparaît sur la carte du projet.
- **Contenu (Markdown)** : La description complète de votre projet. Vous pouvez utiliser la syntaxe Markdown pour le formatage (titres, listes, gras, etc.).
- **Catégorie** : La catégorie principale du projet (ex: "Développement Web", "Design UI/UX").
- **URL de l'image** : Le lien vers l'image principale de votre projet.
  - **Astuce :** Si vous collez une URL d'image provenant de Google Drive, GitHub, Imgur ou Unsplash, le champ reformate automatiquement le lien pour qu'il soit compatible avec l'aperçu. Une notification s'affiche pour confirmer la correction.
- **Logiciels / Technologies** : Une liste de technologies utilisées, séparées par des virgules (ex: "React, Figma, Next.js").
- **Liens de ressources** : Ajoutez des liens externes, comme un lien vers le site en ligne (`website`) ou le dépôt de code (`github`).

## 2. Gestion des Articles

### Formulaire d'Article

- **Publier** : Rendez l'article visible publiquement sur la page `/blog`.
- **Titre, Résumé, Contenu** : Similaires au formulaire de projet. Le contenu est également en Markdown.
- **URL de l'image** : L'image de couverture de votre article.
  - **Astuce :** Le champ reformate automatiquement les liens d'image collés (Drive, GitHub, Imgur, Unsplash) pour l'aperçu, avec notification de confirmation.
- **Tags** : Mots-clés pour votre article, séparés par des virgules.

## 3. Gestion du Profil

Cette page contrôle les informations affichées sur la page "À Propos" et dans l'en-tête du site.

- **URL de la photo de profil** : L'image qui apparaît dans l'avatar de l'en-tête.
  - **Astuce :** Le champ reformate automatiquement les liens d'image collés (Drive, GitHub, Imgur, Unsplash) pour l'aperçu, avec notification de confirmation.
- **URL de l'image "À propos"** : La grande image sur la page "À propos de moi".
  - **Astuce :** Idem, le formatage et la notification sont automatiques.
- **Biographie (Paragraphes 1, 2, 3)** : Le texte qui constitue votre biographie.

Toutes les modifications sont enregistrées lorsque vous cliquez sur "Sauvegarder les modifications".

## Animations et notifications

Les cartes projets et articles apparaissent avec une animation glissé-fondu rapide lors des recherches ou du chargement, et zooment légèrement au survol.

À chaque formatage automatique d'un lien d'image, une notification s'affiche pour confirmer la correction.

Toutes les modifications sont sauvegardées en temps réel. Vous pouvez ouvrir votre site public dans un autre onglet pour voir les changements s'appliquer instantanément.

# Guide d'Utilisation du Panneau d'Administration

Ce guide vous explique comment utiliser le backoffice de votre portfolio pour gérer tout le contenu de votre site.

## Accès au Backoffice

Pour vous connecter, rendez-vous à l'adresse `[URL_DE_VOTRE_SITE]/admin/login`. Utilisez l'adresse e-mail et le mot de passe que vous avez configurés dans le service **Firebase Authentication** de votre projet Firebase.

Une fois connecté, vous arriverez sur le **Tableau de bord**.

## Navigation

Le menu latéral de gauche vous permet de naviguer entre les différentes sections de gestion :

- **Dashboard** : Vue d'ensemble et statistiques de votre contenu.
- **Projets** : Gérez les projets de votre portfolio.
- **Articles** : Rédigez et gérez les articles de votre blog.
- **Profil** : Mettez à jour vos informations personnelles.
- **Réseaux Sociaux** : Gérez les liens dans le pied de page.
- **CV** : Mettez à jour le lien de téléchargement de votre CV.

## 1. Gestion des Projets

Cette section vous permet de contrôler les projets affichés sur la page d'accueil de votre portfolio.

- **Pour créer un projet** : Cliquez sur le bouton "Nouveau Projet".
- **Pour modifier un projet** : Cliquez sur le menu "..." à droite de la ligne du projet et sélectionnez "Modifier".

### Formulaire de Projet

- **Publier** : Un interrupteur pour rendre le projet visible ou non sur le site public. Très utile pour préparer un projet en brouillon.
- **Titre** : Le nom de votre projet.
- **Résumé (Excerpt)** : Une phrase courte qui apparaît sur la carte du projet.
- **Contenu (Markdown)** : La description complète de votre projet. Vous pouvez utiliser la syntaxe Markdown pour le formatage (titres, listes, gras, etc.).
- **Catégorie** : La catégorie principale du projet (ex: "Développement Web", "Design UI/UX").
- **URL de l'image** : Le lien vers l'image principale de votre projet.
- **Logiciels / Technologies** : Une liste de technologies utilisées, séparées par des virgules (ex: "React, Figma, Next.js").
- **Liens de ressources** : Ajoutez des liens externes, comme un lien vers le site en ligne (`website`) ou le dépôt de code (`github`).

## 2. Gestion des Articles

Gérez ici les articles de votre blog.

- **Pour créer un article** : Cliquez sur "Nouvel Article".
- **Pour modifier un article** : Cliquez sur le menu "..." et choisissez "Modifier".

### Formulaire d'Article

- **Publier** : Rendez l'article visible publiquement sur la page `/blog`.
- **Titre, Résumé, Contenu** : Similaires au formulaire de projet. Le contenu est également en Markdown.
- **URL de l'image** : L'image de couverture de votre article.
- **Tags** : Mots-clés pour votre article, séparés par des virgules.

## 3. Gestion du Profil

Cette page contrôle les informations affichées sur la page "À Propos" et dans l'en-tête du site.

- **URL de la photo de profil** : L'image qui apparaît dans l'avatar de l'en-tête.
- **URL de l'image "À propos"** : La grande image sur la page "À propos de moi".
- **Biographie (Paragraphes 1, 2, 3)** : Le texte qui constitue votre biographie.

Toutes les modifications sont enregistrées lorsque vous cliquez sur "Sauvegarder les modifications".

## 4. Gestion des Réseaux Sociaux

Contrôlez les icônes et les liens qui apparaissent dans le pied de page de votre site.

- **Pour ajouter un lien** : Cliquez sur "Nouveau Lien".
- **Pour modifier un lien** : Utilisez le menu "..." à côté du lien.

### Formulaire de Lien Social

- **Nom** : Le nom du réseau (ex: "GitHub").
- **URL** : Le lien complet vers votre profil.
- **Icône (Lucide React)** : Le nom exact de l'icône tel qu'il apparaît sur le site [Lucide Icons](https://lucide.dev/icons/). Par exemple, `Github`, `Linkedin`, `Twitter`. La casse est importante.

## 5. Gestion du CV

Cette page contient un seul champ pour mettre à jour le lien de téléchargement de votre CV.

- **URL du CV** : Collez l'URL publique où votre CV (généralement un fichier PDF) est hébergé. Le bouton "Télécharger mon CV" sur le site pointera vers ce lien.

Toutes les modifications sont sauvegardées en temps réel. Vous pouvez ouvrir votre site public dans un autre onglet pour voir les changements s'appliquer instantanément.

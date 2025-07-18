# myHOMECas - Gestionnaire de Paris Sportifs

Une application React moderne pour gérer vos paris sportifs avec une interface mobile-first.

## Fonctionnalités

- ✅ Ajouter, modifier et supprimer des paris
- 📊 Statistiques en temps réel (nombre de paris, mise totale, profit, taux de réussite)
- 🎯 Interface optimisée pour mobile
- 💾 Sauvegarde automatique dans le localStorage
- 🎨 Design moderne avec Tailwind CSS
- 🏆 Support de multiples sports et types de paris

## Technologies utilisées

- **React 18** - Framework JavaScript
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Icônes modernes
- **LocalStorage** - Persistance des données

## Installation

1. Clonez le repository ou téléchargez les fichiers
2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```

4. Ouvrez votre navigateur à l'adresse `http://localhost:3000`

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint

## Utilisation

1. **Ajouter un pari** : Cliquez sur le bouton "Nouveau Pari" en bas de l'écran
2. **Remplir le formulaire** : 
   - Sport (obligatoire)
   - Match (obligatoire)
   - Type de pari (optionnel)
   - Sélection (optionnel)
   - Cote (obligatoire)
   - Mise (obligatoire)
   - Résultat (par défaut "En cours")
   - Date (par défaut aujourd'hui)

3. **Gérer les paris** :
   - Modifier : Cliquez sur l'icône crayon
   - Supprimer : Cliquez sur l'icône poubelle
   - Les statistiques se mettent à jour automatiquement

## Structure du projet

```
myhomecas/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── SportsBook.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Personnalisation

Vous pouvez facilement personnaliser :
- Les sports disponibles (ligne 28 dans SportsBook.jsx)
- Les types de paris (ligne 29 dans SportsBook.jsx)
- Les couleurs et le style via Tailwind CSS
- Ajouter de nouvelles fonctionnalités

## Déploiement sur GitHub Pages

### Méthode automatique (recommandée)
L'application se déploie automatiquement sur GitHub Pages à chaque push sur la branche `main` grâce à GitHub Actions.

### Méthode manuelle
1. Installez gh-pages si ce n'est pas déjà fait :
   ```bash
   npm install --save-dev gh-pages
   ```

2. Construisez et déployez :
   ```bash
   npm run deploy
   ```

### Configuration importante
- Le fichier `vite.config.js` est configuré avec `base: '/sports_bet/'` pour GitHub Pages
- Changez cette valeur selon le nom de votre repository GitHub
- L'application sera accessible à : `https://votre-username.github.io/sports_bet/`

### Autres plateformes
Vous pouvez aussi déployer sur :
- Vercel
- Netlify
- Ou tout autre service d'hébergement statique

## Support

Cette application fonctionne sur tous les navigateurs modernes et est optimisée pour les appareils mobiles.

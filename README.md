# Gestion Financière Africaine Moderne 🌍💸

Ce projet est une plateforme de gestion financière innovante, adaptée aux réalités économiques africaines tout en intégrant des principes de sagesse financière ancestrale (inspirés de Babylone) et des outils modernes de suivi.

## Fonctionnalités Spécifiques Africaines 🚀

L'application se distingue par l'intégration de concepts clés du paysage financier africain :

- **Argent Mobile (Mobile Money) :** Suivi intégré des transactions via les services de Mobile Money.
- **Franc CFA (FCFA) :** Utilisation native du FCFA comme monnaie de référence.
- **Tontines Numériques :** Gestion et suivi des contributions et des levées dans les tontines.
- **Épargne Communautaire :** Outils pour gérer l'épargne de groupe et les micro-investissements.
- **Réalités Économiques :** Prise en compte de la multi-activité (multiples sources de revenus) et de l'investissement dans l'économie réelle.

## Architecture du Projet

Le projet est divisé en deux parties principales :
- **Backend :** Développé avec **NestJS**, **TypeORM** et **PostgreSQL**.
- **Frontend :** Développé avec **Next.js 15**, **Tailwind CSS**, et **next-intl** pour le support multilingue (Français/Anglais).

---

## Installation et Mise en Place Locale 🛠️

### Prérequis

- Node.js (v18+)
- npm ou yarn
- PostgreSQL installé et en cours d'exécution

### 1. Base de Données

L'application utilise PostgreSQL. Vous devez créer un utilisateur avec les permissions de connexion et une base de données.

#### Option Rapide (Linux/macOS)
Exécutez le script de configuration fourni dans le dossier backend :
```bash
cd backend
./scripts/setup-db.sh
```

#### Configuration Manuelle
Si vous préférez configurer manuellement, exécutez les commandes suivantes dans votre terminal (en tant qu'utilisateur postgres) :
```sql
CREATE USER babylon WITH PASSWORD 'babylon' LOGIN;
CREATE DATABASE babylon_db OWNER babylon;
```

**Note importante :** Assurez-vous que l'utilisateur a l'attribut `LOGIN`, sinon vous rencontrerez une erreur "role is not permitted to log in".

L'application utilise par défaut les identifiants suivants (configurables via `.env`) :
- **Utilisateur :** `babylon`
- **Mot de passe :** `babylon`
- **Base de données :** `babylon_db`

### 2. Backend (NestJS)

1. Accédez au répertoire backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez le serveur en mode développement :
   ```bash
   npm run start:dev
   ```
Le serveur sera disponible sur `http://localhost:3001`.

### 3. Frontend (Next.js)

1. Accédez au répertoire frontend :
   ```bash
   cd frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
L'application sera accessible sur `http://localhost:3000`.

---

## Fonctionnalités Avancées

- **Système FEU (FIRE) :** Calcul de l'indépendance financière adapté aux coûts de la vie locaux.
- **Coach IA (Arkad) :** Conseils financiers basés sur la psychologie comportementale et les lois de Babylone.
- **Gamification :** Gagnez de l'XP et des badges en améliorant votre santé financière (règle des 10% d'épargne).
- **Analyse de Risque :** Détection automatique des habitudes de consommation dangereuses et propositions d'allocation d'actifs optimales.

## Licence

Ce projet est sous licence MIT.

# Projet Netflix viewer

> Lire attentivement _tout_ le sujet avant de commencer le projet.

## 1. Modalités Générales

- Durée : 5 semaines (rendu le 23 novembre 2025 à 23h59).
- Par groupe de 3 à 4 personnes.
- Langages libres (JavaScript/Node.js, Python, etc.).
- SGBD imposé : PostgreSQL, MongoDB, Neo4j, Elasticsearch.
- Rendu via un dépôt Git, pensez à inviter `decima`.

## 2. Objectif du Projet

L’objectif est de réaliser une chaîne complète de traitement de la donnée à partir d’un export Netflix : choisir un SGBD, concevoir un schéma, nettoyer et ingérer les données, puis développer une application web.

## 3. Contexte et Données

- Archive Netflix fournie ou personnelle.
- Données brutes nécessitant nettoyage.
- Contiennent historique de visionnage, profils, dates, appareils, etc.

## 4. Description des Tâches

### Étape 1 : Choix et prise en main du SGBD

### Étape 2 : Script d’ingestion et nettoyage

- Lire les fichiers Netflix.
- Nettoyer, transformer, enrichir via API externes (TMDB, IMDb, etc.).
- Insérer les données dans le SGBD.

### Étape 3 : Application web

#### Page Catalogue

- Liste films/séries
- Filtre type, année, recherche textuelle, genres (bonus)

#### Page Profil

- Stats du profil
- Top films/séries
- Goûts similaires
- Graphique activité

#### Page Détail Série

- Titre, description
- Épisodes vus
- Profils ayant visionné

#### Page Détail Film

- Titre, durée, année
- Profils ayant visionné

## 5. Rendu

Dépôt Github contenant code complet + README.md (installation, modèle de données, retours).

## 6. Barème

- Script d’ingestion : /5
- Modélisation : /5
- Fonctionnalités : /4
- Requêtage : /4
- Code : /1
- README : /1
- Bonus : originalité

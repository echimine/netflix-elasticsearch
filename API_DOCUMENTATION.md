# Documentation API

## Endpoints

### 1. Récupérer l'historique Netflix

**URL** : `/api/history`
**Méthode** : `GET`
**Description** : Récupère la liste de l'historique de visionnage depuis Elasticsearch.

#### Architecture

Cette route suit une architecture propre (Clean Architecture) :

1.  **Route** (`app/api/history/route.ts`) : Reçoit la requête HTTP.
2.  **Use Case** (`features/application/use-cases/get-all-history.use-case.ts`) : Contient la logique métier.
3.  **Repository** (`features/application/infrastructure/repositories/netflix.repository.ts`) : Interagit avec Elasticsearch.

#### Réponse (200 OK)

Renvoie un tableau d'objets JSON :

```json
[
  {
    "title": "Nom du film ou série",
    "date": "2023-10-27T20:00:00.000Z",
    "duration": 3600,
    "deviceType": "TV",
    "country": "FR (France)"
  },
  ...
]
```

#### Exemple d'appel

```bash
curl http://localhost:3000/api/history
```

# Guide des Requêtes Elasticsearch

Ce guide explique comment interroger votre index `historic_netflix` avec des exemples pratiques.

## Structure de base

L'URL de base pour les recherches est :
`GET http://localhost:9200/historic_netflix/_search`

## 1. Tout récupérer (`match_all`)
Récupère tous les documents (limité à 10 par défaut).

**Curl :**
```bash
curl -X GET "http://localhost:9200/historic_netflix/_search" -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "size": 20
}
'
```

## 2. Recherche textuelle (`match`)
Recherche floue sur un champ texte (ex: trouver "Narcos" dans le titre).

**Curl :**
```bash
curl -X GET "http://localhost:9200/historic_netflix/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "title": "Narcos"
    }
  }
}
'
```

## 3. Recherche exacte (`term`)
Pour filtrer sur des champs exacts (keyword) comme le pays ou le type d'appareil.
*Note : Pour les champs texte, utilisez `field.keyword` si disponible.*

**Curl :**
```bash
curl -X GET "http://localhost:9200/historic_netflix/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "term": {
      "country.keyword": "FR (France)"
    }
  }
}
'
```

## 4. Plage de valeurs (`range`)
Utile pour les dates ou les durées.
Exemple : Contenus vus après le 1er Janvier 2024.

**Curl :**
```bash
curl -X GET "http://localhost:9200/historic_netflix/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "range": {
      "date": {
        "gte": "2024-01-01"
      }
    }
  }
}
'
```

## 5. Combinaison (`bool`)
Permet de combiner plusieurs conditions :
- `must` : DOIT correspondre (ET)
- `should` : DEVRAIT correspondre (OU)
- `must_not` : NE DOIT PAS correspondre (NON)

Exemple : Titres contenant "Episode" vus en France.

**Curl :**
```bash
curl -X GET "http://localhost:9200/historic_netflix/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "Episode" } },
        { "term": { "country.keyword": "FR (France)" } }
      ]
    }
  }
}
'
```

## 6. Agrégations (`aggs`)
Pour faire des statistiques (ex: compter les titres par pays).

**Curl :**
```bash
curl -X GET "http://localhost:9200/historic_netflix/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "par_pays": {
      "terms": {
        "field": "country.keyword",
        "size": 10
      }
    }
  }
}
'
```

## Utilisation avec Node.js

Voici comment traduire une requête `bool` avec le client JavaScript :

```javascript
const result = await client.search({
  index: 'historic_netflix',
  body: {
    query: {
      bool: {
        must: [
          { match: { title: 'Episode' } },
          { term: { 'country.keyword': 'FR (France)' } }
        ]
      }
    }
  }
});
```

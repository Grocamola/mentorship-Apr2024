/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "pooxhd6r1ij3obn",
    "created": "2024-05-07 00:43:24.642Z",
    "updated": "2024-05-07 00:43:24.642Z",
    "name": "Board",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tvrwaggf",
        "name": "boardInfo",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != ''",
    "viewRule": "@request.auth.id != ''",
    "createRule": "@request.auth.id != ''",
    "updateRule": "@request.auth.id != ''",
    "deleteRule": "@request.auth.id != ''",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pooxhd6r1ij3obn");

  return dao.deleteCollection(collection);
})

// *******************************************************************************
// Imports
// *******************************************************************************

const settings  = require('../../shared/settings');
const databases = require('../loader.js');
const errors    = require('./fabrication-errors');

// *******************************************************************************
// Functions
// *******************************************************************************

function getAllFabricationMeta() {
  return new Promise((resolve, reject) => {
    return databases.fabricationsMeta.find({}).exec((err, fabrMeta) => {
      if (err) return reject(err);
      if (!fabrMeta) return reject(errors.ERROR_FABR_META_READ);
      return resolve(fabrMeta);
    });
  });
}

// *******************************************************************************

function setOneFabricationMeta(query, data) {
  return new Promise((resolve, reject) => {
    return databases.fabricationsMeta.update(
        query, { $set: data }, { upsert: true }, (err, numUpdated) => {

      if (err) return reject(err);
      if (numUpdated <= 0) return reject(errors.ERROR_FABR_META_UPDATE);
      return resolve(getAllFabricationMeta());
    });
  });
}

// *******************************************************************************

function unsetOneFabricationMeta(query) {
  return new Promise((resolve, reject) => {
    return databases.fabricationsMeta.remove(query, (err) => {
      if (err) return reject(err);
      return resolve(null);
    });
  });
}

// // *******************************************************************************

// function createFabricationMeta(metaNew) {
//   return new Promise((resolve, reject) => {
//     return databases.fabricationsMeta.insert(metaNew, (err, fabrMeta) => {
//       if (err) {
//         return reject(err);
//       }
//       if (!fabrMeta) {
//         return reject(errors.ERROR_FABR_META_CREATE);
//       }
//       return resolve(fabrMeta);
//     });
//   });
// }

// // *******************************************************************************

// function readFabricationMeta(query = {}) {
//   return new Promise((resolve, reject) => {
//     return databases.fabricationsMeta.find(query).exec((err, fabrMeta) => {
//       if (err) return reject(err);
//       if (!fabrMeta) return reject(errors.ERROR_FABR_META_READ);
//       return resolve(fabrMeta);
//     });
//   });
// }

// // *******************************************************************************

// function updateFabricationMeta(query, data) {
//   return new Promise((resolve, reject) => {
//     return databases.fabricationsMeta.update(query, data, (err, fabrications) => {
//       if (err) return reject(err);
//       if (!fabrications) return reject(errors.ERROR_FABR_META_UPDATE);
//       return resolve(fabrications);
//     });
//   });
// }

// // *******************************************************************************

// function deleteFabricationMeta(query) {
//   return new Promise((resolve, reject) => {
//     return databases.fabricationsMeta.remove(query, (err) => {
//       if (err) return reject(err);
//       return resolve(null);
//     });
//   });
// }

// *******************************************************************************
// Exports
// *******************************************************************************

module.exports.getAllFabricationMeta   = getAllFabricationMeta;
module.exports.setOneFabricationMeta   = setOneFabricationMeta;
module.exports.unsetOneFabricationMeta = unsetOneFabricationMeta;

// module.exports.createFabricationMeta = createFabricationMeta;
// module.exports.readFabricationMeta   = readFabricationMeta;
// module.exports.updateFabricationMeta = updateFabricationMeta;
// module.exports.deleteFabricationMeta = deleteFabricationMeta;

// *******************************************************************************

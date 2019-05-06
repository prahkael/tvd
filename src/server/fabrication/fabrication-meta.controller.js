// *****************************************************************************
// Imports
// *****************************************************************************

const router          = require('express').Router();

const fabrMetaService = require('./fabrication-meta.service.js');
const errors          = require('./fabrication-errors');

// *****************************************************************************
// Routes
// *****************************************************************************

router.get('/fabrications-meta',         getAllFabricationMeta);
router.put('/fabrications-meta/:_id',    setOneFabricationMeta);
router.delete('/fabrications-meta/:_id', unsetOneFabricationMeta);

// *****************************************************************************
// Functions
// *****************************************************************************

async function getAllFabricationMeta(req, res, next) {
  let metaAll;

  try {
    metaAll = await fabrMetaService.getAllFabricationMeta();
  } catch (err) {
    res.status(500);
    return next(err);
  }

  return res.status(200).json(metaAll);
}

// *****************************************************************************

async function setOneFabricationMeta(req, res, next) {
  const _id = req.params && req.params._id;
  if (!_id) {
    return next(errors.ERROR_FABR_META_ID_MISSING);
  }

  const metaData = req.body && req.body.data;
  if (!metaData) {
    return next(errors.ERROR_FABR_META_DATA_MISSING);
  }

  let metaAllUpdated;
  try {
    metaAllUpdated = await fabrMetaService
        .setOneFabricationMeta({ _id }, metaData);
  } catch (err) {
    res.status(500);
    return next(err);
  }

  return res.status(200).json(metaAllUpdated);
}

// *****************************************************************************

async function unsetOneFabricationMeta(req, res, next) {
  const _id = req.params && req.params._id;
  if (!_id) {
    return next(errors.ERROR_FABR_META_ID_MISSING);
  }

  try {
    await fabrMetaService.deleteFabricationMeta({ _id });
  } catch (err) {
    res.status(500);
    return next(err);
  }

  return res.status(200).json({ deleted: true });
}

// *****************************************************************************

// async function createOneFabricationMeta(req, res, next) {
//   const workOrderId = req.body && req.body.data && req.body.data.workOrderId;
//   if (!workOrderId) {
//     return next(errors.ERROR_FABR_META_DATA_MISSING);
//   }

//   const metaRaw = req.body && req.body.data && req.body.data.meta;
//   if (!metaRaw) {
//     return next(errors.ERROR_FABR_META_DATA_MISSING);
//   }

//   const metaNew = { _id: workOrderId, ...metaRaw };
//   let metaCreated;
//   try {
//     metaCreated = await fabrMetaService
//         .createFabricationMetaForWorkorder(workOrderId, metaNew);
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }

//   return res.status(200).json({ data: metaCreated });
// }

// // *****************************************************************************

// async function readAllFabricationMeta(req, res, next) {
//   let metaAll;
//   try {
//     metaAll = await fabrMetaService.readFabricationMeta();
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }

//   return res.status(200).json({ data: metaAll });
// }

// // *****************************************************************************

// async function readOneFabricationMetaById(req, res, next) {
//   const _id = req.params && req.params._id;
//   if (!_id) {
//     return next(errors.ERROR_FABR_META_ID_MISSING);
//   }

//   let meta;
//   try {
//     meta = await fabrMetaService.readFabricationMeta({ _id });
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }

//   return res.status(200).json({ data: meta });
// }

// // *****************************************************************************

// async function updateOneFabricationMetaById(req, res, next) {
//   const _id  = req.params && req.params._id;
//   const metaNew = req.body && req.body.data;
//   if (!_id) {
//     return next(errors.ERROR_FABR_META_ID_MISSING);
//   }
//   if (!metaNew) {
//     return next(errors.ERROR_FABR_META_DATA_MISSING);
//   }

//   let metaUpdated;
//   try {
//     metaUpdated = await fabrMetaService.updateFabricationMeta({ _id }, metaNew);
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }

//   return res.status(200).json({ data: metaUpdated });
// }

// // *****************************************************************************

// async function deleteOneFabricationMeta() {
//   const _id = req.params && req.params._id;
//   if (!_id) {
//     return next(errors.ERROR_FABR_META_ID_MISSING);
//   }

//   try {
//     await fabrMetaService.deleteFabricationMeta({ _id });
//   } catch (err) {
//     res.status(500);
//     return next(err);
//   }

//   return res.status(200).json({ data: true });
// }

// *****************************************************************************
// Helpers
// *****************************************************************************

// *****************************************************************************
// Exports
// *****************************************************************************

module.exports = router;

// *****************************************************************************

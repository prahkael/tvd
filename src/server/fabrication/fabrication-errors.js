(function(){

// *****************************************************************************
// Errors
// *****************************************************************************

// meta controller errors
module.exports.ERROR_FABR_META_ID_MISSING = {
  status : 400,
  message: 'Work order id of the fabrication is missing!' };
module.exports.ERROR_FABR_META_WORK_ORDER_ID_MISSING = {
  status : 400,
  message: 'Id of the fabrication meta is missing!' };
module.exports.ERROR_FABR_META_DATA_MISSING = {
  status : 400,
  message: 'Fabrication meta data is missing!' };

// meta service errors
module.exports.ERROR_FABR_META_CREATE = {
  status : 500,
  message: 'Fabrication meta not created!' };
module.exports.ERROR_FABR_META_READ = {
  status : 500,
  message: 'Fabrication meta not found!' };
module.exports.ERROR_FABR_META_UPDATE = {
  status : 500,
  message: 'Fabrication meta not updated!' };
module.exports.ERROR_FABR_META_DELETE = {
  status : 500,
  message: 'Fabrication meta not deleted!' };

// *****************************************************************************

})();

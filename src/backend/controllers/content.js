'use strict';

exports.create = (data, req, res, next) => {
  console.log(req.body)
  return res.json({})
};

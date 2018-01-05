'use strict';

exports.create = async (req, res, next) => {
  try {
    const { media, schedule, message } = req.body;
    return res.json({})
  } catch (err) {
    console.error(err)
    next(err)
  }
};

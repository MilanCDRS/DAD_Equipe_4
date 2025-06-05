/**
 * File : requiredFields.middleware.js
 * Description : Middleware to validate that certain fields are present in the request body.
 */

const { response } = require("express");

module.exports = (requiredFields) => (req, res, next) => {
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  // le filter qu'on voit au dessus fait l'équivalent du foreach + push qu'on a vu dans le workshop
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Somme required fields are missing",
      missingFields,
    });
  }

  next();
};

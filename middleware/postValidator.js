const { check, validationResult } = require("express-validator");

exports.posstValidator = [
  check("title").trim().not().isEmpty().withMessage("title is required"),
  check("content").trim().not().isEmpty().withMessage("content is required"),
  check("meta").trim().not().isEmpty().withMessage("meta is required"),
  check("slug").trim().not().isEmpty().withMessage("slug is required"),
  check("tags")
    .isArray()
    .withMessage("tag must be array of string")
    .custom((tags) => {
        console.log('yags', tags)
      for (const t of tags) {
        if (typeof t != "string") {
          throw Error("tags must be string");
        }
      }
      return true;
    }),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    console.log("error", error);
    res.status(401).json({ error: error[0].msg });
  }
  next();
};

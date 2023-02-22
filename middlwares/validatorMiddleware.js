const { param, validationResult } = require('express-validator');

const ValidatorMiddlware =(req, res,next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
// 2 - middlware => catch errors from rules if exits! before enter to handler getCategory and not send req to db 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports=ValidatorMiddlware;
'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

    if (text === undefined || locale === undefined) {
      return res.status(400).json({ error: 'Required field(s) missing' });
    }

    if (locale !== "american-to-british" && locale !== "british-to-american") return res.json({ error: 'Invalid value for locale field' });



    const result = Translator.translate(text, locale);

    if (result.error) {
        return res.status(400).json(result);
    }
    res.json({"text": text,
      "translation":result.translation});
    });
};

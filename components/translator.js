const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
  constructor() {
    this.britishToAmericanSpelling = Object.fromEntries(
      Object.entries(americanToBritishSpelling).map(([key, value]) => [value, key])
    );

    this.britishToAmericanTitles = Object.fromEntries(
      Object.entries(americanToBritishTitles).map(([key, value]) => [value, key.replace('.', '')])
    );
  }

  translate(text, locale) {
    if (!text) return { error: 'No text to translate' };

    let dictionary, titles, timeRegex, timeReplacement;
    if (locale === 'american-to-british') {
      dictionary = { ...americanOnly, ...americanToBritishSpelling };
      titles = americanToBritishTitles;
      timeRegex = /(\d{1,2}):(\d{2})/g;
      timeReplacement = (match, p1, p2) => `<span class="highlight">${p1}.${p2}</span>`;
    } else if (locale === 'british-to-american') {
      dictionary = { ...britishOnly, ...this.britishToAmericanSpelling };
      titles = this.britishToAmericanTitles;
      timeRegex = /(\d{1,2})\.(\d{2})/g;
      timeReplacement = (match, p1, p2) => `<span class="highlight">${p1}:${p2}</span>`;
    } else {
      return { error: 'Invalid value for locale field' };
    }

    let translation = text;

    // Replace time formats
    translation = translation.replace(timeRegex, timeReplacement);

    
    translation = translation.replace(
        /\b(mrs|mr|ms|mx|dr|prof)\.?/gi,
        (match, group1) => {
          // Capitalize the first letter and handle the period logic
          const capitalized = group1.charAt(0).toUpperCase() + group1.slice(1).toLowerCase();
          return `<span class="highlight">${match.endsWith('.')
            ? capitalized
            : capitalized + '.'}</span>`
        }
      );

    // Replace words and phrases
    for (const [word, replacement] of Object.entries(dictionary)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        translation = translation.replace(
            regex,
            (match) => {
                // Skip replacement if the match is already highlighted
                if (translation.includes(`<span class="highlight">${match}</span>`)) {
                    return match; 
                }
                return `<span class="highlight">${replacement}</span>`;
            }
        );
    }




    return text === translation ? { translation: 'Everything looks good to me!' } : { translation };
  }
}

module.exports = new Translator();

import Polyglot from 'node-polyglot';
import { messages } from '../config/i18n';

const startPolyglot = (req, res, next) => {
  // Parse the Accept-Language header
  const acceptLanguage = req.headers['accept-language'];

  // Start Polyglot and add it to the req
  req.polyglot = new Polyglot();

  // Decide which phrases for polyglot will be used
  if (acceptLanguage === 'ar') {
    req.polyglot.extend(messages.ar);
  } else {
    req.polyglot.extend(messages.en);
  }

  next();
};

export default startPolyglot;

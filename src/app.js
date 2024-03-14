// Packages
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUI from 'swagger-ui-express';
import createLocaleMiddleware from 'express-locale';

// Configs
import config from './config/config';
import { successHandle, errorHandle } from './config/morgan';

// Middlewares
import limiter from './middlewares/rateLimiter';

// Utils
import errorHandler from './utils/errorHandler';
import AppError from './utils/appError';
import startPolyglot from './utils/startPolyglot';

// Documentation
import docs from '../docs/swagger';

// Routes
import routes from './routes';

const app = express();

app.enable('trust proxy');

// Morgan Handler
app.use(successHandle);
app.use(errorHandle);

// Set security HTTP headers
app.use(helmet());

// Set Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Get the user's locale, and set a default in case there's none
app.use(
  createLocaleMiddleware({
    priority: ['accept-language', 'default'],
    default: 'en_US'
  })
);

// Start polyglot and set the language in the req with the phrases to be used
app.use(startPolyglot);

// Data sanitization against XSS
app.use(xss());

// MongoDB data sanitization
app.use(mongoSanitize());

// Implement CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.options('*', cors());

// Set headers to allow certain HTTP methods and credentials
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use(compression());

// Getting rid of unnesacry x-powered-by Express
app.disable('x-powered-by');

// Limit Repeated Failed Requests to Auth Endpoints
if (config.env === 'production') {
  app.use('/api', limiter);
}

// API Routes
app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

// When someone access route that does not exist
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
app.use(errorHandler);

/**
 * Exports Express
 * @public
 */
export default app;

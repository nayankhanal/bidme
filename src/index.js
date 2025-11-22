import express from 'express';
import { fileURLToPath } from 'url'
import path from 'path';
import webRoutes from './routes/web.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import sellerRoutes from './routes/seller.js';
import expressLayouts from 'express-ejs-layouts';

import session from 'express-session';
import flash from 'connect-flash';

import { isGuest } from './middlewares/auth.middleware.js';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET || 'somesecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

app.use(flash());

// Make flash messages available in all EJS templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});



// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use('/', webRoutes);
app.use('/admin', adminRoutes);
app.use('/', isGuest, authRoutes);
app.use('/seller', sellerRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
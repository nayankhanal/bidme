import express from 'express';
import { fileURLToPath } from 'url'
import path from 'path';
import webRoutes from './routes/web.js';
import expressLayouts from 'express-ejs-layouts';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

app.use('/', webRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
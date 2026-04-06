import 'dotenv/config.js';

import authApiRoutes from './routes/api/authApiRoute.js';
import productApiRoutes from './routes/api/warehouse/productApiRoute.js';
import supplierApiRoutes  from './routes/api/warehouse/supplierApiRoute.js';
import categoryApiRoutes from './routes/api/warehouse/categoryApiRoute.js';
import uomApiRoutes from './routes/api/warehouse/uomApiRoute.js';
import goodsReceiptApiRoutes from './routes/api/warehouse/goodsReceiptApiRoute.js';
import purchaseRequisitionApiRoutes from './routes/api/warehouse/purchaseRequisitionApiRoute.js';
import projectApiRoutes from './routes/api/warehouse/projectApiRoute.js';
import profileApiRoutes from './routes/api/admin/profileApiRoute.js';

import loginWebRoutes from './routes/web/auth/loginWebRoute.js';
import logoutWebRoutes from './routes/web/auth/logoutWebRoute.js';
import refreshWebRoutes from './routes/web/auth/refreshWebRoute.js';
import homeWebRoutes from './routes/web/homeWebRoute.js';
import productWebRoutes from './routes/web/warehouse/productWebRoute.js';
import supplierWebRoutes from './routes/web/warehouse/supplierWebRoute.js';
import purchaseRequisitionWebRoutes from './routes/web/warehouse/purchaseRequisitionWebRoute.js';
import goodsReceiptWebRoutes from './routes/web/warehouse/goodsReceiptWebRoute.js';
import goodsIssueWebRoutes from './routes/web/warehouse/goodsIssueWebRoute.js';

import { checkTypeContentJson, checkTypeContentFile, checkContentTypePlainText } from './middleware/contentTypeMiddleware.js';
import cookieParser from 'cookie-parser';

import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { publicDir, viewsDir } from './utils/pathsUtils.js';
import { errorMap } from './messages/codeMessages.js';

const app = express();
const rootRoute = '/';
const apiRoute = '/api';
const textRoute = '/text';
const uploadRoute = '/upload';
const authRoute = '/auth';
const warehouse = '/warehouse';
const admin = '/admin';

app.set('views', viewsDir);
app.set('view engine', 'ejs');

app.use(expressEjsLayouts);
app.set('layout', 'layout/base');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(rootRoute, express.static(publicDir));

app.use(apiRoute, express.json());
app.use(textRoute, express.text({ type: 'text/plain' }));
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

//middleware
app.use(apiRoute, checkTypeContentJson);
app.use(uploadRoute, checkTypeContentFile);
app.use(textRoute, checkContentTypePlainText);

app.use((req, res, next) => {
    res.locals.flash = req.cookies.flash || null;
    res.clearCookie('flash');
    next();
});

// web routes
app.use(rootRoute, homeWebRoutes);
app.use('/inicio-sesion', loginWebRoutes);
app.use('/revocar-sesion', refreshWebRoutes);
app.use('/cerrar-sesion', logoutWebRoutes);
app.use('/productos', productWebRoutes);
app.use('/proveedores', supplierWebRoutes);
app.use('/requisiciones', purchaseRequisitionWebRoutes);
app.use('/recepciones-compra', goodsReceiptWebRoutes);
app.use('/salidas-almacen', goodsIssueWebRoutes);

// api routes
app.use(apiRoute + authRoute, authApiRoutes);
app.use(apiRoute + warehouse + '/products', productApiRoutes);
app.use(apiRoute + warehouse + '/suppliers', supplierApiRoutes);
app.use(apiRoute + warehouse + '/categories', categoryApiRoutes);
app.use(apiRoute + warehouse + '/uoms', uomApiRoutes);
app.use(apiRoute + warehouse + '/goods-receipts', goodsReceiptApiRoutes);
app.use(apiRoute + warehouse + '/purchase-requisitions', purchaseRequisitionApiRoutes);
app.use(apiRoute + warehouse + '/projects', projectApiRoutes);
app.use(apiRoute + admin + '/profiles', profileApiRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: errorMap.message.SERVER_ERROR });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
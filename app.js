import 'dotenv/config.js';

import authApiRoutes from './routes/api/authApiRoute.js';
import categoryApiRoutes from './routes/api/warehouse/categoryApiRoute.js';

import loginWebRoutes from './routes/web/auth/loginWebRoute.js';
import logoutWebRoutes from './routes/web/auth/logoutWebRoute.js';
import refreshWebRoutes from './routes/web/auth/refreshWebRoute.js';
import homeWebRoutes from './routes/web/homeWebRoute.js';
import productWebRoutes from './routes/web/warehouse/productWebRoute.js';
import supplyWebRoutes from './routes/web/warehouse/supplyWebRoute.js';
import categoryWebRoutes from './routes/web/warehouse/categoryWebRoute.js';
import supplierWebRoutes from './routes/web/warehouse/supplierWebRoute.js';
import purchaseOrderWebRoutes from './routes/web/warehouse/purchaseOrderWebRoute.js';
import purchaseRequisitionWebRoutes from './routes/web/warehouse/purchaseRequisitionWebRoute.js';
import requisitionReturnWebRoutes from './routes/web/warehouse/requisitionReturnWebRoute.js';
import goodsReceiptWebRoutes from './routes/web/warehouse/goodsReceiptWebRoute.js';
import orderReturnsWebRoutes from './routes/web/warehouse/orderReturnsWebRoute.js';
import goodsIssueWebRoutes from './routes/web/warehouse/goodsIssueWebRoute.js';
import inventoryAdjustmentWebRoutes from './routes/web/warehouse/inventoryAdjustmentWebRoute.js';
import reportWebRoutes from './routes/web/warehouse/reportWebRoute.js';
import userWebRoutes from './routes/web/admin/userWebRoute.js';

import { checkTypeContentJson, checkTypeContentFile, checkContentTypePlainText } from './middleware/contentTypeMiddleware.js';
import cookieParser from 'cookie-parser';

import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { publicDir, viewsDir } from './utils/pathsUtils.js';
import { errorCodeMessages } from './messages/codeMessages.js';

const app = express();
const rootRoute = '/';
const apiRoute = '/api';
const textRoute = '/text';
const uploadRoute = '/upload';
const authRoute = '/auth';
const warehouse = '/warehouse';

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
app.use('/insumos', supplyWebRoutes);
app.use('/categorias', categoryWebRoutes);
app.use('/proveedores', supplierWebRoutes);
app.use('/compras', purchaseOrderWebRoutes);
app.use('/requisiciones', purchaseRequisitionWebRoutes);
app.use('/devoluciones-requisicion', requisitionReturnWebRoutes);
app.use('/recepciones-compra', goodsReceiptWebRoutes);
app.use('/devoluciones-compra', orderReturnsWebRoutes);
app.use('/salidas-almacen', goodsIssueWebRoutes);
app.use('/ajustes-inventario', inventoryAdjustmentWebRoutes);
app.use('/reportes', reportWebRoutes);
app.use('/usuarios', userWebRoutes);

// api routes
app.use(apiRoute + authRoute, authApiRoutes);
app.use(apiRoute + warehouse + '/categories', categoryApiRoutes);

app.use((req, res, next) => {
    res.status(405).json({ message: 'Método HTTP no permitido.' });
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: errorCodeMessages.SERVER_ERROR });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
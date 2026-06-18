# Cobertura pendiente de pruebas de servicios

Este documento resume el estado actual de pruebas para `src/services` y sirve como checklist para ampliar la suite.

## Servicios con pruebas actuales

La suite ya cubre helpers puros o parcialmente aislados en:

- `src/services/inventory/stockHelpers.js`
- `src/services/warehouse/goodsIssues/goodsIssueHelpers.js`
- `src/services/warehouse/goodsReceipts/goodsReceiptHelpers.js`
- `src/services/warehouse/products/supplierProductService.js`

## Servicios sin pruebas directas

Todavía faltan pruebas directas para la mayor parte de servicios que consultan o modifican datos:

- Administración: `departmentService`, `profileService`, `roleService`, `userService`.
- Autenticación y seguridad: `authService`, `jwtService`, `roleService` raíz.
- Documentos: `referenceNumberService`.
- Inventario: `movementQueryService`, `movementService`, `reportService`.
- Ventas: `clientService`.
- Almacén: `adjustmentService`, `fulfillmentStatusService`, `goodsIssueService`, `goodsReceiptService`, `notificationService`, `presentationService`, `productHelpers`, `productRelations`, `productService`, `purchaseRequisitionService`, `reasonService`, `reportService`, `supplierService`, `unitMeasureService`, `wasteService`.

## Servicios relacionados a submit

Los submits de formularios/API llaman principalmente servicios de creación o actualización. Al revisar los controladores `src/controllers/api`, faltan pruebas directas para estos servicios de submit:

- Ventas: `clientService.createClient` y `clientService.updateClient`.
- Administración: `userService.createUser`, `userService.updateUser`, `userService.updateUserPassword`, `profileService.createProfile` y `profileService.updateProfile`.
- Almacén/catálogos: `supplierService.createSupplier`, `supplierService.updateSupplier`, `productService.createProduct`, `productService.updateProduct` y `productService.updateProductStock`.
- Almacén/documentos transaccionales: `purchaseRequisitionService.createPurchaseRequisition`, `purchaseRequisitionService.updatePurchaseRequisition`, `goodsIssueService.createGoodsIssue`, `goodsIssueService.updateGoodsIssue`, `goodsIssueService.updateGoodsIssueDetails` y `goodsReceiptService.createGoodsReceipt`.
- Merma/ajustes: `wasteService.createWasteAdjustment`, `wasteService.updateWaste`, `wasteService.updateWasteStock` y `adjustmentService.createStockAdjustment`.

Estas pruebas deben validar casos exitosos, errores de dominio, duplicados, cambios de stock, estados, rollback transaccional y efectos colaterales como notificaciones o movimientos de inventario.

## Prioridad sugerida

1. **Servicios transaccionales de inventario y almacén**: `movementService`, `goodsIssueService`, `goodsReceiptService`, `purchaseRequisitionService`, `wasteService` y `adjustmentService`. Validan stock, estados y efectos colaterales; deben correr con `npm run test:db` y rollback por prueba.
2. **Servicios CRUD con reglas de negocio**: `productService`, `supplierService`, `clientService`, `userService`, `profileService`. Deben cubrir creación, actualización, duplicados y errores de dominio.
3. **Servicios de soporte**: `referenceNumberService`, `notificationService`, `jwtService`, reportes y catálogos (`role`, `department`, `presentation`, `reason`, `unitMeasure`, `fulfillmentStatus`).

## Implicación para CI

Para estas pruebas de servicios no basta con `npm run test` si dependen de Prisma o migraciones. Deben ejecutarse en CI con `npm run test:db`, porque ese script valida `DATABASE_TEST_URL`, aplica migraciones y después corre Vitest contra la base de pruebas.

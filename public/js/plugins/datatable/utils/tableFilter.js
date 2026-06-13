import { getProductOptions } from "../../../application/warehouse/products.js";
import { getSupplierOptions } from "../../../application/warehouse/suppliers.js";
import { getFulfillmentStatusOptions } from "../../../application/warehouse/fulfillmentStatuses.js";
import { clearTableFilters, isClearingFilters } from "../../../ui/tableUI.js";
import { on } from "../../../utils/domUtils.js";
import { bindDisabledSelectDependency } from "../../select2/baseSelect.js";
import { attachProductFilterHandler, getProductSelectApi, initProductFilterSelect, toggleProductOption } from "../../select2/domains/product.js";
import { attachSupplierFilterHandler, getSupplierSelectApi, initSupplierFilterSelect } from "../../select2/domains/supplier.js";
import { attachFulfillmentStatusFilterHandler, getFulfillmentStatusSelectApi, initFulfillmentStatusFilterSelect } from "../../select2/domains/fulfillmentStatus.js";

const startDateSelector = '#startDateInput';
const endDateSelector = '#endDateInput';
const productFilterSelector = '#productFilter';
const supplierFilterSelector = '#supplierFilter';

export const getDateFilterApi = () => ({
    getValues: () => ({
        startDate: document.querySelector(startDateSelector)?.value || '',
        endDate: document.querySelector(endDateSelector)?.value || ''
    })
});

export const attachDateFilterHandler = ({
    onChange
}) => {

    $(startDateSelector).on('change', () => {
        onChange?.();
    });

    $(endDateSelector).on('change', () => {
        onChange?.();
    });
};

export const createTableFilterChangeHandler = ({
    getTable
}) => () => {

    if (isClearingFilters) return;

    getTable()?.ajax.reload();
};

export const attachClearFiltersHandler = ({
    getTable
}) => {

    on('click', '#clearFiltersButton', (e) => {

        clearTableFilters(getTable());

        e.target.blur();
    });
};

const bindSupplierProductFilterDependency = () => {

    bindDisabledSelectDependency({
        sourceSelector: supplierFilterSelector,
        targetSelector: productFilterSelector,
        clearTarget: () => {
            toggleProductOption({
                selector: productFilterSelector,
                data: {
                    id: null,
                    text: null
                }
            });

            $(productFilterSelector).val(null).trigger('change');
        }
    });
};

export const buildDateFilterConfig = ({
    onChange
}) => ({
    customGetValues: () => ({
        startDate: document.querySelector(startDateSelector)?.value || '',
        endDate: document.querySelector(endDateSelector)?.value || ''
    }),
    attachHandler: () => attachDateFilterHandler({
        onChange
    })
});

export const buildSupplierFilterConfig = ({
    onChange
}) => ({
    key: 'supplierId',
    isSelected: false,
    getSelectApi: getSupplierSelectApi,
    getOptions: getSupplierOptions,
    initSelect: initSupplierFilterSelect,
    attachHandler: () => attachSupplierFilterHandler({
        onChange
    })
});

export const buildProductFilterConfig = ({
    onChange
}) => ({
    key: 'productId',
    isSelected: false,
    getSelectApi: getProductSelectApi,
    getOptions: getProductOptions,
    initSelect: ({ selectedId }) => initProductFilterSelect({ selectedId, supplierFilterSelector }),
    attachHandler: () => attachProductFilterHandler({
        onChange
    })
});

export const buildFulfillmentStatusFilterConfig = ({
    onChange
}) => ({
    key: 'fulfillmentStatusId',
    getSelectApi: getFulfillmentStatusSelectApi,
    getOptions: getFulfillmentStatusOptions,
    initSelect: initFulfillmentStatusFilterSelect,
    attachHandler: () => attachFulfillmentStatusFilterHandler({
        onChange
    })
});

const setupSupplierProductDateTableFilters = async ({
    onChange,
    filters = []
} = {}) => {

    bindSupplierProductFilterDependency();

    return setupTableFilters({
        filters: [
            buildDateFilterConfig({ onChange }),
            ...filters,
            buildSupplierFilterConfig({ onChange }),
            buildProductFilterConfig({ onChange })
        ]
    });
};

export const setupGoodsReceiptTableFilters = async ({
    onChange
} = {}) => setupSupplierProductDateTableFilters({
    onChange
});

export const setupGoodsIssueTableFilters = async ({
    onChange
} = {}) => setupSupplierProductDateTableFilters({
    onChange,
    filters: [
        buildFulfillmentStatusFilterConfig({ onChange })
    ]
});

export const setupMovementStyleTableFilters = async ({
    onChange,
    filters = []
} = {}) => setupSupplierProductDateTableFilters({
    onChange,
    filters
});

export const setupTableFilters = async ({
    filters = []
} = {}) => {

    const values = {};

    for (const filter of filters) {

        const {
            key,
            isSelected = true,
            getSelectApi,
            getOptions,
            initSelect,
            attachHandler
        } = filter;

        if (filter.customGetValues) {

            values[key || crypto.randomUUID()] = filter.customGetValues;

            if (attachHandler) attachHandler();

            continue;
        }

        const { getSelect, getValue } = getSelectApi();

        const select = getSelect();

        if (!select) continue;

        const options = await getOptions();

        select.options.length = 0;

        options.forEach((option) => {
            select.add(
                new Option(
                    option.label,
                    option.value,
                    false,
                    false
                )
            );
        });

        initSelect({
            selectedId: isSelected ? options[0]?.value : null
        });

        if (attachHandler) attachHandler();

        values[key] = () => ({
            [key]: getValue?.() || ''
        });
    }

    return {
        getValues: () => {
            return Object.assign(
                {},
                ...Object.values(values).map(getter => getter())
            );
        }
    };
};

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

const getDataTable = (selector = '#table') => {

    if (!$.fn.DataTable.isDataTable(selector)) return null;

    return $(selector).DataTable();
};

const attachClearFiltersHandler = (selector = '#table') => {

    on('click', '#clearFiltersButton', (e) => {

        clearTableFilters(getDataTable(selector));

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

const buildDateFilterConfig = ({
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

const buildSupplierFilterConfig = ({
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

const buildProductFilterConfig = ({
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

const buildFulfillmentStatusFilterConfig = ({
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

const tableFilterConfigBuilders = {
    date: buildDateFilterConfig,
    supplier: buildSupplierFilterConfig,
    product: buildProductFilterConfig,
    fulfillmentStatus: buildFulfillmentStatusFilterConfig
};

const resolveTableFilterConfig = ({
    field,
    onChange
}) => {

    if (typeof field !== 'string') return field;

    return tableFilterConfigBuilders[field]?.({ onChange });
};

const buildTableFilterConfigs = ({
    fields,
    onChange
}) => fields
    .map((field) => resolveTableFilterConfig({ field, onChange }))
    .filter(Boolean);

export const setupTableFilters = async ({
    fields = [],
    selector = '#table'
} = {}) => {

    const onChange = () => {

        if (isClearingFilters) return;

        getDataTable(selector)?.ajax.reload();
    };

    attachClearFiltersHandler(selector);

    if (fields.includes('supplier') && fields.includes('product')) {
        bindSupplierProductFilterDependency();
    }

    const filters = buildTableFilterConfigs({
        fields,
        onChange
    });

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

            if (attachHandler) attachHandler({ onChange });

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

        if (attachHandler) attachHandler({ onChange });

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

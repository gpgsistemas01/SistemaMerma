import { describe, expect, it } from 'vitest';
import ejs from 'ejs';

describe('select column layout partials', () => {
    it('normalizes select column classes without duplicating col prefixes', async () => {
        const html = await ejs.renderFile('src/views/shared/selectList.ejs', {
            inputs: [
                {
                    id: 'profileInput',
                    name: 'profileId',
                    class: 'profile-select',
                    col: '12 col-md-6'
                },
                {
                    id: 'productInput',
                    name: 'productId',
                    class: 'product-select',
                    col: 'md-2 col-lg-1'
                }
            ]
        });

        expect(html).toContain('class="col-12 col-md-6"');
        expect(html).toContain('class="col-md-2 col-lg-1"');
        expect(html).not.toContain('col-col');
    });

    it('renders table select rows as full-width nested grid rows', async () => {
        const html = await ejs.renderFile('src/views/shared/modal.ejs', {
            modalId: 'goodsReceiptModal',
            form: {
                id: 'goodsReceiptForm',
                inputs: [],
                table: {
                    select: {
                        id: 'productInput',
                        name: 'productId',
                        class: 'product-select',
                        col: 'col-md-4 col-lg-6'
                    },
                    inputs: [
                        {
                            id: 'quantityInput',
                            name: 'quantity',
                            type: 'number',
                            label: 'Cantidad',
                            col: 'md-2 col-lg-1'
                        }
                    ]
                }
            }
        });

        expect(html).toContain('class="col-12 row g-2 mb-3 add-product-container"');
        expect(html).toContain('class="col-md-4 col-lg-6 mb-2"');
        expect(html).toContain('class="col-md-2 col-lg-1"');
    });
});

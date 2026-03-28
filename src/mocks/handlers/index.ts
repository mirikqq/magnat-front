import { http, HttpResponse } from 'msw';
import { fullfills, observables, orderItems, orders, suppliers, supplyDemand, warehouses } from '../data';

const api = '/api';

export const handlers = [
  http.get(`${api}/auth/me`, () => HttpResponse.json({ id: 1, phone: '+79990000000', fio: 'Admin User', role: 'admin', cabinet_id: 1 })),
  http.post(`${api}/auth/login`, () => HttpResponse.json({ token: 'mock-token' })),

  http.get(`${api}/supply/demand`, () => HttpResponse.json(supplyDemand)),
  http.post(`${api}/supply/recalculate`, () => HttpResponse.json({ runId: 'mock-run-1' })),
  http.get(`${api}/supply/recalculate/status/:runId`, () => HttpResponse.json({ runId: 'mock-run-1', status: 'success' })),

  http.get(`${api}/stock/product/:id`, ({ params }) => {
    const found = supplyDemand.find((x) => String(x.product_sku) === String(params.id));
    return HttpResponse.json(found?.warehouses ?? []);
  }),
  http.post(`${api}/stock/visible`, async ({ request }) => {
    const payload = await request.json() as { product_sku: number; warehouse_name: string; visible: boolean };
    const row = supplyDemand.find((x) => x.product_sku === payload.product_sku);
    const wh = row?.warehouses.find((x) => x.warehouse_name === payload.warehouse_name);
    if (wh) wh.visible = payload.visible;
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${api}/orders`, () => HttpResponse.json(orders)),
  http.post(`${api}/orders`, async ({ request }) => {
    const payload = await request.json() as { observable_ids: number[] };
    const id = Math.max(0, ...orders.map((x) => x.id)) + 1;
    const now = new Date().toISOString();
    orders.push({ id, is_approved: false, created_at: now, updated_at: now });

    payload.observable_ids.forEach((observable_id, index) => {
      const src = observables.find((x) => x.id === observable_id);
      if (!src) return;
      orderItems.push({
        id: Math.max(0, ...orderItems.map((x) => x.id)) + index + 1,
        order_id: id,
        observable_id,
        supplier_id: src.supplier_id,
        name: src.name,
        min_count: src.min_count,
        needed: 10,
        additional: 0,
        price: src.price,
      });
    });

    return HttpResponse.json({ ...orders[orders.length - 1], items: orderItems.filter((x) => x.order_id === id) });
  }),
  http.get(`${api}/orders/:id`, ({ params }) => {
    const id = Number(params.id);
    const order = orders.find((x) => x.id === id);
    if (!order) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json({ ...order, items: orderItems.filter((x) => x.order_id === id) });
  }),
  http.patch(`${api}/orders/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const payload = await request.json() as { items: Array<{ id: number; additional: number }> };
    payload.items.forEach((it) => {
      const src = orderItems.find((x) => x.id === it.id && x.order_id === id);
      if (src) src.additional = it.additional;
    });
    const order = orders.find((x) => x.id === id);
    if (order) order.updated_at = new Date().toISOString();
    return HttpResponse.json({ ...(order ?? {}), items: orderItems.filter((x) => x.order_id === id) });
  }),
  http.delete(`${api}/orders/:id`, ({ params }) => {
    const id = Number(params.id);
    const i = orders.findIndex((x) => x.id === id);
    if (i >= 0) orders.splice(i, 1);
    return HttpResponse.json({ ok: true });
  }),
  http.post(`${api}/orders/:id/approve`, ({ params }) => {
    const id = Number(params.id);
    const order = orders.find((x) => x.id === id);
    if (order) order.is_approved = true;
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${api}/observables/inway`, () => HttpResponse.json(observables)),
  http.patch(`${api}/observables/inway`, async ({ request }) => {
    const payload = await request.json() as { values: Array<{ id: number; in_way: number }> };
    payload.values.forEach((v) => {
      const src = observables.find((x) => x.id === v.id);
      if (src) src.in_way = v.in_way;
    });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${api}/observables/stock`, () => HttpResponse.json(observables)),
  http.patch(`${api}/observables/stock`, async ({ request }) => {
    const payload = await request.json() as { values: Array<{ id: number; add: number }> };
    payload.values.forEach((v) => {
      const src = observables.find((x) => x.id === v.id);
      if (src) src.in_our_stock += v.add;
    });
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${api}/fullfill`, () => HttpResponse.json(fullfills)),
  http.post(`${api}/fullfill`, () => {
    const now = new Date().toISOString();
    const id = Math.max(0, ...fullfills.map((x) => x.id)) + 1;
    fullfills.push({ id, mp: 'ozon', is_approved: false, liters: 0, boxes: 0, pallets: 0, created_at: now, updated_at: now });
    return HttpResponse.json({ ...fullfills[fullfills.length - 1], items: [] });
  }),
  http.get(`${api}/fullfill/:id`, ({ params }) => {
    const id = Number(params.id);
    const row = fullfills.find((x) => x.id === id);
    return HttpResponse.json({ ...(row ?? fullfills[0]), items: [] });
  }),
  http.patch(`${api}/fullfill/:id`, () => HttpResponse.json({ ok: true })),
  http.delete(`${api}/fullfill/:id`, () => HttpResponse.json({ ok: true })),
  http.post(`${api}/fullfill/:id/approve`, ({ params }) => {
    const row = fullfills.find((x) => x.id === Number(params.id));
    if (row) row.is_approved = true;
    return HttpResponse.json({ ok: true });
  }),
  http.get(`${api}/fullfill/:id/delivery`, () => HttpResponse.json([{ warehouse_name: 'Москва', in_delivery: true }, { warehouse_name: 'СПБ', in_delivery: false }])),
  http.post(`${api}/fullfill/:id/delivery`, () => HttpResponse.json({ ok: true })),
  http.get(`${api}/fullfill/new/:mp`, () => HttpResponse.json(observables)),

  http.get(`${api}/suppliers`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const filtered = suppliers.filter((x) => x.name.toLowerCase().includes(search));
    return HttpResponse.json(filtered);
  }),
  http.get(`${api}/suppliers/:id`, ({ params }) => {
    const row = suppliers.find((x) => x.id === Number(params.id));
    return HttpResponse.json(row ?? { id: 0, name: '' }, { status: row ? 200 : 404 });
  }),
  http.post(`${api}/suppliers`, async ({ request }) => {
    const payload = await request.json() as { name: string };
    const id = Math.max(0, ...suppliers.map((x) => x.id)) + 1;
    const created = { id, name: payload.name, cabinet_id: 1 };
    suppliers.push(created);
    return HttpResponse.json(created);
  }),
  http.patch(`${api}/suppliers/:id`, async ({ params, request }) => {
    const payload = await request.json() as { name: string };
    const row = suppliers.find((x) => x.id === Number(params.id));
    if (row) row.name = payload.name;
    return HttpResponse.json(row ?? { id: 0, name: '' }, { status: row ? 200 : 404 });
  }),
  http.delete(`${api}/suppliers/:id`, ({ params }) => {
    const i = suppliers.findIndex((x) => x.id === Number(params.id));
    if (i >= 0) suppliers.splice(i, 1);
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${api}/warehouses/:mp`, () => HttpResponse.json(warehouses)),
  http.patch(`${api}/warehouses/:mp`, async ({ request }) => {
    const payload = await request.json() as { warehouses: typeof warehouses };
    warehouses.splice(0, warehouses.length, ...payload.warehouses);
    return HttpResponse.json({ ok: true });
  }),

  http.get(`${api}/observables`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    return HttpResponse.json(observables.filter((x) => x.name.toLowerCase().includes(search)));
  }),
  http.get(`${api}/observables/:id`, ({ params }) => {
    const row = observables.find((x) => x.id === Number(params.id));
    return HttpResponse.json(row ?? { id: 0, supplier_id: 0, name: '', price: 0, min_count: 1, in_our_stock: 0, in_way: 0, cabinet_id: 1 }, { status: row ? 200 : 404 });
  }),
  http.post(`${api}/observables`, async ({ request }) => {
    const payload = await request.json() as { supplier_id: number; name: string; price: number; min_count: number };
    const id = Math.max(0, ...observables.map((x) => x.id)) + 1;
    const created = { ...payload, id, in_our_stock: 0, in_way: 0, cabinet_id: 1 };
    observables.push(created);
    return HttpResponse.json(created);
  }),
  http.patch(`${api}/observables/:id`, async ({ params, request }) => {
    const payload = await request.json() as { supplier_id: number; name: string; price: number; min_count: number };
    const row = observables.find((x) => x.id === Number(params.id));
    if (row) Object.assign(row, payload);
    return HttpResponse.json(row ?? { id: 0 }, { status: row ? 200 : 404 });
  }),
  http.delete(`${api}/observables/:id`, ({ params }) => {
    const i = observables.findIndex((x) => x.id === Number(params.id));
    if (i >= 0) observables.splice(i, 1);
    return HttpResponse.json({ ok: true });
  }),
  http.get(`${api}/observables/witems`, () => HttpResponse.json([])),

  http.get(`${api}/observable-items/:id/barcode`, () => HttpResponse.json({ url: '#' })),
  http.post(`${api}/observable-items/:id/barcode`, () => HttpResponse.json({ ok: true })),
  http.get(`${api}/catalog/unassigned`, () => HttpResponse.json([])),
  http.post(`${api}/catalog/:id/archive`, () => HttpResponse.json({ ok: true })),
  http.post(`${api}/catalog/:id/restore`, () => HttpResponse.json({ ok: true })),
];

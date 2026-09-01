migrate(
  (app) => {
    // 1. Create itens collection
    const itens = new Collection({
      name: 'itens',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'descricao', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['pendente', 'em_producao', 'finalizado'],
          maxSelect: 1,
          required: true,
        },
        { name: 'drawing_url', type: 'text' },
        {
          name: 'drawing_file',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760, // 10MB
          mimeTypes: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(itens)
    const itensId = itens.id

    // 2. Create routing_steps collection
    const routingSteps = new Collection({
      name: 'routing_steps',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'item_id',
          type: 'relation',
          required: true,
          collectionId: itensId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'step_order', type: 'number', required: true, min: 1 },
        { name: 'sector', type: 'text', required: true },
        {
          name: 'machine_type',
          type: 'select',
          values: ['torno', 'fresa', 'cnc', 'retifica', 'corte', 'solda', 'inspecao', 'outros'],
          maxSelect: 1,
        },
        { name: 'description', type: 'text', required: true },
        { name: 'estimated_hours', type: 'number', min: 0 },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(routingSteps)

    // 3. Create material_purchases collection
    const materialPurchases = new Collection({
      name: 'material_purchases',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'item_id',
          type: 'relation',
          required: true,
          collectionId: itensId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'material_name', type: 'text', required: true },
        { name: 'quantity', type: 'number', min: 0 },
        { name: 'unit', type: 'text' },
        { name: 'supplier', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(materialPurchases)

    // 4. Create outsourced_services collection
    const outsourcedServices = new Collection({
      name: 'outsourced_services',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'item_id',
          type: 'relation',
          required: true,
          collectionId: itensId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'service_description', type: 'text', required: true },
        { name: 'supplier', type: 'text' },
        { name: 'estimated_cost', type: 'number', min: 0 },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(outsourcedServices)
  },
  (app) => {
    try {
      const os = app.findCollectionByNameOrId('outsourced_services')
      app.delete(os)
    } catch (_) {}
    try {
      const mp = app.findCollectionByNameOrId('material_purchases')
      app.delete(mp)
    } catch (_) {}
    try {
      const rs = app.findCollectionByNameOrId('routing_steps')
      app.delete(rs)
    } catch (_) {}
    try {
      const it = app.findCollectionByNameOrId('itens')
      app.delete(it)
    } catch (_) {}
  },
)

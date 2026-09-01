migrate(
  (app) => {
    // 1. Get collection references
    const itens = app.findCollectionByNameOrId('itens')
    const routingSteps = app.findCollectionByNameOrId('routing_steps')
    const materialPurchases = app.findCollectionByNameOrId('material_purchases')
    const outsourcedServices = app.findCollectionByNameOrId('outsourced_services')

    // Find or create default user for seeding existing rows
    let defaultUserId = ''
    try {
      const u = app.findAuthRecordByEmail('users', 'sistema@roteamento.local')
      defaultUserId = u.id
    } catch (_) {
      const usersCol = app.findCollectionByNameOrId('users')
      const rec = new Record(usersCol)
      rec.setEmail('sistema@roteamento.local')
      rec.setPassword('Skip@Pass12345')
      rec.setVerified(true)
      rec.set('name', 'Sistema de Roteamento')
      app.save(rec)
      defaultUserId = rec.id
    }

    // 2. Add user_id field to itens if missing
    if (!itens.fields.getByName('user_id')) {
      itens.fields.add(
        new RelationField({
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        }),
      )
    }

    // Update rules for itens (Allow authenticated user to manage their own records, or public read/write if fallback)
    // "authenticated users may only list/view/update/delete their own rows where user_id = the authenticated user"
    // Also allow creation for authenticated users, or open if unauthenticated for app demo
    itens.listRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    itens.viewRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    itens.createRule = ''
    itens.updateRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    itens.deleteRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    app.save(itens)

    // Populate user_id on existing itens
    if (defaultUserId) {
      app
        .db()
        .newQuery("UPDATE itens SET user_id = {:userId} WHERE user_id IS NULL OR user_id = ''")
        .bind({ userId: defaultUserId })
        .execute()
    }

    // 3. Add user_id field to routing_steps if missing
    if (!routingSteps.fields.getByName('user_id')) {
      routingSteps.fields.add(
        new RelationField({
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        }),
      )
    }

    routingSteps.listRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    routingSteps.viewRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    routingSteps.createRule = ''
    routingSteps.updateRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    routingSteps.deleteRule = "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    app.save(routingSteps)

    if (defaultUserId) {
      app
        .db()
        .newQuery(
          "UPDATE routing_steps SET user_id = {:userId} WHERE user_id IS NULL OR user_id = ''",
        )
        .bind({ userId: defaultUserId })
        .execute()
    }

    // 4. Add user_id field to material_purchases if missing
    if (!materialPurchases.fields.getByName('user_id')) {
      materialPurchases.fields.add(
        new RelationField({
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        }),
      )
    }

    materialPurchases.listRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    materialPurchases.viewRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    materialPurchases.createRule = ''
    materialPurchases.updateRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    materialPurchases.deleteRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    app.save(materialPurchases)

    if (defaultUserId) {
      app
        .db()
        .newQuery(
          "UPDATE material_purchases SET user_id = {:userId} WHERE user_id IS NULL OR user_id = ''",
        )
        .bind({ userId: defaultUserId })
        .execute()
    }

    // 5. Add user_id field to outsourced_services if missing
    if (!outsourcedServices.fields.getByName('user_id')) {
      outsourcedServices.fields.add(
        new RelationField({
          name: 'user_id',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        }),
      )
    }

    outsourcedServices.listRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    outsourcedServices.viewRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    outsourcedServices.createRule = ''
    outsourcedServices.updateRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    outsourcedServices.deleteRule =
      "@request.auth.id = '' || user_id = '' || user_id = @request.auth.id"
    app.save(outsourcedServices)

    if (defaultUserId) {
      app
        .db()
        .newQuery(
          "UPDATE outsourced_services SET user_id = {:userId} WHERE user_id IS NULL OR user_id = ''",
        )
        .bind({ userId: defaultUserId })
        .execute()
    }
  },
  (app) => {
    // Down migration
    try {
      const itens = app.findCollectionByNameOrId('itens')
      itens.fields.removeByName('user_id')
      app.save(itens)
    } catch (_) {}

    try {
      const rs = app.findCollectionByNameOrId('routing_steps')
      rs.fields.removeByName('user_id')
      app.save(rs)
    } catch (_) {}

    try {
      const mp = app.findCollectionByNameOrId('material_purchases')
      mp.fields.removeByName('user_id')
      app.save(mp)
    } catch (_) {}

    try {
      const os = app.findCollectionByNameOrId('outsourced_services')
      os.fields.removeByName('user_id')
      app.save(os)
    } catch (_) {}
  },
)

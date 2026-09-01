migrate(
  (app) => {
    const machinesCol = app.findCollectionByNameOrId('machines')
    const users = app.findRecordsByFilter('users', '', '', 100, 0)

    const defaultMachines = [
      { name: 'Torno', slug: 'torno', icon: 'Cog', color: 'blue', active: true },
      { name: 'Fresa', slug: 'fresa', icon: 'Layers', color: 'amber', active: true },
      { name: 'CNC', slug: 'cnc', icon: 'Cpu', color: 'violet', active: true },
      { name: 'Retífica', slug: 'retifica', icon: 'Gauge', color: 'green', active: true },
    ]

    for (const user of users) {
      for (const m of defaultMachines) {
        try {
          // Check if already exists for this user
          const existing = app.findRecordsByFilter(
            'machines',
            `user_id = "${user.id}" && slug = "${m.slug}"`,
            '',
            1,
            0,
          )
          if (existing && existing.length > 0) {
            continue
          }

          const rec = new Record(machinesCol)
          rec.set('user_id', user.id)
          rec.set('name', m.name)
          rec.set('slug', m.slug)
          rec.set('icon', m.icon)
          rec.set('color', m.color)
          rec.set('active', m.active)
          app.save(rec)
        } catch (err) {
          console.log('Error seeding machine for user ' + user.id + ':', err)
        }
      }
    }
  },
  (app) => {
    // down migration
  },
)

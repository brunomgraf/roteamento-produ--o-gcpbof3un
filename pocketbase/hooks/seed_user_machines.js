onRecordAfterCreateSuccess((e) => {
  try {
    const userId = e.record.id
    if (!userId) {
      e.next()
      return
    }

    const machinesCol = $app.findCollectionByNameOrId('machines')

    const defaultMachines = [
      { name: 'Torno', slug: 'torno', icon: 'Cog', color: 'blue', active: true },
      { name: 'Fresa', slug: 'fresa', icon: 'Cog', color: 'amber', active: true },
      { name: 'CNC', slug: 'cnc', icon: 'Cog', color: 'violet', active: true },
      { name: 'Retifica', slug: 'retifica', icon: 'Cog', color: 'green', active: true },
    ]

    for (let i = 0; i < defaultMachines.length; i++) {
      const item = defaultMachines[i]
      try {
        const rec = new Record(machinesCol)
        rec.set('user_id', userId)
        rec.set('name', item.name)
        rec.set('slug', item.slug)
        rec.set('icon', item.icon)
        rec.set('color', item.color)
        rec.set('active', item.active)
        $app.save(rec)
      } catch (insertErr) {
        console.log(
          'Error seeding machine ' + item.slug + ' for user ' + userId + ':',
          insertErr.message || insertErr,
        )
      }
    }
  } catch (err) {
    console.log('Error in seed_user_machines hook:', err.message || err)
  }

  e.next()
}, 'users')

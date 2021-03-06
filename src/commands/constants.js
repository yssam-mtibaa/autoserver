export const COMMANDS = [
  {
    name: 'findOne',
    type: 'find',
    multiple: false,
    title: 'search for',
    participle: 'searched',
  },
  {
    name: 'findMany',
    type: 'find',
    multiple: true,
    title: 'search for',
    participle: 'searched',
  },
  {
    name: 'createOne',
    type: 'create',
    multiple: false,
    title: 'create',
    participle: 'created',
  },
  {
    name: 'createMany',
    type: 'create',
    multiple: true,
    title: 'create',
    participle: 'created',
  },
  {
    name: 'upsertOne',
    type: 'upsert',
    multiple: false,
    title: 'upsert',
    participle: 'upserted',
  },
  {
    name: 'upsertMany',
    type: 'upsert',
    multiple: true,
    title: 'upsert',
    participle: 'upserted',
  },
  {
    name: 'patchOne',
    type: 'patch',
    multiple: false,
    title: 'patch',
    participle: 'patched',
  },
  {
    name: 'patchMany',
    type: 'patch',
    multiple: true,
    title: 'patch',
    participle: 'patched',
  },
  {
    name: 'deleteOne',
    type: 'delete',
    multiple: false,
    title: 'delete',
    participle: 'deleted',
  },
  {
    name: 'deleteMany',
    type: 'delete',
    multiple: true,
    title: 'delete',
    participle: 'deleted',
  },
]

export const COMMAND_TYPES = ['find', 'create', 'upsert', 'patch', 'delete']

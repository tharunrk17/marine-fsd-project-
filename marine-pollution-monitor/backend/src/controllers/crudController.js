export function crudController(Model, ownerField, populate = '') {
  return {
    list: async (req, res) => {
      const query = {};
      if (req.query.search) query.$or = Object.keys(Model.schema.paths).filter(k => Model.schema.paths[k].instance === 'String').map(k => ({ [k]: { $regex: req.query.search, $options: 'i' } }));
      const docs = await Model.find(query).sort({ createdAt: -1 }).populate(populate);
      res.json(docs);
    },
    get: async (req, res) => {
      const doc = await Model.findById(req.params.id).populate(populate);
      if (!doc) return res.status(404).json({ message: 'Record not found' });
      res.json(doc);
    },
    create: async (req, res) => {
      const doc = await Model.create({ ...req.body, [ownerField]: req.user._id });
      res.status(201).json(doc);
    },
    update: async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: 'Record not found' });
      res.json(doc);
    },
    remove: async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Record not found' });
      res.json({ message: 'Deleted successfully' });
    }
  };
}

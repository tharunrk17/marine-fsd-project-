import { Router } from 'express';
import { crudController } from '../controllers/crudController.js';
import { protect, adminOnly } from '../middleware/auth.js';

export function makeCrudRoutes(Model, ownerField) {
  const router = Router();
  const c = crudController(Model, ownerField);
  router.get('/', protect, c.list);
  router.get('/:id', protect, c.get);
  router.post('/', protect, c.create);
  router.put('/:id', protect, c.update);
  router.delete('/:id', protect, adminOnly, c.remove);
  return router;
}

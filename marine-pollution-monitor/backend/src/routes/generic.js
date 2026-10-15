import { Router } from 'express';
import { crudController } from '../controllers/crudController.js';
import { protect, adminOnly, allowRoles } from '../middleware/auth.js';

export function makeCrudRoutes(Model, ownerField, populate = '', createRoles = null) {
  const router = Router();
  const c = crudController(Model, ownerField, populate);
  
  router.get('/', protect, c.list);
  router.get('/:id', protect, c.get);
  
  if (createRoles) {
    router.post('/', protect, allowRoles(...createRoles), c.create);
  } else {
    router.post('/', protect, c.create);
  }
  
  router.put('/:id', protect, c.update);
  router.delete('/:id', protect, adminOnly, c.remove);
  return router;
}

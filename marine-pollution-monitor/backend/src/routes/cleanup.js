import { Router } from 'express';
import CleanupActivity from '../models/CleanupActivity.js';
import PollutionReport from '../models/PollutionReport.js';
import { protect, allowRoles, adminOnly } from '../middleware/auth.js';

const router = Router();

// List all cleanups
router.get('/', protect, async (req, res) => {
  try {
    const cleanups = await CleanupActivity.find()
      .sort({ date: -1 })
      .populate('reportId', 'title location source severity status')
      .populate('createdBy', 'name email role')
      .populate('registeredVolunteers.user', 'name email');
    res.json(cleanups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cleanups', error: err.message });
  }
});

// Create cleanup drive (NGO and Admin)
router.post('/', protect, allowRoles('ngo', 'admin'), async (req, res) => {
  try {
    const drive = await CleanupActivity.create({
      ...req.body,
      createdBy: req.user._id
    });

    // If linked to a report, optionally mark report status as 'Cleanup Planned'
    if (drive.reportId) {
      await PollutionReport.findByIdAndUpdate(drive.reportId, {
        status: 'Cleanup Planned'
      });
    }

    const populated = await CleanupActivity.findById(drive._id)
      .populate('reportId', 'title location')
      .populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: 'Error creating cleanup drive', error: err.message });
  }
});

// Citizen / volunteer registers for a cleanup drive
router.post('/:id/register', protect, async (req, res) => {
  try {
    const drive = await CleanupActivity.findById(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Cleanup drive not found' });

    // Check if already registered
    const alreadyRegistered = drive.registeredVolunteers?.some(
      v => v.user?.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this cleanup drive!' });
    }

    drive.registeredVolunteers.push({ user: req.user._id });
    drive.volunteers = (drive.volunteers || 0) + 1;
    await drive.save();

    res.json({
      message: 'Successfully registered for cleanup drive!',
      volunteers: drive.volunteers,
      drive
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering for cleanup' });
  }
});

// Update waste collected / metrics (NGO or Admin)
router.patch('/:id/waste', protect, allowRoles('ngo', 'admin', 'officer'), async (req, res) => {
  try {
    const { wasteCollectedKg, plasticCollectedKg, oilRecoveredLitres, status } = req.body;
    const drive = await CleanupActivity.findByIdAndUpdate(
      req.params.id,
      {
        wasteCollectedKg: Number(wasteCollectedKg) || 0,
        plasticCollectedKg: Number(plasticCollectedKg) || 0,
        oilRecoveredLitres: Number(oilRecoveredLitres) || 0,
        status: status || 'Completed'
      },
      { new: true }
    );

    if (!drive) return res.status(404).json({ message: 'Cleanup drive not found' });

    // If marked Completed and has linked report, optionally mark report as Resolved
    if (status === 'Completed' && drive.reportId) {
      await PollutionReport.findByIdAndUpdate(drive.reportId, { status: 'Resolved' });
    }

    res.json(drive);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cleanup metrics' });
  }
});

// Full update
router.put('/:id', protect, allowRoles('ngo', 'admin'), async (req, res) => {
  try {
    const drive = await CleanupActivity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!drive) return res.status(404).json({ message: 'Cleanup drive not found' });
    res.json(drive);
  } catch (err) {
    res.status(400).json({ message: 'Error updating drive' });
  }
});

// Delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const drive = await CleanupActivity.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    res.json({ message: 'Drive deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting drive' });
  }
});

export default router;

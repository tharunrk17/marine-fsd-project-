import { Router } from 'express';
import PollutionReport from '../models/PollutionReport.js';
import { protect, allowRoles, adminOnly } from '../middleware/auth.js';

const router = Router();

// List all reports with search and filters
router.get('/', protect, async (req, res) => {
  try {
    const { search, source, severity, status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (source && source !== 'All') query.source = source;
    if (severity && severity !== 'All') query.severity = severity;
    if (status && status !== 'All') query.status = status;

    const reports = await PollutionReport.find(query)
      .sort({ reportedAt: -1 })
      .populate('reportedBy', 'name email role');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
});

// Get single report
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await PollutionReport.findById(req.params.id).populate('reportedBy', 'name email role');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching report' });
  }
});

// Create report (any authenticated user can report: citizen, ngo, officer, admin)
router.post('/', protect, async (req, res) => {
  try {
    const report = await PollutionReport.create({
      ...req.body,
      reportedBy: req.user._id
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: 'Error creating report', error: err.message });
  }
});

// Update report status (officers, admin, or ngo)
router.patch('/:id/status', protect, allowRoles('officer', 'admin', 'ngo'), async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Reported', 'Investigating', 'Cleanup Planned', 'Resolved'];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const report = await PollutionReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

// Update full report (author or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const report = await PollutionReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: 'Error updating report', error: err.message });
  }
});

// Delete report (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const report = await PollutionReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report' });
  }
});

export default router;

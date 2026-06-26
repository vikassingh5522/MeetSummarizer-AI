import * as ragService from '../services/ragService.js';

export function getMeetings(req, res, next) {
  try {
    const meetings = ragService.getAllMeetings();
    res.json(meetings);
  } catch (error) {
    next(error);
  }
}

export function updateMeeting(req, res, next) {
  try {
    const { id } = req.params;
    const { summary } = req.body;
    if (!summary) {
      return res.status(400).json({ message: 'Summary is required' });
    }
    const updated = ragService.updateMeetingSummary(id, summary);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export function deleteMeetingRoute(req, res, next) {
  try {
    const { id } = req.params;
    ragService.deleteMeeting(id);
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    next(error);
  }
}

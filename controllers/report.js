const Report = require('../models/report');
const mongoose = require('mongoose');

const GetReports = async(req, res) => {
    try {
        const reports = await Report.find()
            .populate('postId', 'author caption images')
            .populate('postId.author', 'author.name author.email author.avatar')
            .populate('userId', 'name email avatar')
            .populate('reporterId', 'name email avatar')
            .populate('resolverId', 'name email avatar');
        res.send(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const AddReport = async(req, res) => {
    try {
        const report = new Report(req.body);
        report.reporterId = req.payload.user._id;
        await report.save();

        res.status(201).json({ report });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const DeleteReport = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const report = await Report.findByIdAndDelete(id);
        if (!report)
            return res.status(404).json({ error: 'Report not found' });

        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ResolveReport = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const updatedReport = await Report.findByIdAndUpdate(id, { status: 'Resolved', resolverId: req.payload.user._id, resolvedAt: Date.now() }, { new: true });
        if (!updatedReport)
            return res.status(404).json({ error: 'Report not found' });

        res.json({ message: 'Report resolved successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    GetReports,
    AddReport,
    DeleteReport,
    ResolveReport
};
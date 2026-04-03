const Record = require("../models/Record");

const createRecord = async (req, res) => {
  try {
    const record = await Record.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecords = async (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  let filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  try {
    const records = await Record.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const records = await Record.find();

    const totalIncome = records.filter(r => r.type === "income")
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === "expense")
      .reduce((sum, r) => sum + r.amount, 0);

    const categoryTotals = {};
    records.forEach(r => {
      if (!categoryTotals[r.category]) categoryTotals[r.category] = 0;
      categoryTotals[r.category] += r.amount;
    });

    const netBalance = totalIncome - totalExpense;
    const recentActivity = records.sort((a, b) => b.date - a.date).slice(0, 5);

    res.json({ totalIncome, totalExpense, netBalance, categoryTotals, recentActivity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord, getSummary };
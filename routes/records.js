const express = require("express");
const router = express.Router();
const { createRecord, getRecords, updateRecord, deleteRecord, getSummary } = require("../controllers/recordController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roles");

// All routes require authentication
router.use(protect);

router.get("/", authorize("admin","analyst","viewer"), getRecords);
router.get("/summary", authorize("admin","analyst","viewer"), getSummary);
router.post("/", authorize("admin"), createRecord);
router.put("/:id", authorize("admin"), updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
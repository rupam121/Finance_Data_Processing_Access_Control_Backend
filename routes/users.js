const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roles");

router.use(protect);
router.use(authorize("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
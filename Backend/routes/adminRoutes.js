/*const express = require("express");
const router = express.Router();
const {
  promoteToAdmin,
  demoteToUser,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Only masterAdmin can promote/demote
router.put(
  "/promote/:id",
  protect,
  authorizeRoles("masterAdmin"),
  promoteToAdmin
);

router.put(
  "/demote/:id",
  protect,
  authorizeRoles("masterAdmin"),
  demoteToUser
);

module.exports = router;*/

const express = require("express");
const router = express.Router();

const {
  promoteUser,
  demoteUser,
  deleteUser,
  getAdminDashboard,
} = require("../controllers/adminController");

const {
  getAllUsers,
  getMasterDashboard
} = require("../controllers/adminController");


const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Promote
router.patch(
  "/promote/:id",
  protect,
  authorizeRoles("masterAdmin"),
  promoteUser
);

// Demote
router.patch(
  "/demote/:id",
  protect,
  authorizeRoles("masterAdmin"),
  demoteUser
);

// Dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin", "masterAdmin"),
  getAdminDashboard
);

router.get(
  "/users",
  protect,
  authorizeRoles("masterAdmin"),
  getAllUsers
);

router.delete(
  "/users/:id",
  protect,
  authorizeRoles("masterAdmin"),
  deleteUser
);


router.get(
  "/master/dashboard",
  protect,
  authorizeRoles("masterAdmin"),
  getMasterDashboard
);

module.exports = router;
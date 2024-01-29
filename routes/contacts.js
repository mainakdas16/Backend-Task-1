const express = require("express");
const { createContact, getContact, updateContact, deleteContact } = require("../controllers/contacts");
const router = express.Router();

router.post("/", createContact);
router.get("/:id", getContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
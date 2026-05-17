const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all notes using: GET "/api/notes/fetchallnotes".  login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.mrssage);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote".  login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are errors return bad requests and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await notes.save();

      res.json(saveNote);
    } catch (error) {
      console.error(error.mrssage);
      res.status(500).send("Internal server error");
    }
  },
);

// ROUTE 3: update an existing note using: PUT "/api/notes/updatenote".  login required
router.put("/updatenote/:id", fetchuser, [], async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // create new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated and update it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      res.status(404).send("Not found");
    }

    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    notes = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true },
    );
    res.json({ notes });
  } catch (error) {
    console.error(error.mrssage);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: delete an existing note using: DELETE "/api/notes/deleteenote".  login required
router.delete("/deletenote/:id", fetchuser, [], async (req, res) => {
  try {
    // find the note to be deleted and delete it
    let notes = await Notes.findById(req.params.id);
    if (!notes) {
      res.status(404).send("Not found");
    }

    // Allow deletion only if user owns this Note
    if (notes.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", notes: notes });
  } catch (error) {
    console.error(error.mrssage);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

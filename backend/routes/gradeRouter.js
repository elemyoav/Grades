const express = require("express");

const Grades = require("../controllers/gradesController");

const router = express.Router();

router.route('/').post(Grades.AddGrade).get(Grades.GetGrades);
router.route('/:id').get(Grades.GetGrade).delete(Grades.DeleteGrade).put(Grades.UpdateGrade);

module.exports =  router;
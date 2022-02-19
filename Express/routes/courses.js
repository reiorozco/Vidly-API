const express = require("express");
const router = express.Router();

function validateCourse(course) {
  //Validate
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
  { id: 4, name: "Course4" },
  { id: 5, name: "Course5" },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course) return res.status(404).send("This course wasn't found.");
  res.send(course);
});

router.post("/", (req, res) => {
  const { error, value } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  // If not existing, return 404
  if (!course) return res.status(404).send("This course wasn't found.");

  //Validate
  const { error, value } = validateCourse(req.body);

  // If invalid, return 400 - Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  //Update course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
});

router.delete("/:id", (req, res) => {
  //Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  // If not existing, return 404
  if (!course) return res.status(404).send("This course wasn't found.");

  //Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //Return the same course
  res.send(course);
});

module.exports = router;

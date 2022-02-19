const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Couldn't connect to MongoDB...'", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: {
      type: authorSchema,
      required: true,
    },
  })
);

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find({});

  console.log(courses);
}

async function updateAuthor(courseId) {
  // update is deprecated, instead use updateOne or updateMany
  // const course = await Course.updateOne(
  //   { _id: courseId },
  //   { "author.name": "Rei Orozco" }
  // );

  // $unset
  const course = await Course.updateOne(
    {
      _id: courseId,
    },
    {
      $unset: {
        author: "",
      },
    }
  );
}

// createCourse("Node Course", new Author({ name: "Mosh" }));

updateAuthor("620c82c0c40b9d673003cb51");

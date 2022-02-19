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
    authors: {
      type: [authorSchema],
      required: true,
    },
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
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

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);

  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = await course.authors.id(authorId);

  author.remove();
  course.save();
}

// createCourse("Node Course", [
//   new Author({ name: "Mosh" }),
//   new Author({ name: "Rei" }),
//   new Author({ name: "Pablo" }),
// ]);

// updateAuthor("620c82c0c40b9d673003cb51");

// addAuthor("621170703db003a5285a5cef", new Author({ name: "Loki" }));

removeAuthor("621170703db003a5285a5cef", "621170703db003a5285a5cee");

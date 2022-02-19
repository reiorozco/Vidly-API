const mongoose = require("mongoose");

// Open a connection
mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Couldn't connect to MongoDB...'", err));

// With Mongoose, everything is derived from a Schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    // match: /pattern/,
    unique: true,
  }, // Validation

  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    trim: true,
  },

  author: String,

  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return new Promise((resolve, reject) => {
          const result = v && v.length > 0;

          setTimeout(() => resolve(result), 3000);
        });
      },
      message: "A course should have at least one tag.",
    },
  },

  date: { type: Date, default: Date.now },

  isPublished: Boolean,

  price: {
    type: Number,
    min: 10,
    max: 200,
    required: function () {
      return this.isPublished;
    },
    get: (v) => Math.round(v), // To get a value when you
    set: (v) => Math.round(v), // To set a default value
  },
});

// The next step is compiling our schema into a Model(Collection)(Table in SQL)
const Course = mongoose.model("Course", courseSchema);

// Saving a Document(Row in SQL)
async function createCourse() {
  const course = new Course({
    name: "CSS Course",
    category: "web",
    author: "Rei",
    tags: ["css", "frontend"],
    isPublished: false,
    price: 120.5,
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (let errorKey in ex.errors) {
      console.log(ex.errors[errorKey].message);
    }
  }
}
createCourse();

// --- QUERYING Documents ---
function getCourses() {
  return (
    Course
      // .find({ author: "Mosh", isPublished: true })

      // .find()
      // .limit(10)
      // .sort({ name: 1 })
      // .select({ name: 1, tags: 1 });

      .find({})
      .sort({ name: "asc" })
      .select(["name", "author", "tags"])
  );
}
// getCourses().then((r) => console.log(r));

// --- COMPARISON Query Operators ---

// eq (equal)
// ne (not equal)
// gr (greater than)
// gte (greater than or equal) // .find({ price: { $gte: 10, $lte: 20 } })
// lt (less than)
// lte (less than or equal)
// in                          // .find({ price: { $in: [10, 15, 20] } })
// nin (not in)

//  --- LOGICAL Query Operators ---
// or                          // .or([{ author: "Mosh" }, { isPublished: true }])
// and                         // .and({ author: /^Mosh/ }) // RegEx

// CRUD Operations https://docs.mongodb.com/manual/crud/

// --- COUNTING ---
const count = async () => {
  return Course.count({ tags: { $in: "frontend" } });
};
// count().then((r) => console.log("Quantity of Frontend courses", r));

// --- PAGINATION Example ---
const getCoursesPagination = async () => {
  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: "asc" })
    .select(["name", "author", "tags"]);

  console.log(courses);
};
// getCoursesPagination();

// --- UPDATING a Document ---

// First-Way: Query first
// findById()
// Modify its properties
// save()

// Second-Way: Update first
// Update directly
// Optionally: get the updated document

async function updateCourse(id) {
  //   const course = await Course.findById(id);
  //   if (!course) return;

  //   course.isPublished = true;
  //   course.author = "Another Author";

  //   const result = await course.save();
  //   console.log(result);

  const course = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: "Rei",
        isPublished: false,
      },
    },
    { new: true } // true to return the modified document rather than the original. defaults to false
  );

  console.log(course);
}
// updateCourse("62001bcb7c56b73d57615189");

// --- REMOVING Documents ---
async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndDelete({ _id: id });

  console.log(course);
}
// removeCourse("62001bcb7c56b73d57615189");

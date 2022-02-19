console.log("Before");

// getUser(1, (user) => {
//   console.log("User", user);

//   getRepositories(user.gitHub, (repository) => {
//     console.log("Repository", repository);

//     getCommits(repository, (commits) => {
//       console.log("Commit", commits);
//     });
//   });
// });

// // Promise-based approach
// getUser(1)
//   .then((user) => getRepositories(user.gitHub))
//   .then((repository) => getCommits(repository[0]))
//   .then((commits) => console.log("Commits", commits))
//   .catch((err) => console.error("Error:", err.message));

// Async and Await approach

async function displayCommits() {
  try {
    const user = await getUser(1);
    const repository = await getRepositories(user.gitHub);
    const commits = await getCommits(repository[0]);
    console.log("Commits", commits);
  } catch (error) {
    console.error("Error:", error);
  }
}
displayCommits();

console.log("After");

function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Reading a user from a database...");

      resolve({
        id,
        gitHub: "reiorozco",
      });
    }, 2000);
  });
}

function getRepositories(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Getting repositories...");

      resolve(["repo1", "repo2", "repo3", "repo4", "repo5"]);
    }, 2000);
  });
}

function getCommits(repository) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Getting commits...");

      resolve(repository);
    }, 1000);
  });
}

// function getUser(id, callback) {
//   setTimeout(() => {
//     console.log("Reading a user from a database...");

//     callback({
//       id,
//       gitHub: "reiorozco",
//     });
//   }, 2000);
// }

// function getRepositories(username, callback) {
//   setTimeout(() => {
//     console.log("Getting repositories...");

//     callback(["repo1", "repo2", "repo3", "repo4", "repo5"]);
//   }, 2000);
// }

// function getCommits(repository, callback) {
//   setTimeout(() => {
//     console.log("Getting commits...");

//     callback(repository[0]);
//   }, 1000);
// }

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// Empty array for pushing new team members to
const teamMember = [];

// Array of questions to prompt the user
const managerQuestions = [
  {
    type: "input",
    name: "managerName",
    message: "Please enter your full name:",
  },
  {
    type: "input",
    name: "managerId",
    message: "Please enter your employee ID:",
  },
  {
    type: "input",
    name: "managerEmail",
    message: "Please enter your email address:",
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Please enter your office number:",
  },
];

const engineerQuestions = [
  {
    type: "input",
    name: "engineerName",
    message: "Please enter the engineer's full name:",
  },
  {
    type: "input",
    name: "engineerId",
    message: "Please enter the engineer's ID:",
  },
  {
    type: "input",
    name: "engineerEmail",
    message: "Please enter the engineer's email address:",
  },
  {
    type: "input",
    name: "githubUsername",
    message: "Please enter the engineer's Github username:",
  },
];

const internQuestions = [
  {
    type: "input",
    name: "internName",
    message: "Please enter the interns full name:",
  },
  {
    type: "input",
    name: "internId",
    message: "Please enter the interns employee ID:",
  },
  {
    type: "input",
    name: "internEmail",
    message: "Please enter the interns email address:",
  },
  {
    type: "input",
    name: "school",
    message: "Please enter the interns school:",
  },
];

const addEmployee = [
  {
    type: "list",
    name: "addEmployee",
    message: "Would you like to add a new employee?",
    choices: [
      "Add a new Engineer.",
      "Add a new Intern.",
      "I'm done, finish building team.",
    ],
  },
];

// Function for prompting user
const prompUser = (questions) => {
  return inquirer.prompt(questions);
};

// Create new manager
const createManager = async () => {
  const managerAnswers = await prompUser(managerQuestions);

  const manager = new Manager(
    managerAnswers.managerName,
    managerAnswers.managerId,
    managerAnswers.managerEmail,
    managerAnswers.officeNumber
  );
  teamMember.push(manager);
};

// Add employee option after manager creation
const addNewEmployee = async () => {
  const addEmployeeAnswer = await prompUser(addEmployee);

  if (addEmployeeAnswer.addEmployee === "Add a new Engineer.") {
    const engineer = await createEngineer();
    teamMember.push(engineer);
    addNewEmployee();
  } else if (addEmployeeAnswer.addEmployee === "Add a new Intern.") {
    const intern = await createIntern();
    teamMember.push(intern);
    addNewEmployee();
  } else {
    await writeToFile();
  }
};

// Create new engineer
const createEngineer = async () => {
  const engineerAnswers = await prompUser(engineerQuestions);

  return new Engineer(
    engineerAnswers.engineerName,
    engineerAnswers.engineerId,
    engineerAnswers.engineerEmail,
    engineerAnswers.githubUsername
  );
};

// Create new intern
const createIntern = async () => {
  const internAnswers = await prompUser(internQuestions);

  return new Intern(
    internAnswers.internName,
    internAnswers.internId,
    internAnswers.internEmail,
    internAnswers.school
  );
};

// function to write HTML file
const writeToFile = async () => {
  // Create the new folder
  fs.mkdir(OUTPUT_DIR, (err) => {
    err
      ? console.error("error creating folder", err)
      : console.log("New folder created: output");
  });
  fs.writeFile(outputPath, render(teamMember), (err) => {
    err
      ? console.error(err)
      : console.log("team.html successfully created within output directory");
  });
};

// function to initialize program
const init = async () => {
  await createManager();
  await addNewEmployee();
};
init();

import db from "@/services/db";
import { hashPassword } from "@/utils/helpers";
import { log } from "console";
import * as readline from "readline";
import { seedInstructors, seedStudents } from "./seed";

// Create an interface for readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt a question and get the answer
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const createSuperUser = async () => {
  const username = await prompt("Enter admin Username: ");
  if (await db.user.findFirst({ where: { username } })) {
    console.log(`[x]User with username exists`);
    process.exit(-1);
  }
  const email = await prompt("Enter admin email: ");
  if (await db.user.findFirst({ where: { profile: { email } } })) {
    console.log(`[x]User with email exists`);
    process.exit(-1);
  }
  const phoneNumber = await prompt("Enter admin phone number: ");
  if (await db.user.findFirst({ where: { profile: { phoneNumber } } })) {
    console.log(`[x]User with phone number exist`);
    process.exit(-1);
  }
  const password = await prompt("Enter admin password: ");
  const confirmPassword = await prompt("Confirm admin password: ");
  if (password !== confirmPassword) {
    console.log(`[x]Passwords dint match`);
    process.exit(-1);
  }
  const user = await db.user.create({
    include: { profile: true },
    data: {
      username,
      password: await hashPassword(password),
      isAdmin: true,
      profile: {
        create: {
          email,
          phoneNumber,
        },
      },
    },
  });
  console.log("[*]Admin User created succesfully");
};

const deleteUser = async (username: string) => {
  await db.user.deleteMany({
    where: {
      OR: [
        { username: username },
        { profile: { email: username } },
        { profile: { phoneNumber: username } },
      ],
    },
  });
};

const loggeErrorMessage = () => {
  console.log("Invalid Command");
  console.log("Supported Commands");
  console.log(
    "1. createSuperUser\n2. deleteUser\n3. seed instructors <number of instructors>\n4. seed students <number of students>"
  );
};

const main = async () => {
  const args = process.argv.slice(2); // Slice to ignore the first two default arguments
  const comand = args[0] || ""; // First command-line argument (if any)
  if (comand === "createSuperUser") {
    await createSuperUser();
  } else if (comand === "deleteUser") {
    if (args[1]) {
      await deleteUser(args[1]);
      console.log("[*]User DEleted succesfully");
    } else {
      console.log("Required Unique user attribute");
    }
  } else if (comand === "seed") {
    if (!args[2]) {
      return loggeErrorMessage();
    }
    if (args[1] === "instructors") {
      console.log("[*]Seeding instructors");
      await seedInstructors(parseInt(args[2]));
      console.log("[*]Instructors seeding succesfull");
    } else if (args[1] === "students") {
      console.log("[*]Seeding students");
      await seedStudents(parseInt(args[2]));
      console.log("[*]Students seeding succesfull");
    } else {
      loggeErrorMessage();
    }
  } else {
    loggeErrorMessage();
  }
  process.exit(0);
};

main();

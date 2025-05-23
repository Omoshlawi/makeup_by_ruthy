import { EnrollmentModel } from "@/features/students/models";
import db from "@/services/db";
import { hashPassword } from "@/utils/helpers";
import { fa, faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

// Define the directory path
const mediaDir = path.join(process.cwd(), "media", "courses");

// Helper function to get a list of files with specified extensions
const getFilesByExtension = (extensions: Array<string>) => {
  const files = fs.readdirSync(mediaDir);
  return files.filter((file) =>
    extensions.includes(path.extname(file).toLowerCase())
  );
};

// Function to get a random item from an array
const getRandomItem = (items: Array<any>) => {
  if (items.length === 0) return "";
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

// Function to get a random video
const getVideo = () => {
  const videoExtensions = [".mp4"];
  const videos = getFilesByExtension(videoExtensions);
  return `courses/${getRandomItem(videos)}`;
};

// Function to get a random image
const getImage = () => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const images = getFilesByExtension(imageExtensions);
  return `courses/${getRandomItem(images)}`;
};

export const seedInstructors = async (instructorsCount: number) => {
  const start = await db.instructor.count();
  for (let index = start; index < instructorsCount; index++) {
    console.log("[*]Creating provider ", index + 1);
    await db.instructor.create({
      data: {
        experience: faker.number.int({ min: 1, max: 40 }),
        profile: {
          create: {
            email: `tutor${index}@gmail.com`,
            phoneNumber: `${faker.phone.number()}-${index}`,
            avatarUrl: getImage(),
            bio: JSON.stringify([
              { insert: "Bio", attributes: { bold: true } },
              { insert: faker.person.bio() },
              { insert: "\n\n" },
              {
                insert:
                  "Topic one is all about testing the text input making sure everything is in place",
                attributes: { italic: true },
              },
              { insert: "\n\nKindly do the following\nlaurent ouma" },
              { insert: "\n", attributes: { list: "unchecked" } },
              { insert: "Jeff jakoyugi" },
              { insert: "\n", attributes: { list: "unchecked" } },
              { insert: "Saly Angienda" },
              { insert: "\n", attributes: { list: "checked" } },
              {
                insert:
                  "\n\nAn updated version hoes here, this is incredible dude bt you gave it you best short... That more than enough for thankz\n",
              },
            ]),
            gender: faker.helpers.arrayElement(["Male", "Female", "Unknown"]),
            name: faker.person.fullName(),
            user: {
              create: {
                password: await hashPassword("1234"),
                username: `tutor${index}`,
                profileUpdated: true,
              },
            },
          },
        },
        courses: {
          create: Array.from({ length: 10 }).map((_, i1) => {
            console.log(`[*]Creating Course ${i1} for instructor ${index}`);

            return {
              language: faker.helpers.arrayElement(["English", "Kiswahili"]),
              level: faker.helpers.arrayElement([
                "Intermediate",
                "Beginner",
                "Advanced",
              ]),
              previewVideo: { url: getVideo(), source: "file" },
              price: faker.number.float({ min: 1000, max: 150000 }),
              thumbnail: getImage(),
              timeToComplete: faker.number.float({ min: 15, max: 14400 - 1 }),
              title: `${faker.company.name()} ${i1}`,
              approved: faker.helpers.arrayElement([true, false]),
              averageRating: faker.number.float({
                min: 2.0,
                max: 5.0,
                fractionDigits: 1,
              }),

              tags: faker.helpers
                .arrayElements([
                  "lorem",
                  "impsum",
                  "Dolore",
                  "Test",
                  "Tags",
                  "Omosh",
                  "Ous",
                  "Learning",
                  "Makeup",
                  "Platform",
                ])
                .join(","),
              tests: {
                create: Array.from({ length: 10 }).map((_, i2) => {
                  console.log(
                    `[*]Creating Course ${i1} test ${i2} for instructor ${index}`
                  );
                  return {
                    title: `${faker.lorem.words(3)} ${i2}`,
                    order: i2 + 1,
                    questions: {
                      create: Array.from({ length: 10 }).map((_, i3) => {
                        console.log(
                          `[*]Creating Course ${i1} test ${i2} question ${i3} for instructor ${index}`
                        );

                        return {
                          question: `${faker.lorem.sentence()} ${i3}`,
                          order: i3 + 1,
                          choices: {
                            create: Array.from({ length: 10 }).map((_, i4) => {
                              console.log(
                                `[*]Creating Course ${i1} test ${i2} question ${i3} choice ${i4} for instructor ${index}`
                              );

                              return {
                                choice: `${faker.lorem.sentence(1)} ${i4}`,
                                answer: faker.helpers.arrayElement([
                                  true,
                                  false,
                                ]),
                              };
                            }),
                          },
                        };
                      }),
                    },
                  };
                }),
              },
              status: faker.helpers.arrayElement(["Published", "Draft"]),
              overview: JSON.stringify([
                { insert: "Course Overview", attributes: { bold: true } },
                { insert: faker.lorem.paragraphs() },
                { insert: "\n\n" },
                {
                  insert:
                    "Topic one is all about testing the text input making sure everything is in place",
                  attributes: { italic: true },
                },
                { insert: "\n\nKindly do the following\nlaurent ouma" },
                { insert: "\n", attributes: { list: "unchecked" } },
                { insert: "Jeff jakoyugi" },
                { insert: "\n", attributes: { list: "unchecked" } },
                { insert: "Saly Angienda" },
                { insert: "\n", attributes: { list: "checked" } },
                {
                  insert:
                    "\n\nAn updated version hoes here, this is incredible dude bt you gave it you best short... That more than enough for thankz\n",
                },
              ]),
              modules: {
                create: Array.from({ length: 10 }).map((_, i5) => {
                  console.log(
                    `[*]Creating Course ${i1} module ${i5} for instructor ${index}`
                  );

                  return {
                    title: `${faker.lorem.words(3)} ${i5}`,
                    overview: JSON.stringify([
                      { insert: "Module Overview", attributes: { bold: true } },
                      { insert: faker.lorem.paragraphs() },
                      { insert: "\n\n" },
                      {
                        insert:
                          "Topic one is all about testing the text input making sure everything is in place",
                        attributes: { italic: true },
                      },
                      { insert: "\n\nKindly do the following\nlaurent ouma" },
                      { insert: "\n", attributes: { list: "unchecked" } },
                      { insert: "Jeff jakoyugi" },
                      { insert: "\n", attributes: { list: "unchecked" } },
                      { insert: "Saly Angienda" },
                      { insert: "\n", attributes: { list: "checked" } },
                      {
                        insert:
                          "\n\nAn updated version hoes here, this is incredible dude bt you gave it you best short... That more than enough for thankz\n",
                      },
                    ]),
                    order: i5 + 1,
                    content: {
                      create: Array.from({ length: 10 }).map((_, i6) => {
                        console.log(
                          `[*]Creating Course ${i1} module ${i5} content ${i6} for instructor ${index}`
                        );

                        const type = faker.helpers.arrayElement([
                          "Video",
                          "Document",
                          "Text",
                          "Image",
                        ]);
                        return {
                          resource:
                            type === "Video"
                              ? getVideo()
                              : type === "Image"
                              ? getImage()
                              : type === "Text"
                              ? faker.lorem.paragraphs(5)
                              : "courses/makeup-by-ruthie-1.0.0-1724739532118-240826-plso-update-on-the-kuppet-nationwide-strike-01.pdf", //HERE
                          order: i6 + 1,
                          title: `${faker.lorem.words(2)} ${i6}`,
                          type: type as any,
                        };
                      }),
                    },
                  };
                }),
              },
            };
          }),
        },
      },
    });
  }
};

export const seedStudents = async (studentsCount: number) => {
  const enrollments = 10;
  const start = await db.student.count();
  for (let index = start; index < studentsCount; index++) {
    console.log("[*]Creating student ", index + 1);
    const student = await db.student.create({
      data: {
        skillLevel: faker.helpers.arrayElement([
          "Beginner",
          "Intermediate",
          "Advanced",
        ]),
        profile: {
          create: {
            email: `stude${index}@gmail.com`,
            phoneNumber: `${faker.phone.number()}-${index}`,
            avatarUrl: getImage(),
            bio: JSON.stringify([
              { insert: "Bio", attributes: { bold: true } },
              { insert: faker.person.bio() },
              { insert: "\n\n" },
              {
                insert:
                  "Topic one is all about testing the text input making sure everything is in place",
                attributes: { italic: true },
              },
              { insert: "\n\nKindly do the following\nlaurent ouma" },
              { insert: "\n", attributes: { list: "unchecked" } },
              { insert: "Jeff jakoyugi" },
              { insert: "\n", attributes: { list: "unchecked" } },
              { insert: "Saly Angienda" },
              { insert: "\n", attributes: { list: "checked" } },
              {
                insert:
                  "\n\nAn updated version hoes here, this is incredible dude bt you gave it you best short... That more than enough for thankz\n",
              },
            ]),
            gender: faker.helpers.arrayElement(["Male", "Female", "Unknown"]),
            name: faker.person.fullName(),
            user: {
              create: {
                password: await hashPassword("1234"),
                username: `stude${index}`,
                profileUpdated: true,
              },
            },
          },
        },
      },
      include: { profile: true },
    });
    console.log(`[*]Enroll student ${index} to ${enrollments} courses`);
    for (
      let enrollmentIndex = 0;
      enrollmentIndex < enrollments;
      enrollmentIndex++
    ) {
      const randomCourse = await db.course.findFirst({
        where: {
          approved: true,
          status: "Published",
          enrollments: {
            none: {
              studentId: student.id,
            },
          },
        },
      });
      if (!randomCourse) continue;
      console.log(
        `[${enrollmentIndex}]Enrolling student ${index} to course ${randomCourse?.title}`
      );
      await db.enrollment.create({
        data: {
          studentId: student.id,
          courseId: randomCourse!.id,
          cost: randomCourse!.price,
          payment: {
            create: {
              complete: true,
              checkoutRequestId: `checkoutId-${student.id}-${randomCourse!.id}`,
              merchantRequestId: `machenantId-${student.id}-${
                randomCourse!.id
              }`,
              amount: randomCourse!.price,
              mpesareceiptNumber: faker.string.uuid(),
              phoneNumber: student.profile.phoneNumber,
              resultCode: "0",
            },
          },
        },
      });
    }
  }
};

export const seedTopics = async (topicsCount: number) => {
  await Promise.all(
    Array.from({ length: topicsCount }).map((_, index) =>
      db.topic.create({
        data: {
          name: faker.company.name(),
          thumbnail: getImage(),
          overview: JSON.stringify([
            { insert: "Topic Overview", attributes: { bold: true } },
            { insert: faker.lorem.paragraphs(3) },
            { insert: "\n\n" },
            {
              insert:
                "Topic one is all about testing the text input making sure everything is in place",
              attributes: { italic: true },
            },
            { insert: "\n\nKindly do the following\nlaurent ouma" },
            { insert: "\n", attributes: { list: "unchecked" } },
            { insert: "Jeff jakoyugi" },
            { insert: "\n", attributes: { list: "unchecked" } },
            { insert: "Saly Angienda" },
            { insert: "\n", attributes: { list: "checked" } },
            {
              insert:
                "\n\nAn updated version hoes here, this is incredible dude bt you gave it you best short... That more than enough for thankz\n",
            },
          ]),
        },
      })
    )
  );
};

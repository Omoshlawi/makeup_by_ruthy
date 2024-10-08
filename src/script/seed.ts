import db from "@/services/db";
import { faker } from "@faker-js/faker";
import path from "path";
import fs from "fs";

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

const seedInstructors = async (instructorsCount: number) => {
  for (let index = 0; index < instructorsCount; index++) {
    console.log("[*]Creating provider ", index + 1);
    await db.instructor.create({
      data: {
        experience: faker.number.int({ min: 1, max: 40 }),
        profile: {
          create: {
            email: `${index}${faker.internet.email()}`,
            phoneNumber: `${faker.phone.number()}-${index}`,
            avatarUrl: getImage(),
            bio: faker.person.bio(),
            gender: faker.helpers.arrayElement(["Male", "Female", "Unknown"]),
            name: faker.person.fullName(),
            user: {
              create: {
                password: faker.internet.password(),
                username: `${faker.internet.userName()}${index}`,
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
              timeToComplete: faker.number.float({ min: 15, max: 36000 }),
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
                    questions: {
                      create: Array.from({ length: 10 }).map((_, i3) => {
                        console.log(
                          `[*]Creating Course ${i1} test ${i2} question ${i3} for instructor ${index}`
                        );

                        return {
                          question: `${faker.lorem.sentence()} ${i3}`,
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
              overview: faker.lorem.paragraphs(),
              modules: {
                create: Array.from({ length: 10 }).map((_, i5) => {
                  console.log(
                    `[*]Creating Course ${i1} module ${i5} for instructor ${index}`
                  );

                  return {
                    title: `${faker.lorem.words(3)} ${i5}`,
                    overview: faker.lorem.paragraph(),
                    order: 1,
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
                          order: 1,
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

console.log("[*]Starting seeding ....");
seedInstructors(100);

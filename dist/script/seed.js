"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../services/db"));
const faker_1 = require("@faker-js/faker");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Define the directory path
const mediaDir = path_1.default.join(process.cwd(), "media", "courses");
// Helper function to get a list of files with specified extensions
const getFilesByExtension = (extensions) => {
    const files = fs_1.default.readdirSync(mediaDir);
    return files.filter((file) => extensions.includes(path_1.default.extname(file).toLowerCase()));
};
// Function to get a random item from an array
const getRandomItem = (items) => {
    if (items.length === 0)
        return "";
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
const seedInstructors = (instructorsCount) => __awaiter(void 0, void 0, void 0, function* () {
    for (let index = 0; index < instructorsCount; index++) {
        console.log("[*]Creating provider ", index + 1);
        yield db_1.default.instructor.create({
            data: {
                experience: faker_1.faker.number.int({ min: 1, max: 40 }),
                profile: {
                    create: {
                        email: `${index}${faker_1.faker.internet.email()}`,
                        phoneNumber: `${faker_1.faker.phone.number()}-${index}`,
                        avatarUrl: getImage(),
                        bio: faker_1.faker.person.bio(),
                        gender: faker_1.faker.helpers.arrayElement(["Male", "Female", "Unknown"]),
                        name: faker_1.faker.person.fullName(),
                        user: {
                            create: {
                                password: faker_1.faker.internet.password(),
                                username: `${faker_1.faker.internet.userName()}${index}`,
                                profileUpdated: true,
                            },
                        },
                    },
                },
                courses: {
                    create: Array.from({ length: 10 }).map((_, i1) => {
                        console.log(`[*]Creating Course ${i1} for instructor ${index}`);
                        return {
                            language: faker_1.faker.helpers.arrayElement(["English", "Kiswahili"]),
                            level: faker_1.faker.helpers.arrayElement([
                                "Intermediate",
                                "Beginner",
                                "Advanced",
                            ]),
                            previewVideo: { url: getVideo(), source: "file" },
                            price: faker_1.faker.number.float({ min: 1000, max: 150000 }),
                            thumbnail: getImage(),
                            timeToComplete: faker_1.faker.number.float({ min: 15, max: 36000 }),
                            title: `${faker_1.faker.company.name()} ${i1}`,
                            approved: faker_1.faker.helpers.arrayElement([true, false]),
                            averageRating: faker_1.faker.number.float({
                                min: 2.0,
                                max: 5.0,
                                fractionDigits: 1,
                            }),
                            tags: faker_1.faker.helpers
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
                                    console.log(`[*]Creating Course ${i1} test ${i2} for instructor ${index}`);
                                    return {
                                        title: `${faker_1.faker.lorem.words(3)} ${i2}`,
                                        questions: {
                                            create: Array.from({ length: 10 }).map((_, i3) => {
                                                console.log(`[*]Creating Course ${i1} test ${i2} question ${i3} for instructor ${index}`);
                                                return {
                                                    question: `${faker_1.faker.lorem.sentence()} ${i3}`,
                                                    choices: {
                                                        create: Array.from({ length: 10 }).map((_, i4) => {
                                                            console.log(`[*]Creating Course ${i1} test ${i2} question ${i3} choice ${i4} for instructor ${index}`);
                                                            return {
                                                                choice: `${faker_1.faker.lorem.sentence(1)} ${i4}`,
                                                                answer: faker_1.faker.helpers.arrayElement([
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
                            status: faker_1.faker.helpers.arrayElement(["Published", "Draft"]),
                            overview: faker_1.faker.lorem.paragraphs(),
                            modules: {
                                create: Array.from({ length: 10 }).map((_, i5) => {
                                    console.log(`[*]Creating Course ${i1} module ${i5} for instructor ${index}`);
                                    return {
                                        title: `${faker_1.faker.lorem.words(3)} ${i5}`,
                                        overview: faker_1.faker.lorem.paragraph(),
                                        order: 1,
                                        content: {
                                            create: Array.from({ length: 10 }).map((_, i6) => {
                                                console.log(`[*]Creating Course ${i1} module ${i5} content ${i6} for instructor ${index}`);
                                                const type = faker_1.faker.helpers.arrayElement([
                                                    "Video",
                                                    "Document",
                                                    "Text",
                                                    "Image",
                                                ]);
                                                return {
                                                    resource: type === "Video"
                                                        ? getVideo()
                                                        : type === "Image"
                                                            ? getImage()
                                                            : type === "Text"
                                                                ? faker_1.faker.lorem.paragraphs(5)
                                                                : "courses/makeup-by-ruthie-1.0.0-1724739532118-240826-plso-update-on-the-kuppet-nationwide-strike-01.pdf", //HERE
                                                    order: 1,
                                                    title: `${faker_1.faker.lorem.words(2)} ${i6}`,
                                                    type: type,
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
});
console.log("[*]Starting seeding ....");
seedInstructors(100);

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
exports.downLoadCertificate = exports.progress = exports.getMyEnrollment = exports.getMyEnrollments = exports.completeEnrollmentPayement = exports.enroll = exports.getStudents = void 0;
const models_1 = require("../../../features/courses/models");
const models_2 = require("../../../features/users/models");
const mpesa_1 = require("../../../services/mpesa");
const exceprions_1 = require("../../../shared/exceprions");
const helpers_1 = require("../../../utils/helpers");
const ejs_1 = __importDefault(require("ejs"));
const promises_1 = require("fs/promises");
const html_pdf_1 = __importDefault(require("html-pdf"));
const path_1 = __importDefault(require("path"));
const models_3 = require("../models");
const schema_1 = require("../schema");
const getStudents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield models_2.UserModel.findMany({
            where: { profile: { student: { isNot: null } } },
            include: {
                profile: {
                    include: { student: true },
                },
            },
        });
        return res.json({ results: students });
    }
    catch (error) {
        next(error);
    }
});
exports.getStudents = getStudents;
const enroll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate payload
        const validation = yield schema_1.enrollmentValidationShema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const student = req.user;
        // Assert course exist and user aint auther and user aint enrolled and completed payment to it yet
        const course = yield models_1.CourseModel.findUniqueOrThrow({
            where: {
                id: req.params.courseId,
                instructor: { profile: { userId: { not: student.id } } },
                enrollments: {
                    none: {
                        studentId: student.profile.student.id,
                        // payment: { complete: true },
                    },
                },
            },
            include: { enrollments: true },
        });
        // Clean phone number by removing code +?254|0
        const phoneNumber = (0, helpers_1.normalizePhoneNumber)(validation.data.phoneNumber);
        // Initiate stk push
        const { data } = yield (0, mpesa_1.triggerStkPush)(phoneNumber, Number(course.price), `Payment for course ${course.id}(${course.title})`);
        const { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage, } = data !== null && data !== void 0 ? data : {};
        // Create enrollment
        const enrollemt = yield models_3.EnrollmentModel.create({
            data: {
                cost: course.price,
                courseId: course.id,
                studentId: student.profile.student.id,
                payment: {
                    create: {
                        checkoutRequestId: CheckoutRequestID,
                        merchantRequestId: MerchantRequestID,
                        resultCode: ResponseCode,
                        resultDescription: `${ResponseDescription}-${CustomerMessage}`,
                    },
                },
            },
            include: {
                course: true,
                payment: {
                    select: {
                        amount: true,
                        mpesareceiptNumber: true,
                        complete: true,
                        phoneNumber: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                        transactionDate: true,
                        enrollmentId: true,
                        description: true,
                    },
                },
            },
        });
        return res.json({
            detail: "Enrollment succesfull, KIndly complete payment to access course content",
            enrollment: enrollemt,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.enroll = enroll;
const completeEnrollmentPayement = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validate payload
        const validation = yield schema_1.enrollmentValidationShema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const student = req.user;
        // Assert enrollemtn exist and it bellongs to curr user and either has incomplete payment
        let enrollment;
        enrollment = yield models_3.EnrollmentModel.findUniqueOrThrow({
            where: {
                id: req.params.enrollmentId,
                studentId: student.profile.student.id,
                OR: [{ payment: null }, { payment: { complete: false } }],
            },
            include: {
                course: true,
                payment: {
                    select: {
                        amount: true,
                        mpesareceiptNumber: true,
                        complete: true,
                        phoneNumber: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                        transactionDate: true,
                        enrollmentId: true,
                        description: true,
                    },
                },
            },
        });
        // Clean phone number by removing code +?254|0
        const phoneNumber = (0, helpers_1.normalizePhoneNumber)(validation.data.phoneNumber);
        // Initiate stk push
        const { data } = yield (0, mpesa_1.triggerStkPush)(phoneNumber, Number(enrollment.course.price), `Payment for course ${enrollment.courseId}(${enrollment.course.title})`);
        const { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage, } = data !== null && data !== void 0 ? data : {};
        // Update or create enrollment
        enrollment = yield models_3.EnrollmentModel.update({
            where: {
                id: enrollment.id,
            },
            data: {
                cost: enrollment.course.price,
                payment: {
                    delete: { id: (_a = enrollment.payment) === null || _a === void 0 ? void 0 : _a.id }, //First delete previous payment attempt if any
                    create: {
                        checkoutRequestId: CheckoutRequestID,
                        merchantRequestId: MerchantRequestID,
                        resultCode: ResponseCode,
                        resultDescription: `${ResponseDescription}-${CustomerMessage}`,
                    }, // Create new payment
                },
            },
            include: {
                course: true,
                reviews: true,
                payment: {
                    select: {
                        amount: true,
                        mpesareceiptNumber: true,
                        complete: true,
                        phoneNumber: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                        transactionDate: true,
                        enrollmentId: true,
                        description: true,
                    },
                },
            },
        });
        return res.json({
            detail: "KIndly complete mpesa payment to access course content",
            enrollment: enrollment,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.completeEnrollmentPayement = completeEnrollmentPayement;
const getMyEnrollments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = req.user;
        const enrollments = yield models_3.EnrollmentModel.findMany({
            where: { studentId: student.profile.student.id },
            include: models_1.enrollmentInclude,
        });
        return res.json({ results: enrollments });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyEnrollments = getMyEnrollments;
const getMyEnrollment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const student = req.user;
        const enrollments = yield models_3.EnrollmentModel.findUniqueOrThrow({
            where: { studentId: student.profile.student.id, id: req.params.id },
            include: models_1.enrollmentInclude,
        });
        return res.json(enrollments);
    }
    catch (error) {
        next(error);
    }
});
exports.getMyEnrollment = getMyEnrollment;
const progress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Assetain enrollment exist
     * Assertain enrollment payment is complete
     * Asertain enrollment course module and asociated content exist
     * Creates a progress if none already exist else throws an error
     */
    try {
        const contentId = req.params.contentId;
        const moduleId = req.params.moduleId;
        const enrollmentId = req.params.enrollmentId;
        // Assertain paid course enrollemnt exist with asociatted modules and content and try create progress
        let enrollment;
        enrollment = yield models_3.EnrollmentModel.update({
            where: {
                id: enrollmentId,
                course: {
                    modules: {
                        some: {
                            id: moduleId,
                            content: {
                                some: {
                                    id: contentId,
                                },
                            },
                        },
                    },
                },
                payment: {
                    complete: true,
                },
            },
            include: {
                course: {
                    select: {
                        modules: {
                            select: { id: true, _count: { select: { content: true } } },
                        },
                    },
                },
                reviews: true,
                moduleProgress: {
                    select: {
                        // id: true,
                        moduleId: true,
                        _count: { select: { contents: true } },
                        // contents: {
                        //   select: {
                        //     id: true,
                        //     contentId: true,
                        //     createdAt: true,
                        //   },
                        // },
                        // createdAt: true,
                    },
                },
            },
            data: {
                moduleProgress: {
                    upsert: {
                        where: {
                            enrollmentId_moduleId: { enrollmentId, moduleId },
                        },
                        create: {
                            moduleId,
                            contents: {
                                create: {
                                    contentId,
                                },
                            },
                        },
                        update: {
                            contents: {
                                create: {
                                    contentId,
                                },
                            },
                        },
                    },
                },
            },
        });
        // Calculate progress percentage
        const totalContents = enrollment.course.modules.reduce((acc, { _count: { content } }) => acc + content, 0);
        const completedContents = enrollment.moduleProgress.reduce((acc, { _count: { contents } }) => acc + contents, 0);
        const progressPercentage = totalContents > 0 ? (completedContents / totalContents) * 100 : 0.0;
        // Update progress percentage
        enrollment = yield models_3.EnrollmentModel.update({
            where: {
                id: enrollmentId,
            },
            data: {
                progressPercentage,
            },
            include: {
                course: {
                    include: {
                        instructor: true,
                        modules: {
                            include: {
                                content: true,
                            },
                        },
                    },
                },
                moduleProgress: {
                    select: {
                        id: true,
                        moduleId: true,
                        contents: {
                            select: {
                                id: true,
                                contentId: true,
                                createdAt: true,
                            },
                        },
                        createdAt: true,
                        // _count: true,
                    },
                },
                payment: {
                    select: {
                        amount: true,
                        mpesareceiptNumber: true,
                        complete: true,
                        phoneNumber: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                        transactionDate: true,
                        enrollmentId: true,
                        description: true,
                    },
                },
            },
        });
        // Return updated enrollment with progresses
        return res.json(enrollment);
    }
    catch (error) {
        next(error);
    }
});
exports.progress = progress;
const downLoadCertificate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollmentId = req.params.enrollmentId;
        const student = req.user;
        const enrollment = yield models_3.EnrollmentModel.findUniqueOrThrow({
            where: {
                id: enrollmentId,
                studentId: student.profile.student.id,
                progressPercentage: {
                    gte: 100,
                },
                course: {
                    //Assert all course tests are attempted atleast once
                    tests: {
                        every: {
                            attempts: {
                                some: {
                                    enrollmentId,
                                },
                            },
                        },
                    },
                },
            },
            include: {
                course: true,
            },
        });
        const html = yield ejs_1.default.renderFile(path_1.default.join(process.cwd(), "assets", "certificate-template.ejs"), {
            studentName: student.profile.name,
            courseName: enrollment.course.title,
            signBase64: yield (0, promises_1.readFile)(path_1.default.join(process.cwd(), "assets", "signature.png"), { encoding: "base64" }),
            frameBase64: yield (0, promises_1.readFile)(path_1.default.join(process.cwd(), "assets", "frame.png"), { encoding: "base64" }),
            medalBase64: yield (0, promises_1.readFile)(path_1.default.join(process.cwd(), "assets", "medal.png"), { encoding: "base64" }),
            congratsBase64: yield (0, promises_1.readFile)(path_1.default.join(process.cwd(), "assets", "congrats.png"), { encoding: "base64" }),
        });
        // return res.send(html);
        html_pdf_1.default
            .create(html, {
            format: "A4",
            orientation: "portrait",
            border: { top: "2mm", right: "2mm", bottom: "2mm", left: "2mm" },
        })
            .toBuffer((err, buffer) => {
            if (err) {
                throw err;
            }
            else {
                // Set appropriate headers for PDF streaming
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", 'attachment; filename="certificate.pdf"');
                // Stream the PDF buffer directly to the response
                res.send(buffer);
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.downLoadCertificate = downLoadCertificate;

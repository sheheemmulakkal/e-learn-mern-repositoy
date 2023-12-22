import { IStudentService } from "../interfaces/studentService.interface";
import { BadRequestError } from "../../common/errors/badRequestError";
import { NotFoundError } from "../../common/errors/notFoundError";
import { ICourse } from "../../common/types/course";
import { IStudent } from "../../common/types/student";
import { ISearch } from "../../common/types/searchCourse";
import { IEnrolledCourse } from "../../common/types/enrolledCourse";
import { StudentRepository } from "../../repositories/implements/studentRepository";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import { CategoryRepository } from "../../repositories/implements/categoryRepository";
import { InstructorRepository } from "../../repositories/implements/intstructorRepository";
import { EnrolledCourseRepository } from "../../repositories/implements/enrolledCourseRepository";
import s3 from "../../../config/aws.config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Stripe from "stripe";
import nodemailer from "nodemailer";
// const OpenAI = require("openai");
import OpenAI from "openai";
import { ICategory } from "../../common/types/category";
// import { OpenAIResponse } from "../../common/types/openaiResponse";

const INSTRUCTOR_COURSE_PERCENTAGE = 70;
const LEARNING_PATH_SYSTEM_PROMPT = `
You are a skilled instructor on Skill Savant.
Your goal is to provide a concise learning path for students interested in mastering any course.

- Start with an engaging introduction to the course, emphasizing real-world applications.
- Organize modules with focused lessons, incorporating quizzes, coding exercises, and hands-on projects.
- Guide students to external resources like articles and videos for deeper understanding.
- Provide clear explanations, code samples, and practical examples for each concept.
- Include assessments at each module's end for evaluation.
- Foster collaboration through discussion forums or group projects.
- Assist in setting up dev environments and tools, emphasizing best practices.
- Leverage a code editor, optionally integrating Git for collaboration.
- Utilize relevant libraries, frameworks, or platforms specific to that course.
- Recommend resources such as documentation, forums, and community support.

Personalize the path to your teaching style and course requirements. 
Return in bullet points for great understanding.
`;

const stripe = new Stripe(process.env.STRIPE_KEY!);

export class StudentService implements IStudentService {
  private studentRepository: StudentRepository;
  private instructorRepository: InstructorRepository;
  private courseRepository: CourseRepository;
  private enrolledCourseRepository: EnrolledCourseRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
    this.instructorRepository = new InstructorRepository();
    this.courseRepository = new CourseRepository();
    this.enrolledCourseRepository = new EnrolledCourseRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async signup(studentDetails: IStudent): Promise<IStudent> {
    const existingStudent = await this.studentRepository.findStudentByEmail(
      studentDetails.email!
    );
    if (existingStudent) {
      throw new BadRequestError("Student already exist");
    } else {
      return await this.studentRepository.createStudent(studentDetails);
    }
  }

  async login(email: string): Promise<IStudent> {
    const student = await this.studentRepository.findStudentByEmail(email);
    if (!student) {
      throw new NotFoundError("Email not found");
    } else {
      return student;
    }
  }

  async verifyStudent(email: string): Promise<IStudent> {
    return await this.studentRepository.updateUserVerification(email);
  }
  async getCourses({
    page,
    category,
  }: {
    page: number;
    category?: string;
  }): Promise<{
    courses: ICourse[];
    totalCount: number;
    categories: ICategory[];
  } | null> {
    const courseDeatils = await this.courseRepository.getListedCourses({
      page,
      category,
    });
    const categories = await this.categoryRepository.getListedCategories();
    const result = { ...courseDeatils, categories } as {
      courses: ICourse[];
      totalCount: number;
      categories: ICategory[];
    } | null;
    return result;
  }

  async findStudentById(studentId: string): Promise<IStudent> {
    return await this.studentRepository.findStudentById(studentId);
  }

  async updatePassword(studentId: string, password: string): Promise<IStudent> {
    return await this.studentRepository.udpatePassword(studentId, password);
  }

  async updateProfileImage(
    studentId: string,
    file: Express.Multer.File
  ): Promise<IStudent> {
    try {
      const { image } = await this.studentRepository.findStudentById(studentId);
      if (image) {
        const fileName = decodeURIComponent(image.split("/").pop()!.trim());
        const existingParams = {
          Bucket: "eduvistabucket-aws",
          Key: `profile-images/${fileName}`,
        };
        await s3.send(new DeleteObjectCommand(existingParams));
      }
      const key = `profile-images/${file.originalname}`;
      const params = {
        Bucket: "eduvistabucket-aws",
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const filePath = `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
      await s3.send(new PutObjectCommand(params));
      return await this.studentRepository.updateImage(studentId, filePath);
    } catch (error) {
      throw new BadRequestError("Couldn't upload profile image");
    }
  }

  async updateStudentName(studentDetails: IStudent): Promise<IStudent> {
    return await this.studentRepository.updateStudentName(studentDetails);
  }

  async getSingleCourse(courseId: string): Promise<ICourse> {
    const course = await this.courseRepository.getSingleCourseForInstructor(
      courseId
    );
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    return course;
  }

  async searchCourse(details: ISearch): Promise<ICourse[] | null> {
    const course = await this.courseRepository.searchCoursesForStudents(
      details
    );
    return course;
  }

  async resetForgotPassword(
    email: string,
    password: string
  ): Promise<IStudent> {
    const student = await this.studentRepository.findStudentByEmail(email);
    if (!student) {
      throw new BadRequestError("Student not found");
    }
    return await this.studentRepository.udpatePassword(student.id!, password);
  }

  async stripePayment(courseId: string, studentId: string): Promise<string> {
    const course = await this.courseRepository.findCourseById(courseId);
    const existingEnrollment =
      await this.enrolledCourseRepository.checkEnrolledCourse(
        courseId,
        studentId
      );
    if (existingEnrollment) {
      throw new BadRequestError("Already enrolled");
    }
    if (!course) {
      throw new BadRequestError("Course not found");
    }
    const payment = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.name as string,
            },
            unit_amount: course.price! * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/status?success=true&courseId=${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/status`,
    });

    return payment.url!;
  }
  async enrollCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse> {
    const existingEnrollment =
      await this.enrolledCourseRepository.checkEnrolledCourse(
        courseId,
        studentId
      );
    if (existingEnrollment) {
      throw new BadRequestError("Course already enrolled");
    }
    const course = await this.courseRepository.findCourseById(courseId);
    await this.studentRepository.courseEnroll(studentId, courseId);
    const courseDetails = {
      courseId,
      studentId,
      price: course?.price,
    };

    const enrolledCourse = await this.enrolledCourseRepository.createCourse(
      courseDetails
    );
    const instructorAmount =
      (course!.price! * INSTRUCTOR_COURSE_PERCENTAGE) / 100;
    const description = `Enrollment fee from course ${course?.name} (ID: ${course?.id})`;
    if (course) {
      await this.instructorRepository.addToWallet(
        course.instructor!,
        instructorAmount
      );
      await this.instructorRepository.addWalletHistory(
        course.instructor!,
        instructorAmount,
        description
      );
    }
    return enrolledCourse;
  }

  async getEnrolledCourse(
    courseId: string,
    studentId: string
  ): Promise<IEnrolledCourse | null> {
    return await this.enrolledCourseRepository.getCourseByStudentIdAndCourseId(
      studentId,
      courseId
    );
  }
  async getAllEnrolledCourses(studentId: string): Promise<IEnrolledCourse[]> {
    return await this.enrolledCourseRepository.getEnrolledCoursesByStudent(
      studentId
    );
  }

  async addProgression(
    enrollmentId: string,
    moduleId: string
  ): Promise<IEnrolledCourse> {
    return await this.enrolledCourseRepository.addModuleToProgression(
      enrollmentId,
      moduleId
    );
  }

  async addNotes(enrolledId: string, notes: string): Promise<IEnrolledCourse> {
    return await this.enrolledCourseRepository.addNotes(enrolledId, notes);
  }

  async createRoadmap(topic: string): Promise<string> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });

    const TOPIC_PROMPT = `Create a learning path for ${topic}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: TOPIC_PROMPT },
        {
          role: "system",
          content: LEARNING_PATH_SYSTEM_PROMPT,
        },
      ],
      temperature: 0.2,
      max_tokens: 1000,
    });
    return response.choices[0].message.content!;
  }

  async scheduledMail(): Promise<void> {
    const emails = await this.studentRepository.getAllStudentsEmails();
    function sendMail(email: string) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        service: "Gmail",
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_EMAIL_PASSWORD,
        },
      });
      transporter.sendMail({
        to: email,
        from: process.env.USER_EMAIL,
        subject: "EduVista OTP Verification",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Your Brand</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing EduVista. Use the following OTP to complete your Sign Up procedures.
             OTP is valid for 10 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color:
             #fff;border-radius: 4px;"></h2>
            <p style="font-size:0.9em;">Regards,<br />EduVista</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Your EduVista Inc</p>
              <p>KINFRA SDF Building</p>
              <p>Kerala</p>
              <p>India</p>
            </div>
          </div>
        </div>`,
      });
    }
    emails.forEach((email) => {
      sendMail(email);
    });
  }
}

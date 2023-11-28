import { StudentRepository } from "../../repositories/implements/studentRepository";
import { IStudent } from "../../common/types/student";
import { IStudentService } from "../interfaces/studentService.interface";
import { BadRequestError } from "../../common/errors/badRequestError";
import { NotFoundError } from "../../common/errors/notFoundError";
import { ICourse } from "../../common/types/course";
import { CourseRepository } from "../../repositories/implements/courseRepository";
import s3 from "../../../config/aws.config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ISearch } from "../../common/types/searchCourse";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY!);

export class StudentService implements IStudentService {
  private studentRepository: StudentRepository;
  private courseRepository: CourseRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
    this.courseRepository = new CourseRepository();
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
  async getCourses(): Promise<ICourse[] | null> {
    return await this.courseRepository.getListedCourses();
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

  async stripePayment(courseId: string): Promise<string> {
    const course = await this.courseRepository.findCourseById(courseId);
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
      success_url: `${process.env.CLIENT_URL}/status/success`,
      cancel_url: `${process.env.CLIENT_URL}/status/cancel`,
    });

    return payment.url!;
  }
}

const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const { z } = require("zod");

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // Ensure passwords have at least 6 characters
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  price: z.number().min(0),
});

const courseUpdateSchema = courseSchema.extend({
  courseId: z.string(),
});

// Middleware to validate request bodies
function validate(schema) {
  return (req, res, next) => {
    const validationResult = schema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }
    next();
  };
}

// Routes with Zod validation
adminRouter.post("/signup", validate(signupSchema), async function (req, res) {
  const { email, password, firstName, lastName } = req.body;

  try {
    await adminModel.create({ email, password, firstName, lastName });
    res.json({ message: "Signup succeeded" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
});

adminRouter.post("/signin", validate(signinSchema), async function (req, res) {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email, password });

    if (admin) {
      const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
      res.json({ token });
    } else {
      res.status(403).json({ message: "Incorrect credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error signing in", error });
  }
});

adminRouter.post(
  "/course",
  adminMiddleware,
  validate(courseSchema),
  async function (req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    try {
      const course = await courseModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId: adminId,
      });
      res.json({ message: "Course created", courseId: course._id });
    } catch (error) {
      res.status(500).json({ message: "Error creating course", error });
    }
  }
);

adminRouter.put(
  "/course",
  adminMiddleware,
  validate(courseUpdateSchema),
  async function (req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    try {
      const course = await courseModel.updateOne(
        { _id: courseId, creatorId: adminId },
        { title, description, imageUrl, price }
      );

      if (course.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "Course not found or not authorized to update" });
      }

      res.json({ message: "Course updated", courseId });
    } catch (error) {
      res.status(500).json({ message: "Error updating course", error });
    }
  }
);

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  try {
    const courses = await courseModel.find({ creatorId: adminId });
    res.json({ message: "All courses", courses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
});

module.exports = {
  adminRouter,
};

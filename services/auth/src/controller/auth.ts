import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt"
import axios from "axios"
import jwt from "jsonwebtoken"
import { forgotPasswordTemplate } from "../template.js";
import { publishToTopic } from "../producer.js";
import { redisClient } from "../index.js";



export const registerUser = TryCatch(async (req, res, next) => {
    const { name, email, password, phone_number, role, bio } = req.body || {};
    console.log(req.body)
    if (!name || !email || !password || !phone_number || !role) {
        console.log("Plese bhaiya bahr do sb kuch");
        throw new ErrorHandler(400, "Please Fill all details")
    }

    const existingUsers = await sql`SELECT user_id FROM users WHERE email=${email}`
    if (existingUsers.length > 0) {
        throw new ErrorHandler(409, "User with email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    let registerUser;

    if (role === "recruiter") {
        const [user] = await sql`
        INSERT INTO USERS (name, email, password, phone_number, role) VALUES (${name}, ${email}, ${hashPassword}, ${phone_number}, ${role})
        RETURNING user_id, name, email, phone_number, role, created_at, updated_at;
        `;
        registerUser = user;
    }
    else if (role === "jobseeker") {
        const file = req.file;
        if (!file) {
            throw new ErrorHandler(400, "Resume file is required for jobseekers");
        }
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler(500, "Failed to process file");
        }

        const { data } = await axios.post(
            `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
            { buffer: fileBuffer.content }
        )
        const [user] = await sql`
        INSERT INTO USERS (name, email, password, phone_number, role, bio, resume, resume_public_id) VALUES (${name}, ${email}, ${hashPassword}, ${phone_number}, ${role}, ${bio},${data.url}, ${data.public_id})
        RETURNING user_id, name, email, phone_number, role, created_at, updated_at;
        `;
        registerUser = user;
    }
    const token = jwt.sign({
        id: registerUser?.user_id,

    }, process.env.JWT_SECRET as string, {
        expiresIn: "15d"
    })
    res.json({
        message: "Registered Successfully",
        user: registerUser,
        token

    });
});

export const loginUser = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ErrorHandler(400, "Please Fill all details");
    }
    const user = await sql`
        SELECT u.user_id, u.name, u.email, u.password, u.phone_number, u.role, u.bio, u.resume, u.profile_pic, u.subscription, ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills
        FROM users u
        LEFT JOIN user_skills us ON u.user_id = us.user_id
        LEFT JOIN skills s ON us.skill_id = s.skill_id
        WHERE u.email = ${email}
        GROUP BY u.user_id;
    `;
    if (user.length === 0) {
        throw new ErrorHandler(404, "User not found");
    }
    const userObject = user[0];
    const isPasswordValid = await bcrypt.compare(password, userObject.password);
    if (!isPasswordValid) {
        throw new ErrorHandler(401, "Invalid password");
    }
    userObject.skills = userObject.skills || [];
    delete userObject.password;
    const token = jwt.sign({
        id: userObject.user_id,
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15d"
    })
    res.json({
        message: "Login Successfully",
        user: userObject,
        token

    });
})

export const forgotPassword = TryCatch(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ErrorHandler(400, "Please Fill all details");
    }
    const user = await sql`
        SELECT user_id, name, email FROM users WHERE email = ${email}
    `;
    if (user.length === 0) {
        return res.json({
            message: "User not found"
        })
    }

    const userObject = user[0];

    const resettoken = jwt.sign(
        {
            email: userObject.email,
            type: "reset",
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
    );

    const resetlink = `${process.env.FRONTEND_URL}/reset/${resettoken}`;
    await redisClient.set(`forgot:${email}`, resettoken, { EX: 900 });
    const message = {
        to: email,
        subject: "RESET Your Password",
        html: forgotPasswordTemplate(resetlink),
    };

    publishToTopic("send-mail", message).catch((error) => {
        console.log("Error while sending message", error);
    });

    res.json({
        message: "If the email exists we have sent a reset link"
    });
})

export const resetPassword = TryCatch(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    let decoded: any;

    try {
        decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
    } catch (error) {
        throw new ErrorHandler(400, "Invalid or expired token");
    }

    if (decoded.type !== "reset") {
        throw new ErrorHandler(400, "Invalid token type");
    }

    const email = decoded.email;
    const storedToken = await redisClient.get(`forgot:${email}`);
    if (!storedToken) {
        throw new ErrorHandler(400, "Invalid or expired token");
    }
    if (storedToken !== token) {
        throw new ErrorHandler(400, "Invalid or expired token");
    }

    const user = await sql`
        SELECT user_id FROM users WHERE email = ${email}
    `;
    if (user.length === 0) {
        throw new ErrorHandler(404, "User not found");
    }
    const userObject = user[0];
    const hashPassword = await bcrypt.hash(password, 10);
    await sql`
        UPDATE users SET password = ${hashPassword} WHERE user_id = ${userObject.user_id}
    `;

    await redisClient.del(`forgot:${email}`);
    res.json({
        message: "Password reset successfully"
    });
})
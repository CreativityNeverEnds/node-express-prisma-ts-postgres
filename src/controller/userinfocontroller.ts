import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

const prisma :any = new PrismaClient();

// POST /login endpoint to login new user
export const Login = async (req: Request, res: Response) => {
    try {
        // Extract login information from the request body
        const { user_email, user_password } = req.body;
        
        // Validate request data
        if (!user_email || !user_password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Find the user by email
        const user = await prisma.user_info.findFirst({
            where: {
                user_email:user_email
            }
        });
        
        // If user not found, return an error
        if (!user) {
            return res.status(401).json({ error: 'Invalid email.' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

        // If password is invalid, return an error
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        // If login is successful, you can generate tokens(refresh token and access token)
        const refresh_token = generateRefreshToken(user.user_email);
        const access_token = generateAccessToken(user.user_email);
        
        // Send the token back to the client
        res.json({ refresh_token, access_token });

    } catch (error) {
        // Handle errors and respond with an error message
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

// Implement your token generation logic here
function generateToken(email: string, secretKey: string, expiresIn: number) {
    // Define the payload interface
    interface Payload {
        email: string;
        iat: number; // Issued at
        exp: number; // Expiration time
    }

    // Create the payload
    const payload: Payload = {
        email: email,
        iat: Math.floor(Date.now() / 1000), // Issued at
        exp: Math.floor(Date.now() / 1000) + expiresIn // Expires within a specified time
    };

    // Return the token
    return jwt.sign(payload, secretKey, { algorithm: 'HS256' });
}

// Implement your refresh token generation logic here
function generateRefreshToken(email: string){
    const secret_refreshKey: any = process.env.SECRET_Refresh_KEY; // Replace with your actual secret refresh key
    if (!secret_refreshKey) throw new Error('SECRET_REFRESH_KEY is not defined');
    return generateToken(email, secret_refreshKey, 60 * 60); // Expires in 1 hour
}

// Implement your access token generation logic here
function generateAccessToken(email: string){
    const secret_accessKey: any = process.env.SECRET_Access_KEY; // Replace with your actual secret access key
    if (!secret_accessKey) throw new Error('SECRET_ACCESS_KEY is not defined');
    return generateToken(email, secret_accessKey, 60 * 1); // Expires in 1 minute
}

// POST /register endpoint to register new user

export const Register = async (req: Request, res: Response) => {
    try {
        // Extract user's information from the request body
        const { user_first_name, user_last_name, user_password, user_email} = req.body;
        
        // Validate request data
        if (!user_first_name || !user_last_name || !user_password || !user_email) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // Create a new User in the database
        const newUser = await prisma.user_info.create({
            data: {
                user_email,
                user_password:hashedPassword,
                user_first_name,
                user_last_name,
            },
        });

        // Respond with the created riskparameters and a 201 status code
        res.status(201).json(newUser);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}

// Put /user_info/change_password endpoint to change password

export const changePassword = async (req: Request, res: Response) => {
    try {
        // Extract user's information from the request body
        const { user_email, new_password } = req.body;
        
        // Validate request data
        if (!user_email ||!new_password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update the user's password in the database
        const updatedUser = await prisma.user_info.update({
            where: {user_email:user_email},
            data: {
                user_password: hashedPassword
            }
        });

        // Respond with the updated userinfo and a 201 status code
        res.status(201).json(updatedUser);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}

// POST /user_info/token_verify to generate new access token

export const tokenVerify = async (req: Request, res: Response) => {
    try {
        const { refresh_token } = req.body;
        
        // Verify the refresh token
        const payload = jwt.verify(refresh_token, process.env.SECRET_REFRESH_KEY!);
        
        if (!payload) {
            return res.status(401).json({ error: 'Invalid refresh token.' });
        }
        
        // Generate a new access token
        const access_token = generateAccessToken((payload as JwtPayload).email);
        
        // Send the token back to the client
        res.json({ access_token });
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}

// GET /user_info/get endpoint to read all UserInfos

export const getAllUserInfos = async (req: Request, res: Response) => {
    try {
        // Fetch all UserInfos from the database
        const UserInfos = await prisma.user_info.findMany();
        // Respond with all riskparameters and a 201 status code
        res.status(201).json(UserInfos);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}

// POST /user_info/get_my_info endpoint to read my UserInfo

export const getMyUserInfo = async (req: Request, res: Response) => {
    try {
        const { access_token } = req.body;

        // Verify the access token
        const payload = jwt.verify(access_token, process.env.SECRET_Access_KEY!);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid access token.' });
        }
        
        // Fetch the user's UserInfo from the database
        const UserInfo = await prisma.user_info.findFirst({
            where: {user_email: (payload as JwtPayload).email}
        });
        
        // Respond with the user's UserInfo and a 201 status code
        res.status(201).json(UserInfo);
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({ error: error });
    }
}
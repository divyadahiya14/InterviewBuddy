import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "InterviewBuddySuperSecretKeyThatIsSecureAndLongEnoughToAvoidAnyHMACErrors";
const ISSUER = "InterviewBuddySecurity";
const EXPIRATION_TIME = "24h";

export const generateToken = (email, role, name) => {
  return jwt.sign(
    {
      email,
      role: role ? role.toUpperCase() : "INTERVIEWEE",
      name: name || ""
    },
    SECRET_KEY,
    {
      issuer: ISSUER,
      expiresIn: EXPIRATION_TIME
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY, { issuer: ISSUER });
};

import dotenv from 'dotenv';

dotenv.config();

const adminEmail = process.env.ADMINEMAIL
const adminPassword = process.env.ADMINPASSWORD

export function getLastLogin() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()

    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours ? hours : 12
    const formattedHour = String(hours).padStart(2, '0')

    return `${month}/${day}/${year} ${formattedHour}:${minutes}${ampm}`
}

export const login = async (email, password) => {
  if (!email || !password)
    throw "All fields need to have valid values";

  email = email.trim().toLowerCase();

  if(email == adminEmail && password == adminPassword){
      const returnedObj = {
        companyName: "Admin",
        email: adminEmail,
        role: "super admin",
        signupDate: null,
        lastLogin: getLastLogin()
      };
    return returnedObj
  }

  password = checkPassword(password);
};

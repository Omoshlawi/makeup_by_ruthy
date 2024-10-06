import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configuration } from ".";

export function parseMessage(object: any, template: string) {
  // regular expression to match placeholders like {{field}}
  const placeholderRegex = /{{(.*?)}}/g;

  // Use a replace function to replace placeholders with corresponding values
  const parsedMessage = template.replace(
    placeholderRegex,
    (match, fieldName) => {
      // The fieldName variable contains the field name inside the placeholder
      // Check if the field exists in the event object
      if (object.hasOwnProperty(fieldName)) {
        return object[fieldName]; // Replace with the field's value
      } else {
        // Placeholder not found in event, leave it unchanged
        return match;
      }
    }
  );

  return parsedMessage;
}

export function isValidURL(url: string): boolean {
  try {
    // Attempt to create a URL object
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const generateUserToken = (payload: any) => {
  const token = jwt.sign(payload, configuration.jwt as string);
  return token;
};

export const checkPassword = async (hash: string, password: string) => {
  return await bcrypt.compare(password, hash);
};



export function normalizePhoneNumber(phoneNumber: string) {
  // Define the regex pattern to capture the phone number part
  const kenyanPhoneNumberRegex = /^(\+?254|0)?((7|1)\d{8})$/;

  // Match the phone number against the regex
  const match = phoneNumber.match(kenyanPhoneNumberRegex);

  // If there's a match, return the captured group; otherwise, return null or throw an error
  if (match) {
    return match[2]; // The second capturing group contains the desired phone number part
  } else {
    throw new Error("Invalid Kenyan phone number format");
  }
}

export const normalizeIp = (ip: string) => {
  // Normalize IPv6 localhost address
  if (ip === "::1") {
    return "127.0.0.1";
  }
  // Strip IPv6 prefix for IPv4 addresses
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
};


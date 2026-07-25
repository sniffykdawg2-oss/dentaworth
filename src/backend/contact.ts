import { ContactMessageInput, maxLengths } from "./schema";
import { buildSubmissionGuard, cleanLongText, cleanText, isValidEmail } from "./validation";

export function buildContactMessageInput(
  formData: FormData,
  topic: ContactMessageInput["topic"] = "general",
): ContactMessageInput {
  const name = cleanText(formData.get("name"), maxLengths.name);
  const email = cleanText(formData.get("email"), maxLengths.email).toLowerCase();
  const message = cleanLongText(formData.get("message"), maxLengths.message);

  if (!name) {
    throw new Error("Enter your name.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (message.length < 10) {
    throw new Error("Enter a message with at least 10 characters.");
  }

  return { name, email, message, topic, submissionGuard: buildSubmissionGuard(formData) };
}

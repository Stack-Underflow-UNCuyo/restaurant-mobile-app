import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aromas de viña",
  description: "SignUp Page Aromas de viña",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}

import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aromas de vino",
  description: "SignUp Page Aromas de vino",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}

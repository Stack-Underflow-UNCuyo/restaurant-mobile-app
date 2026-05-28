import SignInForm from "@/components/auth/SignInForm";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Iniciar sesión — ${APP_NAME}`,
  description: `Accedé al panel de administración de ${APP_NAME}`,
};

export default function SignIn() {
  return <SignInForm />;
}

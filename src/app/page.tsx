import { redirect } from "next/navigation";

export default function Home() {
  redirect("/flows");
  return null;
}

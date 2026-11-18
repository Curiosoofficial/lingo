import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

import AdminApp from "./AdminApp";

const page = async () => {
  if (!(await isAdmin())) {
    redirect("/");
  }

  return <AdminApp />;
};

export default page;

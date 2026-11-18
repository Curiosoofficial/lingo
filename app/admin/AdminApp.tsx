"use client";

import dynamic from "next/dynamic";

// react-admin läuft nur im Browser. Seit Next.js 15 ist `ssr: false`
// nur noch in Client Components erlaubt, darum dieser kleine Wrapper.
const App = dynamic(() => import("./App"), { ssr: false });

const AdminApp = () => <App />;

export default AdminApp;

import Sidebar from "./Sidebar.jsx";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
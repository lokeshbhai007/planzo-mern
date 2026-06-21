import Sidebar from "./Sidebar.jsx";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 md:p-8
                       text-gray-900 dark:text-gray-100
                       transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
children,
}) {
return ( <div className="h-screen bg-slate-950 flex"> <Sidebar />


  <div className="ml-64 flex-1 flex flex-col overflow-hidden">
    <Header />

    <main className="flex-1 p-6 overflow-y-auto">
      {children}
    </main>
  </div>
</div>

);
}

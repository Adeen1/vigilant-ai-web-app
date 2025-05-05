"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { withAuth } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const router = useRouter();
  const { user } = useAuth();
  const fetchData = async () => {
    try {
      // Fetch subscriptions
      const subRes = await fetch("/api/subscriptions");
      if (!subRes.ok) throw new Error("Failed to fetch subscriptions");
      console.log("Subscription response:", subRes);
      const subData = await subRes.json();
      setSubscriptions(subData.activities || []);

      // If no subscriptions, redirect to setup
      if (!subData.activities || subData.activities.length === 0) {
        router.push("/setup/activities");
        return;
      }

      // Fetch employees
      const empRes = await fetch("/api/employees");
      if (!empRes.ok) throw new Error("Failed to fetch employees");

      const empData = await empRes.json();
      setEmployees(empData.employees || []);

      setLoading(false);

      // If this is the first time loading the dashboard, start the tour
      const firstVisit = localStorage.getItem("dashboardVisited") !== "true";
      if (firstVisit) {
        startTour();
        localStorage.setItem("dashboardVisited", "true");
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#dashboard-header",
          popover: {
            title: "Welcome to Your Dashboard",
            description:
              "This is your central hub for monitoring workplace activities.",
          },
        },
        {
          element: "#subscriptions-section",
          popover: {
            title: "Your Subscribed Activities",
            description:
              "These are the workplace activities you are currently monitoring.",
          },
        },
        {
          element: "#employees-section",
          popover: {
            title: "Employee Management",
            description:
              "Add and manage employees that will be monitored by the system.",
          },
        },
        {
          element: "#add-employee-button",
          popover: {
            title: "Add New Employees",
            description:
              "Click here to add new employees to the monitoring system.",
          },
        },
      ],
    });

    driverObj.drive();
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
    setShowEmployeeForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-xl text-primary">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">InsightGuardian</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-sm text-gray-500">
                {user?.email || "admin@example.com"}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-primary"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div id="dashboard-header" className="mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Manage your workplace monitoring system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section id="subscriptions-section" className="dashboard-section">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">
                  Subscribed Activities
                </h2>
                <button
                  onClick={() => router.push("/setup/activities")}
                  className="btn-secondary text-sm"
                >
                  Manage Subscriptions
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.length > 0 ? (
                  subscriptions.map((subId) => {
                    const activity = activityOptions.find(
                      (a) => a.id === subId
                    );
                    return (
                      <div
                        key={subId}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                      >
                        <h3 className="font-medium mb-1">
                          {activity?.title || subId}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {activity?.description ||
                            "Activity monitoring enabled"}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-500">
                      No activities subscribed yet.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section id="employees-section" className="dashboard-section">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">
                  Employees
                </h2>
                <button
                  id="add-employee-button"
                  onClick={() => setShowEmployeeForm(true)}
                  className="btn-primary text-sm"
                >
                  Add Employee
                </button>
              </div>

              <EmployeeList employees={employees} />
            </section>
          </div>

          <div className="lg:col-span-1">
            <section className="dashboard-section bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-primary mb-4">
                System Status
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">System Online</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Update</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monitoring Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Running
                  </span>
                </div>
              </div>
            </section>

            <section className="dashboard-section bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-primary mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  No recent activities to display.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Employee Form Modal */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary">
                Add New Employee
              </h2>
              <button
                onClick={() => setShowEmployeeForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <EmployeeForm
              onSuccess={handleAddEmployee}
              onCancel={() => setShowEmployeeForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const activityOptions = [
  {
    id: "mobile",
    title: "Mobile Phone Usage Detection",
    description:
      "Identify unauthorized mobile phone usage in restricted areas.",
  },
  {
    id: "presence",
    title: "Presence Detection",
    description: "Monitor workspace occupancy and attendance automatically.",
  },
  {
    id: "sleepiness",
    title: "Sleepiness Detection",
    description: "Ensure alertness in critical safety environments.",
  },
  {
    id: "smoking",
    title: "Smoking Detection",
    description: "Enforce no-smoking policies in designated areas.",
  },
  {
    id: "weapons",
    title: "Weapons Detection",
    description: "Enhanced security with immediate threat alerts.",
  },
  {
    id: "eating",
    title: "Eating Detection",
    description: "Ensure compliance with food safety regulations.",
  },
  {
    id: "loitering",
    title: "Loitering Detection",
    description: "Identify unusual lingering in secure areas.",
  },
  {
    id: "altercations",
    title: "Physical Altercations Detection",
    description: "Improve workplace safety with conflict alerts.",
  },
];

export default withAuth(Dashboard);

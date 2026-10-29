import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Compass,
  Users,
  FolderKanban,
  Send,
  FileText,
  BriefcaseBusiness,
  ArrowLeftRight,
  Plus,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  Settings,
  ArrowUpRight,
  CalendarDays,
  Shield,
  Activity,
  Check,
  LogOut,
} from "lucide-react";
import { loadData, saveData } from "./services/store";
import { Avatar, Empty, Modal } from "./components/UI";
import Forms from "./components/Forms";
import Dashboard from "./pages/Dashboard";
import StudentPosts from "./pages/StudentPosts";
import Recruitment from "./pages/Recruitment";
import SkillGaps from "./pages/SkillGaps";
import { Explore, ProjectDetail, Teammates, Person } from "./pages/Discovery";
import {
  Posts,
  Applications,
  Teams,
  Portfolio,
  Profile,
  SkillExchange,
} from "./pages/Workspace";
import { Faculty, Admin, Landing, Workshops } from "./pages/Management";
const studentNav = [
  ["/", LayoutDashboard, "Overview"],
  ["/student-posts", FileText, "Student Posts"],
  ["/projects", Compass, "Explore Projects"],
  ["/recruitment", Users, "Project Recruitment"],
  ["/teammates", Users, "Find Teammates"],
  ["/teams", FolderKanban, "My Teams"],
  ["/applications", Send, "Applications"],
  ["/posts", FileText, "My Posts"],
  ["/portfolio", BriefcaseBusiness, "My Portfolio"],
  ["/skills", ArrowLeftRight, "Skill Exchange"],
];
export default function App() {
  const [data, setData] = useState(loadData);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [role, setRole] = useState("student");
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const location = useLocation(),
    navigate = useNavigate();
  useEffect(() => {
    if (!saveData(data))
      setToast("Browser storage is full. Changes may not persist.");
  }, [data]);
  useEffect(() => {
    setMobile(false);
    setNotifications(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (toast) {
      let t = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    if (!location.hash) return;
    const timer = setTimeout(
      () =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ block: "start" }),
      80,
    );
    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);
  const update = (key, value) =>
    setData((d) => ({
      ...d,
      [key]: typeof value === "function" ? value(d[key]) : value,
    }));
  const open = (type, item) => setModal({ type, item });
  const notify = setToast;
  const props = { data, update, open, notify, role };
  const nav =
    role === "student"
      ? studentNav
      : role === "faculty"
        ? [
            ["/faculty", LayoutDashboard, "Project Requirements"],
            ["/faculty/applicants", Send, "Review Applicants"],
            ["/faculty/skill-gaps", Activity, "Skill Gaps"],
            ["/teams", Users, "Project Teams"],
            ["/workshops", CalendarDays, "Workshops"],
          ]
        : [
            ["/admin", Users, "Users & Roles"],
            ["/admin/projects", FolderKanban, "Project Records"],
            ["/admin/reports", Shield, "Reports & Activity"],
          ];
  const activeTitle =
    nav.find(([path]) => path === location.pathname)?.[2] ||
    (location.pathname.startsWith("/projects/")
      ? "Project Details"
      : location.pathname === "/profile"
        ? "My Profile"
        : "Workspace");
  return (
    <>
      {location.pathname === "/welcome" ? (
        <Landing />
      ) : (
        <div className="app-shell">
          {mobile && (
            <div className="sidebar-overlay" onClick={() => setMobile(false)} />
          )}
          <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
            <Link className="brand" to="/">
              <span className="brand-mark">
                <GraduationCap size={24} />
              </span>
              <span>
                college<span className="brand-light">connect</span>
                <small>CAMPUS COLLABORATION</small>
              </span>
            </Link>
            <div className="campus-switch">
              <span className="campus-icon">
                <GraduationCap size={17} />
              </span>
              <div>
                <strong>Campus workspace</strong>
                <span>Student community</span>
              </div>
              <ChevronDown size={14} />
            </div>
            <div className="nav-label">WORKSPACE</div>
            <nav className="main-nav">
              {nav.map(([path, Icon, label]) => (
                <NavLink key={path} to={path} end>
                  <Icon size={19} />
                  <span>{label}</span>
                  {path === "/applications" &&
                    data.invitations.some((x) => x.status === "Pending") && (
                      <span className="nav-count">
                        {
                          data.invitations.filter((x) => x.status === "Pending")
                            .length
                        }
                      </span>
                    )}
                </NavLink>
              ))}
            </nav>
            <button className="sidebar-create" onClick={() => open("post")}>
              <Plus size={17} />
              Create Post
            </button>
            <div className="sidebar-bottom">
              <div className="prototype-label">
                <span />
                LOCAL PROTOTYPE
              </div>
              <label className="role-switch">
                Preview as
                <select
                  aria-label="Preview role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    navigate(
                      e.target.value === "student" ? "/" : "/" + e.target.value,
                    );
                  }}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Administrator</option>
                </select>
              </label>
              <Link className="sidebar-profile" to="/profile">
                <Avatar
                  name={data.profile.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")}
                  color="sage"
                />
                <div>
                  <strong>{data.profile.name}</strong>
                  <span>
                    {data.profile.course} · {data.profile.year}
                  </span>
                </div>
                <Settings size={16} />
              </Link>
            </div>
          </aside>
          <div className="app-body">
            <header className="topbar">
              <button
                className="icon-button mobile-menu"
                aria-label="Open navigation"
                onClick={() => setMobile(true)}
              >
                <Menu size={22} />
              </button>
              <div className="breadcrumb">
                Workspace <span>/</span>
                <strong>{activeTitle}</strong>
              </div>
              <div className="topbar-right">
                <span className="semester">Fall semester 2026</span>
                <span className="topbar-divider" />
                <div className="notification-wrap">
                  <button
                    className="icon-button notification-button"
                    aria-label="Notifications"
                    aria-expanded={notifications}
                    onClick={() => setNotifications(!notifications)}
                  >
                    <Bell size={19} />
                    {data.notifications.some((x) => !x.read) && <i />}
                  </button>
                  {notifications && (
                    <div className="notification-popover">
                      <div className="section-heading">
                        <h3>Notifications</h3>
                        <button
                          className="text-link"
                          onClick={() =>
                            update(
                              "notifications",
                              data.notifications.map((x) => ({
                                ...x,
                                read: true,
                              })),
                            )
                          }
                        >
                          Mark all read
                        </button>
                      </div>
                      {data.notifications.map((n) => (
                        <button
                          className={`notification-entry ${n.read ? "read" : ""}`}
                          key={n.id}
                          onClick={() => {
                            update(
                              "notifications",
                              data.notifications.map((x) =>
                                x.id === n.id ? { ...x, read: true } : x,
                              ),
                            );
                            navigate(
                              n.path ||
                                (n.text.includes("Open Library")
                                  ? "/teams"
                                  : "/applications?tab=invitations"),
                            );
                          }}
                        >
                          {!n.read && <i />}
                          {n.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/profile" aria-label="My profile">
                  <Avatar
                    name={data.profile.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                    small
                  />
                </Link>
              </div>
            </header>
            <main key={location.pathname}>
              <Routes>
                <Route path="/" element={<Dashboard {...props} />} />
                <Route path="/dashboard" element={<Dashboard {...props} />} />
                <Route path="/projects" element={<Explore {...props} />} />
                <Route
                  path="/projects/:id"
                  element={<ProjectDetail {...props} />}
                />
                <Route path="/teammates" element={<Teammates {...props} />} />
                <Route path="/people/:id" element={<Person {...props} />} />
                <Route path="/profile" element={<Profile {...props} />} />
                <Route path="/posts" element={<Posts {...props} />} />
                <Route
                  path="/student-posts"
                  element={<StudentPosts {...props} />}
                />
                <Route
                  path="/recruitment"
                  element={<Recruitment {...props} />}
                />
                <Route
                  path="/applications"
                  element={<Applications {...props} />}
                />
                <Route path="/teams" element={<Teams {...props} />} />
                <Route path="/portfolio" element={<Portfolio {...props} />} />
                <Route path="/skills" element={<SkillExchange {...props} />} />
                <Route path="/workshops" element={<Workshops {...props} />} />
                <Route path="/faculty" element={<Faculty {...props} />} />
                <Route
                  path="/faculty/skill-gaps"
                  element={<SkillGaps {...props} />}
                />
                <Route
                  path="/faculty/applicants"
                  element={<Faculty {...props} view="applicants" />}
                />
                <Route path="/admin" element={<Admin {...props} />} />
                <Route
                  path="/admin/projects"
                  element={<Admin {...props} view="projects" />}
                />
                <Route
                  path="/admin/reports"
                  element={<Admin {...props} view="reports" />}
                />
                <Route
                  path="*"
                  element={
                    <Empty title="Page not found">
                      <Link to="/">Back to overview</Link>
                    </Empty>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      )}
      {modal && (
        <Forms
          key={modal.type + (modal.item?.id || "")}
          modal={modal}
          close={() => setModal(null)}
          {...props}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}

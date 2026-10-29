import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Check, ArrowRight, GraduationCap } from "lucide-react";
import { projects, people } from "../data/mock";
import { Heading, ProjectCard, Empty } from "../components/UI";
export function Workshops({ data, open, role, notify }) {
  const [registered, setRegistered] = useState(() =>
    JSON.parse(localStorage.getItem("cc-workshops") || "[]"),
  );
  return (
    <>
      <Heading title="Workshops">
        {role !== "student" && (
          <button className="primary" onClick={() => open("workshop")}>
            <Plus size={16} />
            Publish workshop
          </button>
        )}
      </Heading>
      {data.workshops.map((w) => (
        <section className="panel application-card" key={w.id}>
          <div>
            <span className="eyebrow">{w.date}</span>
            <h2>{w.title}</h2>
            <p>
              {w.host} · {w.skills}
            </p>
          </div>
          <button
            className={registered.includes(w.id) ? "secondary" : "primary"}
            onClick={() => {
              const next = registered.includes(w.id)
                ? registered.filter((x) => x !== w.id)
                : [...registered, w.id];
              setRegistered(next);
              localStorage.setItem("cc-workshops", JSON.stringify(next));
              notify(
                next.includes(w.id)
                  ? "Registration saved locally"
                  : "Registration cancelled",
              );
            }}
          >
            {registered.includes(w.id) ? "Cancel registration" : "Register"}
          </button>
        </section>
      ))}
    </>
  );
}
export function Faculty({ data, open, update, notify, view }) {
  const [decisions, setDecisions] = useState(() =>
    JSON.parse(localStorage.getItem("cc-decisions") || "{}"),
  );
  function decision(id, status) {
    const next = { ...decisions, [id]: status };
    setDecisions(next);
    localStorage.setItem("cc-decisions", JSON.stringify(next));
    notify(`Applicant ${status.toLowerCase()}`);
  }
  return (
    <>
      <Heading
        title={
          view === "applicants" ? "Review Applicants" : "Project Requirements"
        }
      >
        <button className="primary" onClick={() => open("requirement")}>
          <Plus size={16} />
          Post a Project Requirement
        </button>
      </Heading>
      <Link className="faculty-gap-link" to="/faculty/skill-gaps">
        <div>
          <strong>Skill Gaps</strong>
          <span>Compare project demand with students listing each skill.</span>
        </div>
        <span>
          View demand & supply <ArrowRight size={16} />
        </span>
      </Link>
      {view === "applicants" ? (
        <div className="panel">
          <h2>Campus energy monitor</h2>
          {people.slice(0, 3).map((p) => (
            <div className="list-row" key={p.id}>
              <div>
                <strong>{p.name}</strong>
                <p>
                  {p.role} · {p.skills.join(", ")}
                </p>
              </div>
              {decisions[p.id] ? (
                <span className="state">{decisions[p.id]}</span>
              ) : (
                <div className="button-row">
                  <button
                    className="secondary"
                    onClick={() => decision(p.id, "Declined")}
                  >
                    Decline
                  </button>
                  <button
                    className="primary"
                    onClick={() => decision(p.id, "Accepted")}
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="explore-grid">
          {[projects[0], ...data.requirements].map((p) => (
            <div key={p.id}>
              <ProjectCard project={p} />
              <div className="manage-row">
                <Link className="text-link" to="/faculty/applicants">
                  Review applicants <ArrowRight size={15} />
                </Link>
                {data.requirements.some((x) => x.id === p.id) && (
                  <button
                    className="text-link"
                    onClick={() => {
                      update(
                        "requirements",
                        data.requirements.map((x) =>
                          x.id === p.id
                            ? {
                                ...x,
                                status:
                                  x.status === "Recruiting"
                                    ? "In progress"
                                    : "Recruiting",
                              }
                            : x,
                        ),
                      );
                      notify("Recruitment status updated");
                    }}
                  >
                    {p.status === "Recruiting"
                      ? "Close recruitment"
                      : "Reopen recruitment"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
export function Admin({ data, update, notify, view }) {
  const [q, setQ] = useState("");
  const [roles, setRoles] = useState(() =>
    JSON.parse(localStorage.getItem("cc-user-roles") || "{}"),
  );
  return (
    <>
      <Heading
        title={
          view === "reports"
            ? "Reports & Activity"
            : view === "projects"
              ? "Project Records"
              : "User Management"
        }
      />
      {view === "reports" ? (
        <>
          <div className="panel">
            <h2>Reports</h2>
            {data.reports.map((r) => (
              <div className="list-row" key={r.id}>
                <div>
                  <strong>{r.title}</strong>
                  <p>{r.content}</p>
                </div>
                <span className="state">{r.status}</span>
                {r.status === "Open" && (
                  <button
                    className="secondary"
                    onClick={() => {
                      update(
                        "reports",
                        data.reports.map((x) =>
                          x.id === r.id ? { ...x, status: "Resolved" } : x,
                        ),
                      );
                      notify("Report resolved");
                    }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="panel">
            <h2>Recent platform activity</h2>
            {data.notifications.map((n) => (
              <p key={n.id}>{n.text}</p>
            ))}
          </div>
        </>
      ) : view === "projects" ? (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {[...projects, ...data.requirements].map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/projects/${p.id}`}>{p.title}</Link>
                  </td>
                  <td>{p.owner}</td>
                  <td>{p.status}</td>
                  <td>
                    {p.members}/{p.size}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="filter-panel">
            <input
              aria-label="Search users"
              placeholder="Search users"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="panel table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Academic information</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {people
                  .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.course}</td>
                      <td>
                        <select
                          aria-label={`Role for ${p.name}`}
                          value={roles[p.id] || "Student"}
                          onChange={(e) => {
                            const next = { ...roles, [p.id]: e.target.value };
                            setRoles(next);
                            localStorage.setItem(
                              "cc-user-roles",
                              JSON.stringify(next),
                            );
                            notify("User role updated locally");
                          }}
                        >
                          <option>Student</option>
                          <option>Faculty</option>
                          <option>Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
export function Landing() {
  return (
    <div className="landing">
      <nav>
        <Link to="/" className="brand">
          <span className="brand-mark">
            <GraduationCap />
          </span>
          college<span>connect</span>
        </Link>
        <div>
          <Link to="/projects">Explore Projects</Link>
          <Link className="primary" to="/">
            Enter workspace <ArrowRight size={16} />
          </Link>
        </div>
      </nav>
      <section className="landing-hero">
        <span className="eyebrow">YOUR CAMPUS. YOUR COLLABORATORS.</span>
        <h1>
          Good projects start
          <br />
          with the right people.
        </h1>
        <p>Find academic projects, build a team, and share what you make.</p>
        <div className="button-row">
          <Link className="primary" to="/profile">
            Get started <ArrowRight size={16} />
          </Link>
          <Link className="secondary" to="/projects">
            Explore Projects
          </Link>
        </div>
      </section>
      <div className="section-heading">
        <h2>Open on campus</h2>
        <Link to="/projects">
          All projects <ArrowRight size={16} />
        </Link>
      </div>
      <div className="explore-grid">
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      <div className="landing-steps">
        {[
          [
            "01",
            "Find your project",
            "Explore opportunities by skill, topic, or interest.",
          ],
          [
            "02",
            "Build your team",
            "Apply for a role or invite complementary teammates.",
          ],
          [
            "03",
            "Share your work",
            "Keep a record of what you built and contributed.",
          ],
        ].map(([n, t, d]) => (
          <div key={n}>
            <span>{n}</span>
            <h2>{t}</h2>
            <p>{d}</p>
          </div>
        ))}
      </div>
      <section className="panel">
        <span className="eyebrow">STUDENT SHOWCASE</span>
        <h2>A more accessible campus map</h2>
        <p>A keyboard-friendly campus map built with React and CSS.</p>
        <Link className="text-link" to="/portfolio">
          Explore student work <ArrowRight size={16} />
        </Link>
      </section>
      <footer className="page-footer">
        College Connect <span>Frontend prototype · No sign-up required</span>
      </footer>
    </div>
  );
}

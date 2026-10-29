import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, ArrowRight, Send, ArrowUpRight } from "lucide-react";
import { Heading, Tags, Empty, Avatar } from "../components/UI";
import { people } from "../data/mock";
export default function Recruitment({ data, open, update, notify }) {
  const [tab, setTab] = useState("My Requirements");
  return (
    <>
      <Heading title="Project Recruitment">
        <button className="primary" onClick={() => open("requirement")}>
          <Plus size={16} />
          Post a Project Requirement
        </button>
      </Heading>
      <div className="recruitment-intro">
        <Users size={22} />
        <strong>Recruit for your project</strong>
        <span>
          Define roles and skills. Review members and send invitations.
        </span>
        <Link to="/student-posts">
          Sharing your work instead? Student Posts <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="tabs">
        {["My Requirements", "Sent Invitations"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
            <span className="count">
              {t === "My Requirements"
                ? data.requirements.length
                : (data.sentInvitations || []).length}
            </span>
          </button>
        ))}
      </div>
      {tab === "My Requirements" ? (
        data.requirements.length ? (
          data.requirements.map((p) => (
            <article className="panel recruitment-card" key={p.id}>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{p.category}</span>
                  <h2>
                    <Link to={`/projects/${p.id}`}>{p.title}</Link>
                  </h2>
                </div>
                <span className="state">{p.status}</span>
              </div>
              <p>{p.summary}</p>
              <Tags items={p.skills} />
              <div className="recruitment-roles">
                <strong>Open roles</strong>
                {p.roles.join(" · ")}
                <span>
                  {p.members}/{p.size} members · {p.availability}
                </span>
              </div>
              <div className="recruitment-actions">
                <Link
                  className="primary"
                  to={`/projects/${p.id}#recommended-members`}
                >
                  <Users size={16} />
                  View Recommended Members
                </Link>
                <Link className="secondary" to={`/projects/${p.id}`}>
                  View requirement
                </Link>
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
                    notify(
                      p.status === "Recruiting"
                        ? "Recruitment closed"
                        : "Recruitment reopened",
                    );
                  }}
                >
                  {p.status === "Recruiting"
                    ? "Close recruitment"
                    : "Reopen recruitment"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <Empty title="No project requirements yet">
            <p>Recruitment is separate from personal posts.</p>
            <button className="primary" onClick={() => open("requirement")}>
              <Plus size={16} />
              Post a Project Requirement
            </button>
          </Empty>
        )
      ) : (data.sentInvitations || []).length ? (
        (data.sentInvitations || []).map((i) => {
          const person = people.find((p) => p.id === i.personId);
          return (
            <article className="panel application-card" key={i.id}>
              <Avatar name={person?.initials || "?"} color={person?.color} />
              <div>
                <h2>{person?.name || "Student"}</h2>
                <p>
                  {i.projectTitle} · {i.role}
                </p>
                <p>{i.message}</p>
              </div>
              <span className="state">
                {i.status === "Sent" ? "Saved locally" : i.status}
              </span>
              {i.status === "Sent" && (
                <button
                  className="secondary"
                  onClick={() => {
                    update(
                      "sentInvitations",
                      data.sentInvitations.map((x) =>
                        x.id === i.id ? { ...x, status: "Withdrawn" } : x,
                      ),
                    );
                    notify("Invitation withdrawn");
                  }}
                >
                  Withdraw
                </button>
              )}
            </article>
          );
        })
      ) : (
        <Empty title="No sent invitations">
          <Link className="text-link" to="/teammates">
            Find Teammates <ArrowRight size={15} />
          </Link>
        </Empty>
      )}
      <p className="evidence-notice">
        Prototype: invitations are saved in this browser, not delivered to other
        students.
      </p>
    </>
  );
}

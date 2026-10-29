import React from "react";
import { Link } from "react-router-dom";
import { Users, Clock, ArrowUpRight, Check, FileText } from "lucide-react";
import { people } from "../data/mock";
import { getMemberSuggestions } from "../services/recommendations";
import { communityPosts } from "../data/community";
import { Avatar, Tags } from "./UI";
export default function RecommendedMembers({ project, data, open }) {
  const { kind, members: suggestions } = getMemberSuggestions(project);
  const owned = data.requirements.some((p) => p.id === project.id);
  return (
    <section className="panel recommended-members" id="recommended-members">
      <div className="section-heading">
        <h2>
          <Users size={19} />
          Recommended Members
        </h2>
        <span className="state">Curated preview</span>
      </div>
      <p className="evidence-notice">
        {kind === "category"
          ? "Category-based example shortlist—not matched to your custom requirements. Review skills and open roles before inviting."
          : "Mock suggestions with visible evidence—not live AI matching. Availability is self-reported."}
      </p>
      {!suggestions.length ? (
        <div className="empty-activity">
          <h3>No recommendations for this new requirement yet</h3>
          <p>
            Your roles and skills are saved. Browse students and invite them
            while recommendation services are not connected.
          </p>
          <Link className="secondary" to="/teammates">
            Find Teammates <ArrowUpRight size={15} />
          </Link>
        </div>
      ) : (
        suggestions.map((s) => {
          const person = people.find((p) => p.id === s.personId);
          const evidence = communityPosts.find((p) => p.id === s.evidenceId);
          const invited = (data.sentInvitations || []).some(
            (i) =>
              i.personId === person.id &&
              i.projectId === project.id &&
              i.status === "Sent",
          );
          return (
            <article className="member-recommendation" key={person.id}>
              <div className="recommended-person">
                <Avatar name={person.initials} color={person.color} />
                <div>
                  <Link
                    to={`/people/${person.id}`}
                    className="recommended-name"
                  >
                    {person.name}
                    <ArrowUpRight size={14} />
                  </Link>
                  <p>{person.course}</p>
                </div>
              </div>
              <div className="suggested-role">
                <span>
                  {kind === "category"
                    ? "Preferred role"
                    : "Suggested contribution"}
                </span>
                <strong>{s.role}</strong>
              </div>
              <Tags items={person.skills} />
              <div className="recommend-reasons">
                <h3>Why this student</h3>
                {s.reasons.map((r) => (
                  <p key={r}>
                    <Check size={14} />
                    {r}
                  </p>
                ))}
              </div>
              {evidence && (
                <Link
                  className="evidence-link"
                  to={`/student-posts#post-${evidence.id}`}
                >
                  <FileIcon />
                  <div>
                    <span>Relevant post</span>
                    <strong>{evidence.title}</strong>
                  </div>
                  <ArrowUpRight size={15} />
                </Link>
              )}
              <div className="recommend-footer">
                <span>
                  <Clock size={14} />
                  {person.availability}
                </span>
                <Link className="text-link" to={`/people/${person.id}`}>
                  View profile
                </Link>
                <button
                  className="secondary"
                  disabled={invited || project.status !== "Recruiting"}
                  onClick={() =>
                    open("invite", {
                      ...person,
                      project: owned ? project : null,
                      role: s.role,
                    })
                  }
                >
                  {invited
                    ? "Invitation saved"
                    : owned
                      ? "Invite to this project"
                      : "Invite to my project"}
                </button>
              </div>
            </article>
          );
        })
      )}
    </section>
  );
}
function FileIcon() {
  return <FileText size={17} />;
}

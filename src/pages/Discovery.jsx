import React, { useState } from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Plus,
  Check,
  Clock,
  Users,
  ArrowUpRight,
} from "lucide-react";
import RecommendedMembers from "../components/RecommendedMembers";
import ActivityProfile from "../components/ActivityProfile";
import { communityPosts } from "../data/community";
import { projects, people } from "../data/mock";
import { Heading, ProjectCard, Avatar, Tags, Empty } from "../components/UI";
export function Explore({ data, open }) {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [skill, setSkill] = useState("");
  const [size, setSize] = useState("Any team size");
  const [sort, setSort] = useState("Recommended");
  let all = [...projects, ...data.requirements];
  let result = all.filter(
    (p) =>
      (p.title + " " + p.summary + " " + p.skills.join(" "))
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (category === "All categories" || p.category === category) &&
      (status === "All statuses" || p.status === status) &&
      (!skill ||
        p.skills.join(" ").toLowerCase().includes(skill.toLowerCase())) &&
      (size === "Any team size" ||
        (size === "Small teams (2–4)" ? p.size <= 4 : p.size > 4)),
  );
  if (sort === "Title A–Z")
    result.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "Most open seats")
    result.sort((a, b) => b.size - b.members - (a.size - a.members));
  return (
    <>
      <Heading title="Explore Projects">
        <button className="primary" onClick={() => open("requirement")}>
          <Plus size={16} />
          Post a Project Requirement
        </button>
      </Heading>
      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search projects"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, topic, or skill"
          />
        </div>
        <div className="filter-row">
          <select
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All categories", ...new Set(all.map((p) => p.category))].map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
          <input
            aria-label="Filter skills"
            placeholder="Skill, e.g. React"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <select
            aria-label="Team size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {["Any team size", "Small teams (2–4)", "Larger teams (5+)"].map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All statuses", "Recruiting", "In progress"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <button
            className="text-link"
            onClick={() => {
              setQ("");
              setCategory("All categories");
              setSkill("");
              setStatus("All statuses");
              setSize("Any team size");
            }}
          >
            Reset filters
          </button>
        </div>
      </div>
      <div className="results-line">
        <span>{result.length} projects</span>
        <select
          aria-label="Sort projects"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {["Recommended", "Title A–Z", "Most open seats"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      {result.length ? (
        <div className="explore-grid">
          {result.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <Empty title="No matching projects">
          Try a different search or reset your filters.
        </Empty>
      )}
    </>
  );
}
export function ProjectDetail({ data, open }) {
  const { id } = useParams();
  const p = [...projects, ...data.requirements].find(
    (x) => String(x.id) === id,
  );
  if (!p)
    return (
      <Empty title="Project not found">
        <Link to="/projects">Explore projects</Link>
      </Empty>
    );
  const applied = data.applications.some(
    (x) => x.projectId === p.id && x.status !== "Withdrawn",
  );
  return (
    <>
      <Link className="back-link" to="/projects">
        <ArrowLeft size={16} />
        Explore Projects
      </Link>
      <Heading title={p.title}>
        <span className="status">
          <i />
          {p.status}
        </span>
      </Heading>
      <div className="detail-grid">
        <section className="panel detail-main">
          <span className="eyebrow">{p.category}</span>
          <h2>Project objective</h2>
          <p>{p.summary}</p>
          <h2>What we'll build</h2>
          <p>
            A working prototype, tested with students and documented so the next
            team can keep building. We work in weekly milestones, share
            progress, and learn from one another.
          </p>
          <h2>Skills & technologies</h2>
          <Tags items={p.skills} />
          <h2>Open roles</h2>
          {p.roles.map((r) => (
            <div className="list-row" key={r}>
              <strong>{r}</strong>
              <span>1 opening</span>
            </div>
          ))}
          <h2>Current members</h2>
          <div className="member-list">
            <Avatar name={p.initials} />
            <div>
              <strong>{p.owner}</strong>
              <p>Project owner</p>
            </div>
            <Avatar name="AM" />
            <span>Student collaborators</span>
          </div>
        </section>
        <aside>
          <section className="panel">
            <h2>
              {data.requirements.some((x) => x.id === p.id)
                ? "Your recruitment"
                : "Join the team"}
            </h2>
            <a className="recommend-jump" href="#recommended-members">
              <Users size={16} />
              Recommended Members <ArrowUpRight size={15} />
            </a>
            <div className="fact">
              <Users size={18} />
              {p.members} of {p.size} members
            </div>
            <div className="fact">
              <Clock size={18} />
              {p.availability}
            </div>
            <div className="fact">
              <Check size={18} />
              {p.level}
            </div>
            {p.reason && <div className="match-reason">{p.reason}</div>}
            <button
              className="primary full"
              disabled={
                applied ||
                p.status !== "Recruiting" ||
                data.requirements.some((x) => x.id === p.id)
              }
              onClick={() => open("apply", p)}
            >
              {data.requirements.some((x) => x.id === p.id)
                ? "You own this requirement"
                : applied
                  ? "Application sent"
                  : p.status !== "Recruiting"
                    ? "Team is full"
                    : "Apply to project"}
            </button>
          </section>
        </aside>
      </div>
      <RecommendedMembers project={p} data={data} open={open} />
    </>
  );
}
export function Teammates({ open }) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All roles");
  const [availability, setAvailability] = useState("Any availability");
  const result = people.filter(
    (p) =>
      (p.name + " " + p.skills.join(" ") + " " + p.interests)
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (role === "All roles" || p.role === role) &&
      (availability === "Any availability" || p.availability === availability),
  );
  return (
    <>
      <Heading title="Find Teammates" />
      <div className="filter-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search teammates"
            placeholder="Search names, skills, or interests"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="filter-row">
          <select
            aria-label="Preferred role"
            onChange={(e) => setRole(e.target.value)}
          >
            {["All roles", ...new Set(people.map((p) => p.role))].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Availability"
            onChange={(e) => setAvailability(e.target.value)}
          >
            {[
              "Any availability",
              ...new Set(people.map((p) => p.availability)),
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="results-line">{result.length} students</div>
      <div className="people-grid">
        {result.map((p) => (
          <article className="panel person-card" key={p.id}>
            <Avatar name={p.initials} color={p.color} />
            <h2>
              <Link to={`/people/${p.id}`}>{p.name}</Link>
            </h2>
            <p>{p.course}</p>
            <strong>{p.role}</strong>
            <Tags items={p.skills} />
            <p>{p.interests}</p>
            <div className="person-facts">
              <span>
                <Clock size={15} />
                {p.availability}
              </span>
              <span>{p.experience}</span>
            </div>
            <div className="button-row">
              <Link className="secondary" to={`/people/${p.id}`}>
                View profile
              </Link>
              <button className="primary" onClick={() => open("invite", p)}>
                Invite to team
              </button>
            </div>
          </article>
        ))}
      </div>
      {!result.length && <Empty title="No matching students" />}
    </>
  );
}
export function Person({ open }) {
  const { id } = useParams();
  const p = people.find((x) => String(x.id) === id);
  if (!p) return <Empty title="Student not found" />;
  return (
    <>
      <Link className="back-link" to="/teammates">
        <ArrowLeft size={16} />
        Find Teammates
      </Link>
      <div className="profile-header panel">
        <Avatar name={p.initials} color={p.color} />
        <div>
          <h1>{p.name}</h1>
          <p>{p.course}</p>
        </div>
        <button className="primary" onClick={() => open("invite", p)}>
          Invite to team
        </button>
      </div>
      <div className="detail-grid">
        <section className="panel">
          <h2>{p.role}</h2>
          <Tags items={p.skills} />
          <h2>Interests</h2>
          <p>{p.interests}</p>
          <h2>Project experience</h2>
          <p>{p.experience}</p>
          <h2>Availability</h2>
          <p>{p.availability}</p>
        </section>
        <section className="panel">
          <h2>Project interests</h2>
          <p>Open to complementary teammates and practical campus projects.</p>
          <Link to="/projects" className="text-link">
            Explore shared opportunities <ArrowUpRight size={15} />
          </Link>
        </section>
      </div>
      <ActivityProfile
        posts={communityPosts.filter((post) => post.authorId === p.id)}
      />
    </>
  );
}

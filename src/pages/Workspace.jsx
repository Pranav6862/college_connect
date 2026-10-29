import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import ActivityProfile from "../components/ActivityProfile";
import { Heading, Empty, Tags, Avatar } from "../components/UI";
export function Posts({ data, open }) {
  const [cat, setCat] = useState("All categories");
  const posts = data.posts.filter(
    (p) => cat === "All categories" || p.category === cat,
  );
  return (
    <>
      <Heading title="My Posts">
        <Link className="secondary" to="/student-posts">
          Student Posts
        </Link>
        <button className="primary" onClick={() => open("post")}>
          <Plus size={16} />
          Create Post
        </button>
      </Heading>
      <div className="post-profile-notice">
        <FileActivityIcon />
        <span>
          Published posts appear in your{" "}
          <Link to="/profile">Activity & Learning profile</Link>.
        </span>
        <Link to="/recruitment">
          Recruit teammates instead <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="tabs">
        <select
          aria-label="Post category"
          onChange={(e) => setCat(e.target.value)}
        >
          {[
            "All categories",
            ...new Set(data.posts.map((p) => p.category)),
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="feed">
        {posts.map((p) => (
          <article className="panel post" id={`post-${p.id}`} key={p.id}>
            <div className="post-meta">
              <span>{p.category}</span>
              <time>{p.date}</time>
              <div className="row-actions">
                <button
                  className="icon-button"
                  aria-label={`Edit ${p.title}`}
                  onClick={() => open("post", p)}
                >
                  <Pencil size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Delete ${p.title}`}
                  onClick={() => open("delete", p)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <Tags
              items={p.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)}
            />
            {p.url && (
              <a
                className="text-link"
                target="_blank"
                rel="noreferrer"
                href={p.url}
              >
                View work <ExternalLink size={15} />
              </a>
            )}
            {p.attachments?.length > 0 && (
              <div className="attachment-list">
                {p.attachments.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </div>
            )}
          </article>
        ))}
        {!posts.length && (
          <Empty title="No posts yet">
            <button className="primary" onClick={() => open("post")}>
              Create Post
            </button>
          </Empty>
        )}
      </div>
    </>
  );
}
export function Applications({ data, update, notify }) {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(
    params.get("tab") === "invitations" ? "Invitations" : "Applications",
  );
  return (
    <>
      <Heading title="Applications & Invitations" />
      <div className="tabs">
        {["Applications", "Invitations"].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}{" "}
            <span className="count">
              {
                data[x === "Applications" ? "applications" : "invitations"]
                  .length
              }
            </span>
          </button>
        ))}
      </div>
      {tab === "Applications"
        ? data.applications.map((a) => (
            <div className="panel application-card" key={a.id}>
              <div>
                <h2>
                  <Link to={`/projects/${a.projectId}`}>{a.title}</Link>
                </h2>
                <p>
                  {a.role} · Applied {a.date}
                </p>
              </div>
              <span
                className={`state ${a.status === "Under review" ? "amber" : ""}`}
              >
                {a.status}
              </span>
              {a.status === "Under review" && (
                <button
                  className="secondary"
                  onClick={() => {
                    update(
                      "applications",
                      data.applications.map((x) =>
                        x.id === a.id ? { ...x, status: "Withdrawn" } : x,
                      ),
                    );
                    notify("Application withdrawn");
                  }}
                >
                  Withdraw
                </button>
              )}
            </div>
          ))
        : data.invitations.map((a) => (
            <div className="panel application-card" key={a.id}>
              <div>
                <h2>{a.title}</h2>
                <p>
                  {a.from} · {a.role}
                </p>
              </div>
              <span className="state">{a.status}</span>
              {a.status === "Pending" && (
                <div className="button-row">
                  <button
                    className="secondary"
                    onClick={() => {
                      update(
                        "invitations",
                        data.invitations.map((x) =>
                          x.id === a.id ? { ...x, status: "Declined" } : x,
                        ),
                      );
                      notify("Invitation declined");
                    }}
                  >
                    Decline
                  </button>
                  <button
                    className="primary"
                    onClick={() => {
                      update(
                        "invitations",
                        data.invitations.map((x) =>
                          x.id === a.id ? { ...x, status: "Accepted" } : x,
                        ),
                      );
                      update("teams", [
                        ...data.teams,
                        {
                          id: Date.now(),
                          title: a.title,
                          role: a.role,
                          members: [data.profile.name, a.from],
                          activity: "You joined the team",
                          date: "Just now",
                          status: "In progress",
                          category: "Sustainability",
                          contribution: "",
                        },
                      ]);
                      notify("Invitation accepted. Team added to My Teams.");
                    }}
                  >
                    Accept invitation
                  </button>
                </div>
              )}
            </div>
          ))}
      {!data[tab === "Applications" ? "applications" : "invitations"]
        .length && <Empty title={`No ${tab.toLowerCase()} yet`} />}
    </>
  );
}
export function Teams({ data, open }) {
  const [tab, setTab] = useState("Current teams");
  const teams = data.teams.filter((t) =>
    tab === "Completed Projects"
      ? t.status === "Completed"
      : t.status !== "Completed",
  );
  return (
    <>
      <Heading title="My Teams" />
      <div className="tabs">
        {["Current teams", "Completed Projects"].map((t) => (
          <button
            key={t}
            className={t === tab ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {teams.map((t) => (
        <section className="panel team-card" key={t.id}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t.category}</span>
              <h2>{t.title}</h2>
            </div>
            <span className="state">{t.status}</span>
          </div>
          <div className="team-details">
            <div>
              <h3>Members & roles</h3>
              {t.members.map((m, i) => (
                <div className="list-row" key={m}>
                  <span>
                    <Avatar
                      name={m
                        .split(" ")
                        .map((s) => s[0])
                        .join("")}
                      small
                    />
                    {m}
                  </span>
                  <span>
                    {i === 0
                      ? t.role
                      : i === 1
                        ? "Backend developer"
                        : "Designer"}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h3>
                {t.status === "Completed"
                  ? "Your contribution"
                  : "Latest activity"}
              </h3>
              <p>{t.status === "Completed" ? t.contribution : t.activity}</p>
              <span className="muted">{t.date}</span>
              {t.status !== "Completed" && (
                <button
                  className="secondary"
                  onClick={() => open("activity", t)}
                >
                  Add update
                </button>
              )}
            </div>
          </div>
        </section>
      ))}
      {!teams.length && (
        <Empty title="No teams here yet">
          <Link to="/projects" className="text-link">
            Explore Projects
          </Link>
        </Empty>
      )}
    </>
  );
}
export function Portfolio({ data }) {
  return (
    <>
      <Heading title="My Portfolio">
        <Link className="secondary" to="/posts">
          Manage posts
        </Link>
      </Heading>
      <h2 className="section-title">Selected work</h2>
      <div className="portfolio-grid">
        {data.posts.map((p) => (
          <article className="panel portfolio-card" key={p.id}>
            <div className="portfolio-preview">
              <span>&lt;/&gt;</span>
              <strong>{p.title}</strong>
            </div>
            <span className="eyebrow">
              {p.category} · {p.status}
            </span>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <Tags items={p.skills.split(",").map((s) => s.trim())} />
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Repository / demo <ExternalLink size={15} />
              </a>
            )}
          </article>
        ))}
      </div>
      {!data.posts.length && (
        <Empty title="Your work belongs here">
          <Link to="/posts">Create your first post</Link>
        </Empty>
      )}
      <h2 className="section-title">Completed team projects</h2>
      {data.teams
        .filter((t) => t.status === "Completed")
        .map((t) => (
          <article className="panel" key={t.id}>
            <div className="section-heading">
              <h2>{t.title}</h2>
              <span className="state">Completed</span>
            </div>
            <p>
              <strong>Your role:</strong> {t.role}
            </p>
            <p>{t.contribution}</p>
            <div className="member-list">
              {t.members.map((m) => (
                <span key={m}>
                  <Avatar
                    name={m
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                    small
                  />
                  {m}
                </span>
              ))}
            </div>
          </article>
        ))}
    </>
  );
}
export function Profile({ data, update, notify }) {
  const [editing, setEditing] = useState(false);
  const p = data.profile;
  return (
    <>
      <Heading title="My Profile">
        <button className="secondary" onClick={() => setEditing(!editing)}>
          <Pencil size={16} />
          {editing ? "Cancel" : "Edit profile"}
        </button>
      </Heading>
      <div className="profile-header panel">
        <Avatar
          name={p.name
            .split(" ")
            .map((x) => x[0])
            .join("")}
          color="sage"
        />
        <div>
          <h1>{p.name}</h1>
          <p>
            {p.course} · {p.year}
          </p>
        </div>
        <span className="state">Open to projects</span>
      </div>
      {editing ? (
        <form
          className="panel profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            update(
              "profile",
              Object.fromEntries(new FormData(e.currentTarget)),
            );
            setEditing(false);
            notify("Profile saved");
          }}
        >
          <div className="form-grid">
            {[
              ["name", "Full name"],
              ["course", "Course"],
              ["year", "Academic year"],
              ["role", "Preferred role"],
              ["skills", "Skills (comma separated)"],
              ["interests", "Interests"],
              ["availability", "Weekly availability"],
              ["portfolio", "Portfolio URL"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  name={key}
                  defaultValue={p[key]}
                  required={key !== "portfolio"}
                  type={key === "portfolio" ? "url" : "text"}
                />
              </label>
            ))}
          </div>
          <label>
            About you
            <textarea name="bio" defaultValue={p.bio} />
          </label>
          <button className="primary">Save profile</button>
        </form>
      ) : (
        <div className="detail-grid">
          <section className="panel">
            <h2>About</h2>
            <p>{p.bio}</p>
            <h2>Self-declared skills</h2>
            <Tags items={p.skills.split(",").map((x) => x.trim())} />
            <h2>Interests</h2>
            <p>{p.interests}</p>
            <h2>Preferred role</h2>
            <p>{p.role}</p>
            <h2>Availability</h2>
            <p>{p.availability}</p>
            {p.portfolio && (
              <a
                href={p.portfolio}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Portfolio <ExternalLink size={15} />
              </a>
            )}
          </section>
          <section>
            <div className="panel">
              <h2>Recent work & activity</h2>
              {data.posts.slice(0, 3).map((post) => (
                <Link className="activity-link" to="/posts" key={post.id}>
                  <span className="eyebrow">{post.category}</span>
                  <h3>{post.title}</h3>
                  <span className="muted">{post.date}</span>
                </Link>
              ))}
              {!data.posts.length && (
                <Link to="/posts">Add your first post</Link>
              )}
            </div>
            <Link className="secondary" to="/portfolio">
              View portfolio <ArrowUpRight size={15} />
            </Link>
          </section>
        </div>
      )}
      {!editing && <ActivityProfile posts={data.posts} own />}
    </>
  );
}
export function SkillExchange({ data, open }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const list = data.exchanges.filter(
    (x) =>
      (x.skill + " " + x.description).toLowerCase().includes(q.toLowerCase()) &&
      (type === "All" || x.type === type),
  );
  return (
    <>
      <Heading title="Skill Exchange">
        <Link className="secondary" to="/workshops">
          Workshops
        </Link>
        <button className="primary" onClick={() => open("exchange")}>
          <Plus size={16} />
          Offer or request help
        </button>
      </Heading>
      <div className="filter-panel filter-row">
        <input
          aria-label="Search skills"
          placeholder="Search a skill"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          aria-label="Exchange type"
          onChange={(e) => setType(e.target.value)}
        >
          {["All", "Offering", "Requesting"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="people-grid">
        {list.map((x) => (
          <article className="panel exchange-card" key={x.id}>
            <span className={`state ${x.type === "Requesting" ? "amber" : ""}`}>
              {x.type} help
            </span>
            <h2>{x.skill}</h2>
            <p>{x.description}</p>
            <div className="member-list">
              <Avatar name={x.initials} small />
              <strong>{x.name}</strong>
            </div>
            <p className="muted">
              <Clock size={14} />
              {x.availability}
            </p>
            <button
              className="secondary full"
              onClick={() => open("connect", x)}
            >
              Connect
            </button>
          </article>
        ))}
      </div>
      {!list.length && <Empty title="No matching exchanges" />}
    </>
  );
}

function FileActivityIcon() {
  return <Pencil size={17} />;
}

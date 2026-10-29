import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Search,
  ArrowUpRight,
  Clock,
  Check,
  Users,
  CalendarDays,
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react";
import { projects, people } from "../data/mock";
import { communityPosts } from "../data/community";
import { Avatar, ProjectCard } from "../components/UI";
export default function Dashboard({ data, open }) {
  const nav = useNavigate();
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <div className="date-label">SATURDAY, OCTOBER 24</div>
          <h1>
            Welcome back, {data.profile.name.split(" ")[0]}
            <span className="greeting-dot">.</span>
          </h1>
        </div>
        <button className="primary" onClick={() => open("post")}>
          <Plus size={17} />
          Create Post
        </button>
      </div>
      <div className="dashboard-actions-strip">
        <Link to="/student-posts">
          <FileIcon />
          <div>
            <strong>Student Posts</strong>
            <span>Work, achievements & learning</span>
          </div>
          <ArrowUpRight size={17} />
        </Link>
        <Link to="/recruitment">
          <Users size={20} />
          <div>
            <strong>Project Recruitment</strong>
            <span>Your requirements & member invitations</span>
          </div>
          <ArrowUpRight size={17} />
        </Link>
      </div>
      <form
        className="dashboard-search"
        onSubmit={(e) => {
          e.preventDefault();
          nav(
            "/projects?q=" +
              encodeURIComponent(new FormData(e.currentTarget).get("search")),
          );
        }}
      >
        <Search size={20} />
        <input
          name="search"
          aria-label="Search projects"
          placeholder="Find your next project. Search by topic, skill, or idea…"
        />
        <kbd>↵</kbd>
      </form>
      <div className="dashboard-columns">
        <div className="main-column">
          <section>
            <div className="section-heading">
              <h2>
                Projects for you{" "}
                <span className="count">{projects.length}</span>
              </h2>
              <Link to="/projects">
                Explore all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="recommend-note">
              <Sparkles size={15} /> Based on your skills and interests{" "}
              <Link to="/profile">Edit profile</Link>
            </div>
            <div className="project-grid">
              {projects.slice(0, 2).map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
            <Link className="wide-project" to="/projects/3">
              <span className="project-icon peach">
                <ShieldIcon />
              </span>
              <div>
                <strong>SafeNet phishing detector</strong>
                <span>Cybersecurity · JavaScript, Python</span>
              </div>
              <span className="wide-project-role">
                2 open roles <ArrowUpRight size={16} />
              </span>
            </Link>
          </section>
          <section className="dashboard-posts-section">
            <div className="section-heading">
              <h2>Student Posts</h2>
              <Link to="/student-posts">
                View posts <ArrowRight size={15} />
              </Link>
            </div>
            <div className="dashboard-post-list">
              {communityPosts.slice(0, 2).map((post) => {
                const author = people.find((x) => x.id === post.authorId);
                return (
                  <Link key={post.id} to={`/student-posts#post-${post.id}`}>
                    <Avatar name={author.initials} color={author.color} />
                    <div>
                      <span>
                        {author.name} · {post.category}
                      </span>
                      <strong>{post.title}</strong>
                      <small>{post.skills}</small>
                    </div>
                    <ArrowUpRight size={16} />
                  </Link>
                );
              })}
            </div>
          </section>
          <section className="teammate-section">
            <div className="section-heading">
              <h2>Meet your next teammate</h2>
              <Link to="/teammates">
                Find teammates <ArrowRight size={15} />
              </Link>
            </div>
            <div className="people-row">
              {people.slice(0, 3).map((p) => (
                <Link to={`/people/${p.id}`} className="person-mini" key={p.id}>
                  <Avatar name={p.initials} color={p.color} />
                  <strong>{p.name}</strong>
                  <span>{p.role}</span>
                  <div className="mini-skill">
                    {p.skills.slice(0, 2).join(" · ")}
                  </div>
                  <span className="person-link">
                    View profile <ArrowUpRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section className="team-section">
            <div className="section-heading">
              <h2>Your workspace</h2>
              <Link to="/teams">
                My teams <ArrowRight size={15} />
              </Link>
            </div>
            <div className="workspace">
              <div className="workspace-icon">
                <BookIcon />
              </div>
              <div>
                <strong>Open Library</strong>
                <p>{data.teams[0].activity}</p>
                <span>{data.teams[0].date}</span>
              </div>
              <div className="stack">
                <Avatar name="AM" small />
                <Avatar name="DP" small />
                <Avatar name="AS" small />
              </div>
              <Link to="/teams" aria-label="Open team">
                <ChevronRight size={19} />
              </Link>
            </div>
          </section>
        </div>
        <aside className="right-column">
          <section className="attention-panel">
            <div className="section-heading">
              <h2>Needs your attention</h2>
              <span className="notification-count">
                {data.invitations.filter((x) => x.status === "Pending").length +
                  data.applications.filter((x) => x.status === "Under review")
                    .length}
              </span>
            </div>
            {data.invitations
              .filter((x) => x.status === "Pending")
              .slice(0, 1)
              .map((x) => (
                <div className="attention-item" key={x.id}>
                  <div className="attention-type">
                    <span className="tiny-icon">
                      <Users size={15} />
                    </span>
                    TEAM INVITATION
                  </div>
                  <strong>{x.title}</strong>
                  <p>
                    {x.from} invited you as a {x.role.toLowerCase()}.
                  </p>
                  <Link
                    className="secondary full"
                    to="/applications?tab=invitations"
                  >
                    Review invitation <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            <Link to="/applications" className="application-note">
              <Clock size={18} />
              <div>
                <strong>
                  {
                    data.applications.filter((x) => x.status === "Under review")
                      .length
                  }{" "}
                  application under review
                </strong>
                <span>View application status</span>
              </div>
              <ChevronRight size={16} />
            </Link>
          </section>
          <section className="profile-panel">
            <div className="section-heading">
              <h2>Your profile</h2>
              <span className="profile-graphic">
                <Users size={20} />
              </span>
            </div>
            <Link to="/profile" className="text-link">
              Update your profile <ArrowUpRight size={16} />
            </Link>
            <div className="profile-progress">
              <span />
            </div>
            <div className="profile-checks">
              <span>
                <Check size={13} /> Academic info
              </span>
              <span>
                <Check size={13} /> Skills
              </span>
              <span className="muted">+ Selected work</span>
            </div>
          </section>
          <section className="workshop-panel">
            <div className="section-heading">
              <h2>On campus</h2>
              <CalendarDays size={17} />
            </div>
            <div className="workshop-date">
              <strong>02</strong>
              <span>NOV</span>
            </div>
            <div className="workshop-info">
              <span className="eyebrow">WORKSHOP</span>
              <h3>
                {data.workshops[0]?.title ||
                  "Intro to practical machine learning"}
              </h3>
              <p>3:00 PM · Innovation Lab</p>
            </div>
            <Link to="/workshops" className="text-link">
              View workshop <ArrowUpRight size={16} />
            </Link>
          </section>
          <div className="requirement-prompt">
            <button onClick={() => open("requirement")}>
              Post a Project Requirement <ArrowRight size={15} />
            </button>
          </div>
        </aside>
      </div>
      <footer className="page-footer">
        <span>Local prototype · Changes saved in this browser</span>
        <span>
          College Connect <span className="footer-dot">·</span> Campus workspace
        </span>
      </footer>
    </>
  );
}
function ShieldIcon() {
  return <Users size={23} />;
}
function BookIcon() {
  return <Users size={22} />;
}

function FileIcon() {
  return <FileText size={20} />;
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "./UI";
const categories = [
  "Project showcase",
  "Personal experiment",
  "Hackathon / competition",
  "Achievement / certification",
  "Workshop",
  "Learning update",
];
export default function Forms({ modal, close, data, update, notify }) {
  const { type, item } = modal;
  const navigate = useNavigate();
  const [category, setCategory] = useState(item?.category || categories[0]);
  const [error, setError] = useState("");
  const done = (msg) => {
    notify(msg);
    close();
  };
  const field = (name, label, opts = {}) => (
    <label>
      {label}
      <input name={name} defaultValue={item?.[name] || ""} {...opts} />
    </label>
  );
  const text = (name, label, required = true) => (
    <label>
      {label}
      <textarea
        name={name}
        required={required}
        defaultValue={item?.[name] || ""}
      />
    </label>
  );
  function submit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (f.title && !f.title.trim()) {
      setError("Enter a title, not only spaces.");
      return;
    }
    if (type === "post") {
      const files = [...e.currentTarget.elements.media.files];
      if (files.some((x) => x.size > 10 * 1024 * 1024)) {
        setError("Each supporting file must be under 10 MB.");
        return;
      }
      const p = {
        ...f,
        id: item?.id || Date.now(),
        attachments: files.length
          ? files.map((x) => x.name)
          : item?.attachments || [],
      };
      delete p.media;
      update(
        "posts",
        item
          ? data.posts.map((x) => (x.id === item.id ? p : x))
          : [p, ...data.posts],
      );
      done(
        item
          ? "Post and activity profile updated"
          : "Post published. Activity profile updated.",
      );
      if (!item) navigate(`/student-posts#post-${p.id}`);
    }
    if (type === "requirement") {
      const p = {
        ...f,
        id: Date.now(),
        skills: f.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        roles: f.roles
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        size: Number(f.size),
        members: 1,
        owner: data.profile.name,
        initials: "AM",
        color: "sage",
        icon: "book",
        status: "Recruiting",
      };
      update("requirements", [p, ...data.requirements]);
      done(
        "Project requirement published. Review the example member shortlist below.",
      );
      navigate(`/projects/${p.id}#recommended-members`);
    }
    if (type === "apply") {
      update("applications", [
        {
          id: Date.now(),
          projectId: item.id,
          title: item.title,
          role: f.role,
          note: f.note,
          status: "Under review",
          date: "Oct 24",
        },
        ...data.applications,
      ]);
      done("Application sent locally");
    }
    if (type === "invite") {
      const selectedProject = [...data.requirements, ...data.teams].find(
        (p) => String(p.id) === f.team,
      );
      if (!selectedProject) {
        setError("Choose one of your projects.");
        return;
      }
      if (
        (data.sentInvitations || []).some(
          (i) =>
            i.personId === item.id &&
            i.projectId === selectedProject.id &&
            i.status === "Sent",
        )
      ) {
        setError(
          "You already have an invitation saved for this student and project.",
        );
        return;
      }
      update("sentInvitations", [
        {
          id: Date.now(),
          personId: item.id,
          projectId: selectedProject.id,
          projectTitle: selectedProject.title,
          role: f.role,
          message: f.message,
          status: "Sent",
        },
        ...(data.sentInvitations || []),
      ]);
      update("notifications", [
        {
          id: Date.now(),
          text: `Invitation saved for ${item.name} for ${selectedProject.title}.`,
          path: "/recruitment",
          read: false,
        },
        ...data.notifications,
      ]);
      done(`Invitation to ${item.name} saved`);
    }
    if (type === "exchange") {
      update("exchanges", [
        { ...f, id: Date.now(), name: data.profile.name, initials: "AM" },
        ...data.exchanges,
      ]);
      done("Skill exchange published");
    }
    if (type === "connect") {
      update("notifications", [
        {
          id: Date.now(),
          text: `Your request to connect with ${item.name} about ${item.skill} is saved.`,
          read: false,
        },
        ...data.notifications,
      ]);
      done("Connection request saved locally");
    }
    if (type === "activity") {
      update(
        "teams",
        data.teams.map((t) =>
          t.id === item.id ? { ...t, activity: f.update, date: "Just now" } : t,
        ),
      );
      done("Team update added");
    }
    if (type === "workshop") {
      update("workshops", [
        { ...f, id: Date.now(), host: data.profile.name },
        ...data.workshops,
      ]);
      done("Workshop published");
    }
  }
  const titles = {
    post: item ? "Edit Post" : "Create Post",
    requirement: "Post a Project Requirement",
    apply: "Apply to project",
    invite: `Invite ${item?.name}`,
    delete: "Delete post?",
    exchange: "Offer or request help",
    connect: `Connect with ${item?.name}`,
    activity: "Add team update",
    workshop: "Publish workshop",
  };
  return (
    <Modal title={titles[type]} onClose={close}>
      {type === "delete" ? (
        <>
          <p>Delete “{item.title}”? This cannot be undone.</p>
          <div className="modal-actions">
            <button className="secondary" onClick={close}>
              Cancel
            </button>
            <button
              className="danger"
              onClick={() => {
                update(
                  "posts",
                  data.posts.filter((x) => x.id !== item.id),
                );
                done("Post deleted");
              }}
            >
              Delete post
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={submit}>
          {type === "post" && (
            <>
              <p className="post-form-notice">
                Share personal work or learning. This post will appear in
                Student Posts and your Activity & Learning profile.
              </p>
              {field("title", "Title", { required: true, maxLength: 120 })}
              <label>
                Category
                <select
                  name="category"
                  aria-label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              {text("description", "Description")}
              {field("skills", "Skills & technologies (comma separated)", {
                required: true,
              })}
              {field("url", "GitHub repository or live demo URL", {
                type: "url",
              })}
              <div className="form-grid">
                {field("date", "Date", { type: "date", required: true })}
                {["Project showcase", "Personal experiment"].includes(
                  category,
                ) && (
                  <label>
                    Status
                    <select
                      name="status"
                      defaultValue={item?.status || "In progress"}
                    >
                      <option>In progress</option>
                      <option>Completed</option>
                    </select>
                  </label>
                )}
              </div>
              <label>
                Supporting media & files
                <input
                  name="media"
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.txt"
                />
              </label>
              <p className="form-notice">
                Prototype: only file names are saved, not file contents.
              </p>
            </>
          )}
          {type === "requirement" && (
            <>
              {field("title", "Project title", { required: true })}
              <label>
                Category
                <select name="category" aria-label="Category">
                  {[
                    "Web Development",
                    "Artificial Intelligence",
                    "IoT",
                    "Cybersecurity",
                    "Mobile Apps",
                    "Data Analysis",
                    "Sustainability",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              {text("summary", "Project objective")}
              {field("skills", "Required skills (comma separated)", {
                required: true,
              })}
              {field("roles", "Open roles (comma separated)", {
                required: true,
              })}
              <div className="form-grid">
                {field("size", "Total team size", {
                  type: "number",
                  min: 2,
                  max: 20,
                  required: true,
                })}
                {field("availability", "Weekly availability", {
                  required: true,
                  placeholder: "e.g. 4–6 hours / week",
                })}
              </div>
              <label>
                Experience expectations
                <select name="level">
                  <option>Beginners welcome</option>
                  <option>All levels welcome</option>
                  <option>Some project experience</option>
                </select>
              </label>
            </>
          )}
          {type === "apply" && (
            <>
              <h3>{item.title}</h3>
              <label>
                Role
                <select name="role">
                  {item.roles.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label>
                Why are you interested?
                <textarea name="note" required maxLength={1000} />
              </label>
              <p className="form-notice">
                Your profile is included. No resume required.
              </p>
            </>
          )}
          {type === "invite" && (
            <>
              <label>
                Project
                <select
                  name="team"
                  aria-label="Project"
                  required
                  defaultValue={item.project?.id || ""}
                >
                  <option value="">Choose a current team or project</option>
                  {[
                    ...data.teams.filter((t) => t.status !== "Completed"),
                    ...data.requirements.filter(
                      (p) => p.status === "Recruiting",
                    ),
                  ].map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Proposed role
                <input name="role" required defaultValue={item.role} />
              </label>
              <label>
                Message
                <textarea name="message" required />
              </label>
              <p className="form-notice">
                Prototype: invitations stay in this browser; no messages are
                delivered.
              </p>
            </>
          )}
          {type === "exchange" && (
            <>
              <label>
                Type
                <select name="type">
                  <option>Offering</option>
                  <option>Requesting</option>
                </select>
              </label>
              {field("skill", "Skill", { required: true })}
              {text("description", "What would you like to work on?")}
              {field("availability", "Availability", { required: true })}
            </>
          )}
          {type === "connect" && (
            <>
              <h3>{item.skill}</h3>
              <label>
                Message
                <textarea
                  name="message"
                  required
                  placeholder="What would you like to work on together?"
                />
              </label>
              <p className="form-notice">
                Prototype: this request stays in your browser.
              </p>
            </>
          )}
          {type === "activity" && (
            <label>
              Team update
              <textarea name="update" required />
            </label>
          )}
          {type === "workshop" && (
            <>
              {field("title", "Workshop title", { required: true })}
              {field("date", "Date", { required: true, type: "date" })}
              {field("skills", "Skills covered", { required: true })}
            </>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button type="button" className="secondary" onClick={close}>
              Cancel
            </button>
            <button className="primary" type="submit">
              {
                {
                  post: item ? "Save changes" : "Publish post",
                  requirement: "Publish requirement",
                  apply: "Send application",
                  invite: "Send invitation",
                  exchange: "Publish",
                  connect: "Save request",
                  activity: "Add update",
                  workshop: "Publish workshop",
                }[type]
              }
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

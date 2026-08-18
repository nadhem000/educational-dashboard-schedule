# EDSchedule – Educational Dashboard - Schedule

**EDSchedule** is a bilingual (Arabic/English/French) web application for managing and viewing a weekly school schedule.  
It consists of two separate interfaces:

- **Student View (`index.html`)** – Students log in to see their personalized schedule, group, attendance, subjects, and a student card.
- **Admin Panel (`admin.html`)** – Administrators can manage students, sections, subjects, and the weekly schedule, and export the data back into the student view.

The application runs entirely in the browser – no server, database, or build tools required.

---

## ✨ Features

### Student View (`index.html`)
- 🔐 **Login system** – students authenticate with name and password (no self‑registration).
- 🗓️ **Weekly schedule** – Monday to Sunday, 7:00 AM to 8:00 PM, each slot = 1 hour.
- 🌍 **Multi‑language support** – Arabic (RTL), French, and English.
- 🌙 **Dark / Light theme** toggle.
- 👥 **Personal schedule** – highlights only the logged‑in student’s sessions.
- 🧑‍🤝‍🧑 **Group roster** – shows classmates in the same section/group.
- 📆 **Attendance & payment record** – colour‑coded (paid, unpaid, overdue).
- 💼 **Work system** – monthly, per‑8‑sessions, or custom.
- 📚 **Subjects & parent info** – materials studied and parent contact details.
- 🪪 **Student card modal** – a stylish pop‑up with avatar, personal info, subjects, and parent data.

### Admin Panel (`admin.html`)
- 📥 **Import data** – paste existing `index.html` content or a JSON object containing `data` and `subjectCatalog`.
- 🧑‍🎓 **Manage students** – add, edit, delete; modify personal details, subjects, group, attendance, etc.
- 🏫 **Manage sections** – add, edit, delete sections (with Arabic/English/French names).
- 📚 **Manage subject catalog** – add, edit, delete subjects.
- 📅 **Edit weekly schedule** – click any cell to assign one or more sections/groups.
- 💾 **Export** – copy full HTML (ready to replace `index.html`), copy data object as JSON, or download modified HTML.

---

## 🔑 Demo Credentials

The default student data includes these login accounts (all passwords are `123`):

| Name   | Section | Group | Work System |
|--------|---------|-------|-------------|
| أحمد / Ahmed | 6base | – | monthly |
| سارة / Sara | 6base | 1 | per8sessions |
| محمد / Mohamed | 6base | 2 | custom |
| ليلى / Laila | 7base | – | monthly |
| يوسف / Youssef | 7base | – | per8sessions |
| نور / Nour | 8base | – | monthly |
| خالد / Khaled | 8base | – | custom |

*(Login with the Arabic name, English name, or French name, depending on the language you choose.)*

---

## 📁 File Structure

```
.
├── index.html        # Student-facing schedule viewer
├── admin.html        # Administration panel
└── README.md         # This file
├── manifest.json
├── netlify.toml
└── assets
    └── icons
        └── icon-94x94.png
        ├── icon-192x192.png
        └── icon-512x512.png
```

All data is embedded directly in the `<script>` tags.  
No external libraries or frameworks are used – plain HTML, CSS, and JavaScript.

---

## 🚀 Getting Started

### Option 1 – Directly open in browser
Simply open either `index.html` or `admin.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2 – Serve locally (optional)
If you prefer a local server (for example, to avoid any file:// limitations), you can use Python:

```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` and choose the desired file.

---

## 🛠️ Admin Workflow

1. Open `admin.html`.
2. **Import existing data**:
   - If you already have an `index.html` with data, upload it via the file input or paste its entire content into the textarea.
   - Alternatively, you can paste a JSON object that contains `data` and `subjectCatalog`.
3. Use the tabs to edit:
   - **Students** – manage student records.
   - **Schedule** – click on any timetable cell to change assignments.
   - **Sections** – add or modify section names.
   - **Subjects** – manage the subject catalog.
4. **Export**:
   - **Copy Full HTML** – copies an updated `index.html` to your clipboard, which you can then paste into the original file.
   - **Copy Data Object** – copies the data as a JSON object for backup or sharing.
   - **Download HTML** – downloads the full student view as a standalone HTML file.

---

## 🌍 Languages & RTL

The interface supports:
- **Arabic** (default, right‑to‑left)
- **French**
- **English**

The language can be changed using the dropdown in the student view.  
The layout direction automatically switches between RTL (Arabic) and LTR (French/English).

---

## ⚠️ Limitations

- **No persistent database** – data is stored in JavaScript and can be lost on refresh unless exported.  
  The admin panel allows exporting to preserve changes.
- **Security is basic** – suitable for local or demonstration use; not recommended for production without additional backend authentication.
- **No built‑in multi‑user support** – all students and admin data are in the same file.

---

## 🔮 Possible Future Enhancements

- Backend integration (Node.js, Firebase, etc.) for persistent storage.
- User‑friendly import from Excel/Google Sheets.
- Role‑based access control for teachers and administrators.
- Automated attendance tracking.
- Responsive table improvements for small screens (already partially implemented).

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have an idea for an improvement, please open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).  
*(You may add a LICENSE file if desired.)*

"""Generate the Book Store project proposal PDF."""

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUTPUT = r"D:\library\Book_Store_Project_Proposal.pdf"

NAVY = colors.HexColor("#1e3a8a")
BLUE = colors.HexColor("#1d4ed8")
TEAL = colors.HexColor("#0f766e")
LIGHT = colors.HexColor("#f0fdfa")
ROW = colors.HexColor("#eff6ff")
GRAY = colors.HexColor("#334155")
LINE = colors.HexColor("#cbd5e1")


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, A4[1] - 18, A4[0], 18, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Times-Bold", 8)
    canvas.drawString(20 * mm, A4[1] - 12, "BOOK STORE  |  PROJECT PROPOSAL")
    canvas.drawRightString(A4[0] - 20 * mm, A4[1] - 12, "Online Book Inventory Platform")

    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], 16, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Times-Roman", 8)
    canvas.drawString(20 * mm, 6, "Confidential  —  Academic / Project Use")
    canvas.drawRightString(A4[0] - 20 * mm, 6, f"Page {doc.page}")
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.rect(0, A4[1] - 28 * mm, A4[0], 8 * mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Times-Roman", 11)
    canvas.drawCentredString(A4[0] / 2, A4[1] - 48 * mm, "PROJECT PROPOSAL")
    canvas.setFont("Times-Bold", 26)
    canvas.drawCentredString(A4[0] / 2, A4[1] - 70 * mm, "Book Store")
    canvas.setStrokeColor(TEAL)
    canvas.setLineWidth(1.5)
    canvas.line(55 * mm, A4[1] - 78 * mm, A4[0] - 55 * mm, A4[1] - 78 * mm)
    canvas.setFont("Times-Italic", 13)
    canvas.drawCentredString(
        A4[0] / 2,
        A4[1] - 90 * mm,
        "An Online Book Inventory, Discovery, and Member Platform",
    )

    canvas.setFont("Times-Roman", 11)
    y = A4[1] - 125 * mm
    lines = [
        "A full-stack web application for browsing, saving, and managing books,",
        "with role-based access for readers and administrators.",
        "",
        "Frontend: React 18, Vite, Tailwind CSS, React Router",
        "Backend: FastAPI (Python)",
        "Data: PostgreSQL (authentication)  ·  MongoDB (books & reviews)",
    ]
    for line in lines:
        canvas.drawCentredString(A4[0] / 2, y, line)
        y -= 7 * mm

    canvas.setFillColor(TEAL)
    canvas.roundRect(45 * mm, 48 * mm, A4[0] - 90 * mm, 42 * mm, 4, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Times-Bold", 10)
    canvas.drawCentredString(A4[0] / 2, 78 * mm, "DOCUMENT DETAILS")
    canvas.setFont("Times-Roman", 10)
    canvas.drawCentredString(A4[0] / 2, 68 * mm, "Version 1.0    ·    August 2026")
    canvas.drawCentredString(A4[0] / 2, 60 * mm, "Prepared from the current Book Store codebase")
    canvas.drawCentredString(A4[0] / 2, 52 * mm, "Local client: http://localhost:5173    API: http://127.0.0.1:5000")
    canvas.restoreState()


def styles():
    base = getSampleStyleSheet()
    s = {
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Times-Bold",
            fontSize=16,
            textColor=NAVY,
            spaceBefore=14,
            spaceAfter=8,
            borderPadding=3,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Times-Bold",
            fontSize=12.5,
            textColor=BLUE,
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=10.5,
            leading=15,
            textColor=GRAY,
            alignment=TA_JUSTIFY,
            spaceAfter=7,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=10.5,
            leading=14.5,
            textColor=GRAY,
            leftIndent=12,
            spaceAfter=3,
        ),
        "caption": ParagraphStyle(
            "Cap",
            parent=base["Normal"],
            fontName="Times-Italic",
            fontSize=9,
            textColor=colors.HexColor("#64748b"),
            alignment=TA_CENTER,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "toc": ParagraphStyle(
            "TOC",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=11,
            leading=18,
            textColor=GRAY,
        ),
        "cell": ParagraphStyle(
            "Cell",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=8.8,
            leading=12,
            textColor=GRAY,
        ),
        "cellh": ParagraphStyle(
            "CellH",
            parent=base["Normal"],
            fontName="Times-Bold",
            fontSize=8.8,
            leading=12,
            textColor=colors.white,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=base["Normal"],
            fontName="Times-Roman",
            fontSize=11,
            leading=16,
            textColor=GRAY,
        ),
    }
    return s


def bullets(items, st):
    return ListFlowable(
        [
            ListItem(Paragraph(item, st["bullet"]), leftIndent=10, bulletColor=TEAL)
            for item in items
        ],
        bulletType="bullet",
        start="•",
        leftIndent=18,
        bulletFontName="Times-Bold",
        bulletFontSize=10,
        spaceAfter=8,
    )


def table(headers, rows, col_widths, st):
    head = [Paragraph(h, st["cellh"]) for h in headers]
    data = [head]
    for row in rows:
        data.append([Paragraph(str(c), st["cell"]) for c in row])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
        ("ALIGN", (0, 0), (-1, 0), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW))
        else:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), colors.white))
    t.setStyle(TableStyle(style_cmds))
    return t


def build():
    st = styles()
    story = []

    # Cover is drawn in onFirstPage; this spacer keeps flow starting on page 2
    story.append(PageBreak())

    story.append(Paragraph("1. Title Page Details", st["h1"]))
    story.append(
        Paragraph(
            "This proposal describes the <b>Book Store</b> web system currently implemented "
            "in the project repository. Blank fields below may be filled for academic submission.",
            st["body"],
        )
    )
    meta = [
        ["Project title", "Book Store — Online Book Inventory and Reader Platform"],
        ["Project type", "Full-stack web application (academic / portfolio)"],
        ["Submitted by", "________________________________"],
        ["Roll / ID", "________________________________"],
        ["Supervisor", "________________________________"],
        ["Institution", "________________________________"],
        ["Department", "Computer Science / Software Engineering"],
        ["Date", "August 2026"],
        ["Document version", "1.0"],
    ]
    story.append(table(["Field", "Value"], meta, [140, 350], st))
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Abstract", st["h1"]))
    story.append(
        Paragraph(
            "Book Store is a web-based book inventory and discovery platform. Readers can browse "
            "a catalog, search and filter by title, author, or genre, open full book pages, and "
            "follow real purchase or listing links on Amazon and Goodreads. Registered members "
            "can save books to a personal list and post reviews. An administrator manages the "
            "catalog through a protected dashboard (upload, edit, delete) and can view inventory "
            "statistics. Authentication is implemented on the FastAPI backend with PostgreSQL "
            "(bcrypt password hashing and JWT sessions). Book records and reviews are stored in "
            "MongoDB. The client is a React single-page application built with Vite, Tailwind CSS, "
            "and React Router. This proposal presents the problem, objectives, architecture, "
            "modules, data design, APIs, and future work based on the implemented system.",
            st["body"],
        )
    )

    story.append(Paragraph("3. Introduction and Problem Statement", st["h1"]))
    story.append(
        Paragraph(
            "Many small bookshops and student projects still rely on static listings or fake "
            "checkout flows. Readers cannot see complete metadata, cannot keep a personal list, "
            "and cannot trust that “Buy” actually leads to a real store. Administrators often "
            "lack a simple inventory panel. The Book Store project addresses these gaps with a "
            "single web application that separates public browsing from privileged catalog "
            "management.",
            st["body"],
        )
    )
    story.append(Paragraph("3.1 Problem", st["h2"]))
    story.append(
        bullets(
            [
                "Catalog data (title, author, cover, genre, rating, year) is often incomplete on simple listing sites.",
                "Guests and members need different capabilities: browse vs. save, review, and manage stock.",
                "Authentication must be owned by the project (not a third-party auth SaaS) and stored in PostgreSQL.",
                "Administrators need a dedicated dashboard that ordinary users cannot open.",
            ],
            st,
        )
    )
    story.append(Paragraph("3.2 Proposed solution", st["h2"]))
    story.append(
        Paragraph(
            "The system is a two-tier web application: a React client and a FastAPI REST API. "
            "Public pages (Home, Shop, About, Contact, book details) work without login. "
            "Membership unlocks reviews and saved books. Only an account with role <b>admin</b> "
            "can open <b>/admin/dashboard</b>. Passwords never leave the server in plain text; "
            "the browser stores a JWT after login or sign-up so the user is signed in immediately "
            "after registration.",
            st["body"],
        )
    )

    story.append(Paragraph("4. Objectives", st["h1"]))
    story.append(Paragraph("4.1 General objective", st["h2"]))
    story.append(
        Paragraph(
            "To design and implement an online book store that supports discovery, membership "
            "features, and administrative inventory control using a modern JavaScript frontend "
            "and a Python API with relational and document databases.",
            st["body"],
        )
    )
    story.append(Paragraph("4.2 Specific objectives", st["h2"]))
    story.append(
        bullets(
            [
                "Provide a responsive public catalog with search and genre filters.",
                "Show complete book details and outbound links to Amazon search and original listings (e.g. Goodreads).",
                "Register and authenticate users in PostgreSQL with hashed passwords and JWT.",
                "Allow members to save books and submit star-rated reviews.",
                "Restrict catalog create/update/delete and dashboard analytics to administrators.",
                "Keep books and reviews in MongoDB for flexible document storage.",
                "Expose a documented REST API (FastAPI interactive docs on port 5000).",
            ],
            st,
        )
    )

    story.append(Paragraph("5. Scope", st["h1"]))
    story.append(Paragraph("5.1 In scope", st["h2"]))
    story.append(
        bullets(
            [
                "Public marketing and catalog pages: Home, About, Shop, Contact, book detail.",
                "Member account: sign up, login, logout, saved books, reviews.",
                "Admin dashboard: stats, upload book, manage/edit/delete books.",
                "REST API for books, reviews, register, login, and current user (/me).",
                "Local development on Windows (Vite :5173, FastAPI :5000).",
            ],
            st,
        )
    )
    story.append(Paragraph("5.2 Out of scope (current version)", st["h2"]))
    story.append(
        bullets(
            [
                "In-app payment gateway and shopping cart checkout (Buy opens Amazon).",
                "Email-based password reset and Google/OAuth social login.",
                "Mobile native apps (the UI is responsive in the browser).",
                "Migrating the entire book catalog from MongoDB into PostgreSQL.",
                "Production hosting, HTTPS termination, and rate limiting at scale.",
            ],
            st,
        )
    )

    story.append(Paragraph("6. Target Users and Roles", st["h1"]))
    story.append(
        table(
            ["Role", "Who", "What they can do"],
            [
                [
                    "Guest",
                    "Visitor without an account",
                    "Home, About, Shop, Contact, book pages. Cannot save books or post reviews.",
                ],
                [
                    "User (member)",
                    "Registered reader",
                    "All guest features plus Sign up/Login (JWT), Save book, Account list, write reviews.",
                ],
                [
                    "Admin",
                    "Seeded store manager (role = admin)",
                    "All member features plus Dashboard, Upload, Manage, Edit, Delete inventory.",
                ],
            ],
            [90, 140, 260],
            st,
        )
    )
    story.append(
        Paragraph(
            "Table 1. Role-based access. Admin routes are wrapped in a private router that "
            "requires a logged-in user whose role is admin; other users are sent home.",
            st["caption"],
        )
    )

    story.append(Paragraph("7. System Architecture", st["h1"]))
    story.append(
        Paragraph(
            "The architecture is a browser SPA talking to a single REST backend. The API talks "
            "to two data stores: PostgreSQL for identity, MongoDB for catalog content.",
            st["body"],
        )
    )
    arch = [
        ["Layer", "Component", "Responsibility"],
        [
            "Presentation",
            "React 18 + Vite + Tailwind + Flowbite",
            "Pages, forms, routing, JWT in localStorage, saved-book list on the device.",
        ],
        [
            "API",
            "FastAPI + Uvicorn (port 5000)",
            "CORS-enabled REST: books, reviews, register, login, /me. JWT Bearer on protected routes.",
        ],
        [
            "Identity DB",
            "PostgreSQL (database bookstore, table users)",
            "Email (unique), bcrypt hash, role, display name, created_at. Admin seeded on startup.",
        ],
        [
            "Catalog DB",
            "MongoDB (database Bookinventary)",
            "Collection books (inventory). Collection reviews (reader comments, ratings).",
        ],
        [
            "External",
            "Amazon search URL, Goodreads/listing URL",
            "Purchase and reference; not processed inside this application.",
        ],
    ]
    story.append(table(arch[0], arch[1:], [85, 165, 240], st))
    story.append(Paragraph("Table 2. Logical architecture of Book Store.", st["caption"]))
    story.append(
        Paragraph(
            "Request flow (member review): Browser → POST /add-review with Authorization: Bearer "
            "&lt;token&gt; → FastAPI validates JWT → loads user from PostgreSQL → writes review "
            "document to MongoDB → JSON success → Home review carousel refreshes.",
            st["body"],
        )
    )

    story.append(Paragraph("8. Methodology", st["h1"]))
    story.append(
        Paragraph(
            "Development followed an iterative, module-based approach similar to Agile: public "
            "catalog first, then inventory API, then authentication and membership features, then "
            "admin dashboard hardening. Each slice was tested in the browser against the local API.",
            st["body"],
        )
    )
    story.append(
        table(
            ["Phase", "Focus", "Outcome"],
            [
                ["1. Requirements", "Reader vs admin needs", "Pages, roles, and data fields defined"],
                ["2. Catalog API", "FastAPI + MongoDB books", "CRUD matching the React forms"],
                ["3. Public UI", "Home, Shop, About, book page", "Search, filters, Amazon/Goodreads"],
                ["4. Auth", "PostgreSQL users + JWT", "Register, login, /me, hashed passwords"],
                ["5. Membership", "Reviews, saved books, Account", "Guests blocked from those actions"],
                ["6. Admin", "Private dashboard", "Stats, upload, manage, edit"],
            ],
            [80, 180, 230],
            st,
        )
    )
    story.append(Paragraph("Table 3. Development phases.", st["caption"]))

    story.append(Paragraph("9. Functional Requirements (Modules)", st["h1"]))
    story.append(Paragraph("9.1 Public website", st["h2"]))
    story.append(
        bullets(
            [
                "<b>Home:</b> hero banner, best-seller carousel, favourite-book section, promo, other titles, live reviews.",
                "<b>Shop:</b> loads GET /all-books; search by title/author/genre; genre chips; cards link to /book/:id.",
                "<b>Book detail:</b> cover, title, author, genre, rating, year; Buy on Amazon; Open on Goodreads (from stored URL); Save if logged in.",
                "<b>About:</b> store story, values, and calls to shop or contact.",
                "<b>Contact:</b> name, email, and message form (client-side submission in the current build).",
            ],
            st,
        )
    )
    story.append(Paragraph("9.2 Authentication and account", st["h2"]))
    story.append(
        bullets(
            [
                "<b>Sign up:</b> POST /register — creates PostgreSQL user with role user, returns JWT, redirects (user is logged in immediately).",
                "<b>Login:</b> POST /login — verifies bcrypt hash, returns JWT and role; admin is sent to the dashboard.",
                "<b>Session:</b> token in localStorage; GET /me restores the session on reload.",
                "<b>Account:</b> profile summary and saved-book grid (stored per email in the browser).",
                "The reserved admin email cannot be used for public sign-up.",
            ],
            st,
        )
    )
    story.append(Paragraph("9.3 Reviews", st["h2"]))
    story.append(
        Paragraph(
            "GET /all-reviews is public. POST /add-review requires a valid JWT. The server sets "
            "the reviewer name from the logged-in account. Guests see Sign in / Create account "
            "instead of the form. Ratings are 1–5 stars.",
            st["body"],
        )
    )
    story.append(Paragraph("9.4 Admin dashboard", st["h2"]))
    story.append(
        bullets(
            [
                "Protected layout: PrivateRouter checks login and isAdmin.",
                "Dashboard home: book count, genre count, review count, average rating, recent books and reviews.",
                "Upload book: title, author, image URL, listing URL, rating, year, category (Fiction, Programming, History, etc.).",
                "Manage / Edit: update or delete existing MongoDB book documents.",
            ],
            st,
        )
    )

    story.append(Paragraph("10. Non-Functional Requirements", st["h1"]))
    story.append(
        bullets(
            [
                "<b>Security:</b> bcrypt hashes; JWT (HS256, seven-day expiry); admin routes blocked in the UI; review POST requires Bearer token.",
                "<b>Usability:</b> Tailwind layout, sticky navbar, mobile menu, consistent blue/teal theme.",
                "<b>Performance:</b> Vite HMR for development; async FastAPI (Motor + SQLAlchemy async).",
                "<b>Maintainability:</b> Pydantic models for payloads; environment variables for Mongo URI, DATABASE_URL, JWT secret, admin seed.",
                "<b>Portability:</b> runs locally on Windows with Python 3, Node.js, PostgreSQL, and MongoDB.",
            ],
            st,
        )
    )

    story.append(Paragraph("11. Technology Stack", st["h1"]))
    story.append(
        table(
            ["Layer", "Technology", "Why it is used"],
            [
                ["UI library", "React 18", "Component pages, context for auth state"],
                ["Bundler", "Vite 5", "Fast local dev server and production build"],
                ["Styling", "Tailwind CSS 3, Flowbite React", "Utility layout and form controls"],
                ["Routing", "React Router 6", "Public routes, loaders for book pages, nested admin routes"],
                ["Carousel", "Swiper", "Home book and review sliders"],
                ["API", "FastAPI, Uvicorn", "Typed REST, OpenAPI docs at /docs"],
                ["Validation", "Pydantic", "Book, review, and auth request bodies"],
                ["Auth crypto", "bcrypt, PyJWT", "Password hashing and session tokens"],
                ["ORM / PG", "SQLAlchemy 2, asyncpg", "Async PostgreSQL users table"],
                ["Documents", "Motor / PyMongo", "Async MongoDB for books and reviews"],
                ["Config", "python-dotenv", "Local .env for secrets and URLs"],
            ],
            [85, 160, 245],
            st,
        )
    )
    story.append(Paragraph("Table 4. Tools and libraries used in the repository.", st["caption"]))

    story.append(Paragraph("12. Data Design", st["h1"]))
    story.append(Paragraph("12.1 PostgreSQL — users", st["h2"]))
    story.append(
        table(
            ["Column", "Type", "Notes"],
            [
                ["id", "INTEGER PK", "Auto-increment"],
                ["email", "VARCHAR(120) UNIQUE", "Lowercased login key"],
                ["password_hash", "VARCHAR(255)", "bcrypt hash, never returned to the client"],
                ["role", "VARCHAR(20)", "user or admin"],
                ["display_name", "VARCHAR(80)", "Defaults to the email local-part"],
                ["created_at", "TIMESTAMPTZ", "Account creation time"],
            ],
            [120, 140, 230],
            st,
        )
    )
    story.append(Paragraph("Table 5. Identity schema (bookstore.users).", st["caption"]))
    story.append(Paragraph("12.2 MongoDB — books", st["h2"]))
    story.append(
        Paragraph(
            "Each book document includes an ObjectId <b>_id</b> plus fields used by upload and "
            "shop screens: <b>title</b>, <b>author</b>, <b>imgURL</b>, <b>bookpdf</b> (external "
            "listing URL), <b>rating</b>, <b>publishedYear</b>, <b>genre</b>. Extra keys are "
            "allowed on insert so older records still load.",
            st["body"],
        )
    )
    story.append(Paragraph("12.3 MongoDB — reviews", st["h2"]))
    story.append(
        Paragraph(
            "Review documents store <b>name</b> (from the authenticated user), <b>role</b> "
            "(optional city or label), <b>comment</b>, <b>rating</b> (1–5), and <b>createdAt</b>. "
            "The API returns the latest reviews (sorted descending, limited) for the home carousel "
            "and the admin panel.",
            st["body"],
        )
    )
    story.append(Paragraph("12.4 Client-only saved books", st["h2"]))
    story.append(
        Paragraph(
            "Saved titles are kept in the browser under a key per member email (title, author, "
            "cover, id). This is intentional in the current version: membership is server-side; "
            "the reading list is local to the device.",
            st["body"],
        )
    )

    story.append(Paragraph("13. REST API Summary", st["h1"]))
    story.append(
        table(
            ["Method", "Path", "Auth", "Purpose"],
            [
                ["GET", "/", "No", "Health text"],
                ["GET", "/all-books", "No", "List catalog"],
                ["GET", "/book/{id}", "No", "One book"],
                ["POST", "/add-book", "Admin UI", "Create book"],
                ["PUT", "/update-book/{id}", "Admin UI", "Update book"],
                ["DELETE", "/delete-book/{id}", "Admin UI", "Delete book"],
                ["GET", "/all-reviews", "No", "List reviews"],
                ["POST", "/add-review", "JWT required", "Create review"],
                ["POST", "/register", "No", "Create member + JWT"],
                ["POST", "/login", "No", "Verify password + JWT"],
                ["GET", "/me", "JWT required", "Current user profile"],
            ],
            [70, 150, 95, 175],
            st,
        )
    )
    story.append(
        Paragraph(
            "Table 6. API contract. Interactive documentation is available at "
            "http://127.0.0.1:5000/docs when the server is running. Book mutation routes are "
            "called from the admin dashboard; tightening them with JWT on the server is listed "
            "under future work.",
            st["caption"],
        )
    )

    story.append(Paragraph("14. User Interface Overview", st["h1"]))
    story.append(
        table(
            ["Route", "Screen", "Access"],
            [
                ["/", "Home (banner, lists, reviews)", "Public"],
                ["/shop", "Catalog search and genre filter", "Public"],
                ["/book/:id", "Full book + Amazon + save", "Public (save needs login)"],
                ["/about", "About the store", "Public"],
                ["/contact", "Contact form", "Public"],
                ["/login", "Sign in", "Public"],
                ["/sign-up", "Create account (then logged in)", "Public"],
                ["/account", "Saved books", "Logged-in member"],
                ["/admin/dashboard", "Stats overview", "Admin only"],
                ["/admin/dashboard/upload", "Add book form", "Admin only"],
                ["/admin/dashboard/manage", "Inventory table", "Admin only"],
                ["/admin/dashboard/edit-books/:id", "Edit book", "Admin only"],
            ],
            [170, 200, 120],
            st,
        )
    )
    story.append(Paragraph("Table 7. Client routes (React Router).", st["caption"]))

    story.append(Paragraph("15. Hardware and Software Requirements", st["h1"]))
    story.append(
        bullets(
            [
                "OS: Windows 10/11 (project developed on Windows).",
                "Python 3.13+ with packages in fastapi-server/requirements.txt.",
                "Node.js and npm for mern-client (npm run dev).",
                "PostgreSQL 17/18 listening locally (default DATABASE_URL uses port 5432, database bookstore).",
                "MongoDB on 127.0.0.1:27017, database name Bookinventary.",
                "Modern browser (Chrome, Edge, Firefox).",
            ],
            st,
        )
    )
    story.append(
        Paragraph(
            "Run API: <b>cd fastapi-server</b> then <b>python main.py</b>. "
            "Run UI: <b>cd mern-client</b> then <b>npm run dev</b>. "
            "Client origin is typically http://localhost:5173/.",
            st["body"],
        )
    )

    story.append(Paragraph("16. Testing Approach", st["h1"]))
    story.append(
        bullets(
            [
                "Manual UI tests: guest browse, member sign-up/login, save book, post review, logout.",
                "Negative tests: wrong password, duplicate email, admin email blocked on sign-up, non-admin opening /admin/dashboard.",
                "API checks via FastAPI /docs: register, login, /me, book CRUD, reviews.",
                "Startup checks: PostgreSQL database auto-created if missing; admin user seeded; optional review seed if the collection is empty.",
            ],
            st,
        )
    )

    story.append(Paragraph("17. Limitations", st["h1"]))
    story.append(
        bullets(
            [
                "Book create/update/delete endpoints are not yet JWT-enforced on the server (UI is gated).",
                "Contact form does not persist messages to a database.",
                "Saved books do not sync across devices.",
                "No automated unit/e2e test suite in the repository.",
                "Secrets must be changed before any public deployment (JWT_SECRET, admin password, database URL).",
            ],
            st,
        )
    )

    story.append(Paragraph("18. Future Work", st["h1"]))
    story.append(
        bullets(
            [
                "Require admin JWT on all book mutation APIs.",
                "Move saved books into PostgreSQL so lists follow the user.",
                "Optional: store the full catalog in PostgreSQL for a single database.",
                "Password reset via email and optional OAuth.",
                "Server-side contact inbox and order/cart if in-house checkout is required.",
                "Deploy frontend and API with HTTPS and environment-specific CORS.",
            ],
            st,
        )
    )

    story.append(Paragraph("19. Project Timeline (Indicative)", st["h1"]))
    story.append(
        Paragraph(
            "The following schedule is suitable for an academic semester mapping onto the "
            "modules already present in the codebase.",
            st["body"],
        )
    )
    story.append(
        table(
            ["Week", "Milestone"],
            [
                ["1–2", "Requirements, wireframes, stack selection, local Postgres + Mongo setup"],
                ["3–4", "FastAPI book CRUD and React shop/home catalog"],
                ["5–6", "Book detail, Amazon/Goodreads, About/Contact polish"],
                ["7–8", "PostgreSQL auth, JWT, sign up/login, member reviews and saved books"],
                ["9–10", "Admin dashboard, upload/manage/edit, role guard"],
                ["11–12", "Integration testing, proposal/documentation, demo rehearsal"],
            ],
            [80, 410],
            st,
        )
    )
    story.append(Paragraph("Table 8. Suggested 12-week plan aligned with implemented features.", st["caption"]))

    story.append(Paragraph("20. Conclusion", st["h1"]))
    story.append(
        Paragraph(
            "Book Store is a complete student-scale bookstore platform: a React storefront, a "
            "FastAPI backend, PostgreSQL for accounts, and MongoDB for books and reviews. It "
            "solves incomplete listings and fake checkout by showing full metadata and sending "
            "buyers to real external stores, while giving members a reason to register (reviews "
            "and a saved list) and giving an administrator a dedicated inventory console. The "
            "architecture is ready for classroom demonstration and for incremental hardening "
            "(API authorization, synced saved lists, and production deployment) as future work.",
            st["body"],
        )
    )

    story.append(Paragraph("21. References and Tools", st["h1"]))
    story.append(
        bullets(
            [
                "FastAPI documentation — https://fastapi.tiangolo.com/",
                "React documentation — https://react.dev/",
                "Vite — https://vitejs.dev/",
                "PostgreSQL — https://www.postgresql.org/docs/",
                "MongoDB Manual — https://www.mongodb.com/docs/manual/",
                "SQLAlchemy 2.0 — https://docs.sqlalchemy.org/",
                "Tailwind CSS — https://tailwindcss.com/docs",
            ],
            st,
        )
    )

    story.append(Paragraph("22. Appendix — Repository Layout", st["h1"]))
    story.append(
        table(
            ["Path", "Contents"],
            [
                ["mern-client/", "React SPA (pages, dashboard, auth context, API helper)"],
                ["mern-client/src/shop/", "Shop grid and single-book page"],
                ["mern-client/src/dashboard/", "Admin layout, upload, manage, edit"],
                ["mern-client/src/api/auth.js", "JWT token helper: register, login, /me, authFetch"],
                ["fastapi-server/main.py", "REST routes for books, reviews, auth"],
                ["fastapi-server/auth.py", "bcrypt + JWT helpers and current-user dependency"],
                ["fastapi-server/postgres_db.py", "SQLAlchemy User model and Postgres startup"],
                ["fastapi-server/database.py", "MongoDB connection and review seed"],
                ["fastapi-server/models.py", "Pydantic request/response models"],
            ],
            [190, 300],
            st,
        )
    )
    story.append(Paragraph("Table 9. Main folders and files in D:\\library.", st["caption"]))
    story.append(
        Paragraph(
            "End of proposal. Fill the title-page names before printing or submitting to a supervisor.",
            st["body"],
        )
    )

    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=20 * mm,
        title="Book Store — Project Proposal",
        author="Book Store Project",
        subject="Project proposal for the online book inventory platform",
    )
    doc.build(story, onFirstPage=cover_page, onLaterPages=header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    build()

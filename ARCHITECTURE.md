# Project Architecture & Workflow

This document outlines the file structure and the operational workflow of the **Ayush Solar** Django project.

## 📂 File Structure

The project follows a standard Django project structure with a single core application.

```text
ayush_solar/                # Root Project Directory
│
├── ayush_solar/            # Project Configuration
│   ├── settings.py         # Main settings (DB, Apps, Static files)
│   ├── urls.py             # Root URL Routing (includes core.urls)
│   └── wsgi.py/asgi.py     # Server entry points
│
├── core/                   # Main Application Logic
│   ├── admin.py            # Admin panel configuration
│   ├── models.py           # Database Models (ConsultationRequest, FAQs)
│   ├── views.py            # logic for handling requests (Home, Form Submit)
│   ├── forms.py            # Form validation logic
│   ├── urls.py             # App-level URL routing
│   └── tests.py            # Automated tests
│
├── templates/              # HTML Templates
│   ├── base.html           # Base layout (Head, Body structure)
│   ├── index.html          # Main landing page (extends base.html)
│   └── partials/           # Reusable HTML components
│       ├── _navbar.html    # Navigation bar
│       ├── _hero.html      # Hero section
│       ├── _faqs.html      # FAQ section
│       ├── _contact.html   # Contact form section
│       └── ... (other sections like about, benefits, etc.)
│
├── static/                 # Static Assets
│   ├── css/
│   │   └── styles.css      # Custom styles & animation classes
│   ├── js/
│   │   └── scripts.js      # Frontend logic (Calculator, Animations, API)
│   └── images/             # Project images
│
├── db.sqlite3              # SQLite Database file
├── manage.py               # Django command-line utility
└── populate_faqs.py        # Utility script to seed FAQ data
```

---

## 🔄 Workflow Diagram

### 1. Request Cycle (User Visits Website)

1.  **Browser** sends request to `http://website.com/`.
2.  **`ayush_solar/urls.py`** receives the request.
    *   It points to `core.urls` for the root path `''`.
3.  **`core/urls.py`** matches the empty path `''` to `views.home`.
4.  **`core/views.py` (`def home`)** executes:
    *   Fetches active FAQs (`GeneralFAQ`, `SubsidyFAQ`, etc.) from **`core/models.py`**.
    *   Passes these FAQs as `context` to the template.
5.  **Template Rendering**:
    *   loads `templates/index.html`.
    *   `index.html` extends `templates/base.html`.
    *   `index.html` includes various partials (e.g., `{% include 'partials/_hero.html' %}`).
    *   Jinja2 loops render the FAQ data passed from the view.
6.  **Response**: The fully rendered HTML is sent back to the user's browser.

### 2. Consultation Form Submission (AJAX Workflow)

1.  **User** fills out the inquiry form in the Contact section.
2.  **Frontend (`static/js/scripts.js`)**:
    *   Listens for the `submit` event on `#consultation-form`.
    *   Prevents default page reload.
    *   Captures form data and gets the `CSRF` token.
    *   Sends a generic `POST` request to `/submit-consultation/`.
3.  **Routing**:
    *   `ayush_solar/urls.py` -> `core/urls.py`.
    *   `core/urls.py` maps `submit-consultation/` to `views.submit_consultation`.
4.  **Backend (`core/views.py`)**:
    *   Passes `request.POST` data to **`core/forms.py` (`ConsultationForm`)**.
    *   **Form Validation**: Checks if inputs (Mobile, PIN) are valid.
        *   *If Invalid*: Returns `JSONResponse` with errors (Status 400).
        *   *If Valid*: Saves data to `ConsultationRequest` model in DB.
    *   Returns `JSONResponse` with success message (Status 200).
5.  **Frontend Response handling**:
    *   `scripts.js` receives the JSON.
    *   *If Success*: Shows the "Success Modal" and resets the form.
    *   *If Error*: Displays validation errors to the user.

---

## 🔗 Key Dependencies & Connections

*   **`templates/index.html`** is the glue that brings all **partials** together.
*   **`static/js/scripts.js`** relies on specific ID selectors (e.g., `#bill-slider`, `#faq-grid`) defined in the HTML partials.
*   **`core/views.py`** relies on **`core/models.py`** for data structure and **`core/forms.py`** for data validation.

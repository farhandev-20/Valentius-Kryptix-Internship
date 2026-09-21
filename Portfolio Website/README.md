# Farhan Attar - Personal Developer Portfolio

A modern, responsive, and recruiter-friendly personal portfolio website built strictly using **vanilla HTML5, CSS3, and JavaScript**. Designed for internship applications, technical recruitment, and project showcases.

---

## 🚀 Live Demo & Links

- **Portfolio Repository**: [https://github.com/farhandev-20/Portfolio-Website](https://github.com/farhandev-20)
- **Featured Live Project (InterviewAI)**: [https://interviewai-ulkr.onrender.com/](https://interviewai-ulkr.onrender.com/)
- **GitHub Profile**: [https://github.com/farhandev-20](https://github.com/farhandev-20)
- **LinkedIn**: [Farhan Attar Profile](https://linkedin.com/in/farhan-attar)

---

## ✨ Features

- **Semantic HTML5 & Accessibility**: Clean, hierarchical markup using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` with full ARIA attributes.
- **Modern Responsive Design**: Fluid typography, CSS Grid, Flexbox, and tailored media queries tested across mobile (375px), tablet (768px), and widescreen desktop (1280px+).
- **Dark / Light Theme Switcher**: Sleek dark mode by default with a quick toggle for light theme and `localStorage` preference persistence.
- **Glassmorphism & Micro-interactions**: Backdrop blur effects, subtle glowing borders, interactive button states, and smooth scroll reveal animations.
- **Interactive Sticky Navigation**: Dynamic header styling on scroll, hamburger drawer for mobile viewports, and automated active link tracking (Scroll Spy via IntersectionObserver).
- **Recruiter Contact Suite**: Instant one-click email copy functionality with feedback toast and a validated contact form.
- **Zero External Frameworks**: No Bootstrap, Tailwind, React, or heavy external runtime libraries — ensuring lightning-fast load times.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure, accessibility metadata, OpenGraph tags |
| **CSS3** | Custom CSS properties (design tokens), Glassmorphism, animations, responsive layout |
| **Vanilla JavaScript (ES6+)** | Navigation drawer, active scroll spy, theme toggle, copy-to-clipboard, form handling |
| **SVG** | Scalable, high-resolution vector icons and project mockups |
| **Google Fonts** | `Plus Jakarta Sans` for clean typography and `Fira Code` for tech tags |

---

## 📁 Folder Structure

```
portfolio/
├── index.html              # Main HTML document
├── style.css               # Design system, themes, and responsive media queries
├── script.js               # Vanilla JavaScript client interactivity
├── README.md               # Project documentation & deployment guide
└── assets/
    └── images/
        ├── profile.svg        # Scalable developer avatar placeholder
        ├── interviewai.svg    # Mockup graphic for InterviewAI
        ├── mutualfund.svg     # Mockup graphic for Mutual Fund Analytics
        └── fraud-detect.svg   # Mockup graphic for Credit Card Fraud Detection
```

---

## 💻 How to Run Locally

You can run this project locally without any complex build tools or dependencies:

### Method 1: Direct File Open
1. Clone or download this repository.
2. Double-click `index.html` or right-click and choose **Open with > Chrome / Firefox / Edge**.

### Method 2: VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The site will launch automatically at `http://127.0.0.1:5500`.

### Method 3: Python Local HTTP Server
Run the following command in your terminal within the project directory:

```bash
# Python 3
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

---

## 🌐 GitHub Pages Deployment Instructions

To publish this portfolio for free using **GitHub Pages**:

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of developer portfolio"
   ```

2. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/farhandev-20/portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click on **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and root `/ (root)`.
   - Click **Save**.
   - After 1–2 minutes, your site will be live at:
     `https://farhandev-20.github.io/portfolio/`

---

## 👤 Author

**Farhan Attar**
- **Role**: Computer Engineering Student | Aspiring Software Developer
- **Email**: [farhan.attar.dev@gmail.com](mailto:farhan.attar.dev@gmail.com)
- **GitHub**: [@farhandev-20](https://github.com/farhandev-20)
- **LinkedIn**: [Farhan Attar](https://linkedin.com/in/farhan-attar)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

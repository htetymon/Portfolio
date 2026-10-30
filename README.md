# Htet Yee Mon — Portfolio

A responsive, single-page portfolio built with HTML, CSS, and vanilla JavaScript. It introduces Htet Yee Mon, describes current skills and learning goals, presents practice projects, and provides contact information.

## Run the website

The site has no build step or package dependencies.

1. Clone or download this repository.
2. Open `html/index.html` in a browser.

For a local server, run this command from the repository root:

```sh
python -m http.server 8000
```

Then open <http://localhost:8000/html/>. Use the same local server address when checking saved theme preferences.

## Features

- Responsive Home, About, Skills, Projects, and Contact sections with anchor navigation.
- Mobile navigation button with expanded state, Escape-to-close support, and keyboard focus moved to the selected section.
- Light and dark themes. The selected theme is saved in `localStorage` and restored on later visits.
- Project cards rendered from a JavaScript array of objects, with All, Websites, and JavaScript Apps filters and category counts.
- Contact form validation for required name, email, and message fields. The name must contain at least 2 characters; the trimmed message must contain 20–500 characters. The form includes inline errors, an accessible live character count, and a demo confirmation that does not send or save the message.
- Back-to-top control, skip link, visible keyboard focus styles, and an email link in the footer.

## Known limitations

- Project cards are practice examples. Their current URLs point to `https://example.com/` and should be replaced with real source or demo links before submission.
- The contact form is frontend-only. It does not send email, save messages, or contact a server. Use the displayed email link to get in touch.
- The repository does not include desktop and mobile screenshots requested by the project brief.
- The image and icon files are included under `assets/images/`, but their source and license details are not recorded. Add the correct credits before redistributing assets that require attribution.
- The responsive, keyboard, and screen-reader acceptance checks have not been documented as completed.

## Credits

- Portfolio content and implementation: Htet Yee Mon.
- Images and technology icons: local files in `assets/images/`. Original sources and licenses were not provided with the project files; verify and add them here before submission.

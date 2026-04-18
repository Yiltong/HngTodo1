# HngTodo1
✅ Advanced Todo Card

 Links

Live URL: (https://yiltong.github.io/HngTodo1/)
GitHub Repo: (https://github.com/Yiltong/HngTodo1)


PREVIEW
A single todo card supporting edit mode, status transitions, priority indicators, expand/collapse, and live overdue detection.


 FEATURES
Edit Mode
Clicking Edit opens an inline form pre-populated with the current card values. Fields include title, description, priority, and due date. Save commits the changes; Cancel restores the previous state. On close, focus returns to the Edit button.


 Status Control
A styled dropdown lets the user switch between Pending, In Progress, and Done. The status is kept in sync with the checkbox at all times — checking the box marks the task Done, unchecking reverts it to Pending.


 Priority Indicator
A coloured left-border stripe and pill badge visually communicate priority level:

🟡 High — amber stripe + amber badge
🔵 Medium — blue stripe + blue badge
🟢 Low — green stripe + green badge
Both update instantly when priority is changed in the edit form.


 Expand / Collapse
Descriptions longer than 120 characters are collapsed by default, showing only the first two lines. A Show more / Show less toggle reveals the full content. The toggle uses aria-expanded and aria-controls for full keyboard and screen reader support.


 Live Time Management
The time chip calculates the difference between the current time and the due date in real time:

Due in 3 days
Due in 4 hours
Due in 45 minutes
Overdue by 2 hours

The chip updates every 45 seconds. When status is Done, the chip is replaced with Completed and stops updating.
 Overdue Indicator
When the due date has passed and the task is not Done, a pulsing red badge appears and the card receives a red border accent.

 Project Structure
todo-card/
├── index.html   — Semantic HTML structure with all required data-testid attributes
├── styles.css   — CSS custom properties, responsive layout, all visual states
└── script.js    — State management, event handling, time logic

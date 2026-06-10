const iconPaths = {
  Overview: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z",
  "AI Builder": "M12 3 14 8l5 2-5 2-2 5-2-5-5-2 5-2 2-5Z",
  Proposals: "M6 3h9l3 3v15H6V3Zm8 1v4h4",
  Clients: "M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 1a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 21a6 6 0 0 1 12 0H2Zm11.5 0a5 5 0 0 1 8.5-3.5V21h-8.5Z",
  Analytics: "M4 19V5m0 14h16M8 15v-4m4 4V7m4 8v-6",
};

const DashboardIcon = ({ type }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={iconPaths[type]} />
  </svg>
);

export default DashboardIcon;

import CMS from "decap-cms-app";

// Import main site styles as a string to inject into the CMS preview pane
// eslint-disable-next-line import/no-unresolved
import styles from "!to-string-loader!css-loader!postcss-loader!sass-loader!../css/main.scss";

import HomePreview from "./cms-preview-templates/home";
import PostPreview from "./cms-preview-templates/post";
import ProductsPreview from "./cms-preview-templates/products";
import ValuesPreview from "./cms-preview-templates/values";
import ContactPreview from "./cms-preview-templates/contact";
import FooterPreview from "./cms-preview-templates/footer";

CMS.registerPreviewStyle(styles, {raw: true});
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("products", ProductsPreview);
CMS.registerPreviewTemplate("values", ValuesPreview);
CMS.registerPreviewTemplate("contact", ContactPreview);
CMS.registerPreviewTemplate("footer", FooterPreview);

const activityStatus = document.getElementById("cms-activity-status");
const activityIcon = document.getElementById("cms-activity-status-icon");
const activityMessage = document.getElementById("cms-activity-status-message");
const netlifyDeployBadge = document.getElementById("netlify-deploy-status-badge");
const netlifyDeployBadgeUrl = "https://api.netlify.com/api/v1/badges/83ffb5ff-9927-498a-840a-49cdadf8a127/deploy-status";
let statusTimeout;

function showActivityStatus(message, isActive) {
  window.clearTimeout(statusTimeout);
  activityMessage.textContent = message;
  activityIcon.textContent = isActive ? "" : "✓";
  activityStatus.classList.toggle("is-active", isActive);
  activityStatus.classList.toggle("is-complete", !isActive);
  activityStatus.style.display = "flex";

  if (!isActive) {
    statusTimeout = window.setTimeout(() => {
      activityStatus.style.display = "none";
    }, 4000);
  }
}

function refreshNetlifyDeployStatus() {
  netlifyDeployBadge.src = `${netlifyDeployBadgeUrl}?refresh=${Date.now()}`;
}

window.setInterval(refreshNetlifyDeployStatus, 60000);

CMS.registerEventListener({
  name: "preSave",
  handler: () => showActivityStatus("Saving changes…", true),
});
CMS.registerEventListener({
  name: "postSave",
  handler: () => showActivityStatus("Changes saved", false),
});
CMS.registerEventListener({
  name: "prePublish",
  handler: () => showActivityStatus("Publishing changes…", true),
});
CMS.registerEventListener({
  name: "postPublish",
  handler: () => {
    showActivityStatus("Changes published", false);
    refreshNetlifyDeployStatus();
  },
});

CMS.init();

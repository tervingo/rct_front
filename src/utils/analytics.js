import ReactGA from 'react-ga4';

// Reemplaza G-XXXXXXXX con tu ID de medición real de GA4
const TRACKING_ID = "G-YSR9SHGDXK";

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

import ReactGA from "react-ga";

const myGa = () => {
  const GA_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_KEY;

  ReactGA.initialize(GA_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
};

export default myGa;

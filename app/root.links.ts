import type { LinksFunction } from "@remix-run/node";
import styles from "~/styles/app.css";

const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export default links;

import { TokenPattern } from "../types";
import { css } from "./css";
import { html } from "./html";
import { javascript } from "./javascript";
import { json } from "./json";
import { markdown } from "./markdown";
import { python } from "./python";
import { typescript } from "./typescript";

export const languages: { [key: string]: TokenPattern } = {
  javascript,
  python,
  typescript,
  html,
  css,
  json,
  markdown,
};

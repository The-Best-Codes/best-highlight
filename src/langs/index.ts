import { TokenPattern } from '../types';
import { javascript } from './javascript';
import { python } from './python';
import { typescript } from './typescript';
import { html } from './html';
import { css } from './css';
import { json } from './json';
import { markdown } from './markdown';

export const languages: { [key: string]: TokenPattern } = {
  javascript,
  python,
  typescript,
  html,
  css,
  json,
  markdown,
};

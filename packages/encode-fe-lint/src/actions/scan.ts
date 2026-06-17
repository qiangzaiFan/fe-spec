import fs from 'fs-extra';
import path from 'path';
import { doESLint, doMarkdownlint, doPrettier, doStylelint } from '../lints';
import type { Config, PKG, ScanOptions, ScanReport, ScanResult } from '../types';
import { PKG_NAME } from '../utils/constants';

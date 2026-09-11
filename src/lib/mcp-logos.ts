import figma from "thesvg/figma";
import github from "thesvg/github";
import googleDrive from "thesvg/google-drive";
import jira from "thesvg/jira";
import linear from "thesvg/linear";
import notion from "thesvg/notion";
import playwright from "thesvg/playwright";
import postgresql from "thesvg/postgresql";
import redis from "thesvg/redis";
import sentry from "thesvg/sentry";
import slack from "thesvg/slack";
import sqlite from "thesvg/sqlite";
import stripe from "thesvg/stripe";
import supabase from "thesvg/supabase";

type BrandIcon = {
  svg: string;
  variants: Record<string, string>;
};

const ICONS: Record<string, BrandIcon> = {
  "figma-mcp": figma,
  "github-mcp": github,
  "google-drive-mcp": googleDrive,
  "jira-mcp": jira,
  "linear-mcp": linear,
  "notion-mcp": notion,
  "playwright-mcp": playwright,
  "postgres-mcp": postgresql,
  "redis-mcp": redis,
  "sentry-mcp": sentry,
  "slack-mcp": slack,
  "sqlite-mcp": sqlite,
  "stripe-mcp": stripe,
  "supabase-mcp": supabase,
};

/** Monochrome brand SVG for a server, or null when it has no official mark.
 *  Uses currentColor so it inherits the tile's tone. */
export function logoSvg(serverId: string): string | null {
  const icon = ICONS[serverId];
  if (!icon) return null;
  const raw = icon.variants?.mono ?? icon.svg;
  if (!raw) return null;
  return raw.replace("<svg ", '<svg fill="currentColor" ');
}

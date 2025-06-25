import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  varchar,
  pgEnum,
  integer
} from "drizzle-orm/pg-core";

// 1. Define the PostgreSQL enum
export const priorityEnum = pgEnum("priority", ["high", "medium", "low"]);

// 2. Define the tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  due: timestamp("due"),
tags: varchar("tags", { length: 255 }).array(), 
  description: text("description").notNull(),
  done: boolean("done").default(false),
  completed: boolean("completed").default(false),
  category: varchar("category", { length: 100 }),
  priority: priorityEnum("priority").notNull(), // ⛔️ no default
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
    //categoryId:integer("category_id"), // ✅ link to categories
    categoryIdInt: integer("category_id_int"),
});
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(), // if categories are user-specific
  createdAt: timestamp("created_at").defaultNow(),
});
export const settings = pgTable("settings", {
  userId: text("user_id").primaryKey(),
  darkMode: boolean("dark_mode").default(false),
  language: text("language").default("English"),
  notificationsEnabled: boolean("notifications_enabled").default(true),
});
-- ============================================================
-- HireAI Job Portal - MySQL Database Setup Script
-- Run this BEFORE starting the Django backend
-- MySQL Password: Rakesh@123
-- ============================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS job_portal_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Step 2: Use the database
USE job_portal_db;

-- Step 3: Grant privileges (run as root if needed)
-- GRANT ALL PRIVILEGES ON job_portal_db.* TO 'root'@'localhost' IDENTIFIED BY 'Rakesh@123';
-- FLUSH PRIVILEGES;

-- ============================================================
-- All tables below are auto-created by Django migrations.
-- Run: python manage.py migrate
-- Then seed initial data with the commands below.
-- ============================================================

-- Optional: Seed job categories after running migrations
-- (Run these after: python manage.py migrate)

/*
INSERT INTO jobs_category (name, slug, icon, job_count) VALUES
  ('Technology',    'technology',    '💻', 0),
  ('Design',        'design',        '🎨', 0),
  ('Marketing',     'marketing',     '📢', 0),
  ('Finance',       'finance',       '💰', 0),
  ('Healthcare',    'healthcare',    '🏥', 0),
  ('Education',     'education',     '📚', 0),
  ('Sales',         'sales',         '📊', 0),
  ('Operations',    'operations',    '⚙️',  0),
  ('HR',            'hr',            '👥', 0),
  ('Legal',         'legal',         '⚖️',  0);
*/

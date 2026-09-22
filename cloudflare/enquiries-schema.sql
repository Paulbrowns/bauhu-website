-- Bauhu website enquiry database
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  classification TEXT NOT NULL DEFAULT 'Unreviewed',
  owner TEXT,
  internal_notes TEXT,

  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_contact TEXT,
  consent INTEGER NOT NULL DEFAULT 0,

  site_location TEXT,
  site_lat REAL,
  site_lng REAL,
  site_source TEXT,

  project_route TEXT,
  intended_use TEXT,
  bedrooms_scale TEXT,
  land_status TEXT,
  planning_status TEXT,
  budget TEXT,
  target_start TEXT,
  decision_role TEXT,
  project_notes TEXT,

  home_choice TEXT,
  model_slug TEXT,
  model_name TEXT,

  placement_confirmed INTEGER NOT NULL DEFAULT 0,
  placement_lat REAL,
  placement_lng REAL,
  placement_rotation REAL,

  attribution_source TEXT,
  attribution_medium TEXT,
  attribution_campaign TEXT,
  attribution_content TEXT,
  attribution_term TEXT,
  landing_page TEXT,
  referrer TEXT,
  source_url TEXT,

  message TEXT,
  raw_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enquiry_files (
  id TEXT PRIMARY KEY,
  enquiry_id TEXT NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_classification ON enquiries(classification);
CREATE INDEX IF NOT EXISTS idx_enquiries_source ON enquiries(attribution_source);
CREATE INDEX IF NOT EXISTS idx_enquiry_files_enquiry_id ON enquiry_files(enquiry_id);

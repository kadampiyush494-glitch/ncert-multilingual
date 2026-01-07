/*
  # Initial Schema for NCERT Doubt Solver

  ## Overview
  This migration creates the foundational database schema for the NCERT AI Doubt Solver system.
  It includes tables for managing user sessions, chat history, feedback, and analytics.

  ## New Tables

  ### 1. `user_profiles`
  Stores user information and preferences
  - `id` (uuid, primary key)
  - `name` (text, optional)
  - `role` (text) - 'student' or 'admin'
  - `grade` (text, optional) - '5' through '10'
  - `preferred_language` (text)
  - `preferred_subject` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `chat_sessions`
  Tracks individual chat sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `title` (text)
  - `grade` (text)
  - `subject` (text)
  - `language` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `chat_messages`
  Stores all chat messages with AI responses
  - `id` (uuid, primary key)
  - `session_id` (uuid, references chat_sessions)
  - `role` (text) - 'user' or 'assistant'
  - `content` (text)
  - `confidence_level` (text, optional) - 'high', 'medium', 'low'
  - `is_out_of_scope` (boolean)
  - `citations` (jsonb, optional) - array of citation objects
  - `created_at` (timestamptz)

  ### 4. `message_feedback`
  Captures user feedback on AI responses
  - `id` (uuid, primary key)
  - `message_id` (uuid, references chat_messages)
  - `session_id` (uuid, references chat_sessions)
  - `feedback_type` (text) - 'helpful', 'incorrect', 'wrong-language'
  - `comment` (text, optional)
  - `created_at` (timestamptz)

  ### 5. `system_analytics`
  Stores system performance metrics
  - `id` (uuid, primary key)
  - `metric_type` (text) - 'latency', 'accuracy', 'query_count', etc.
  - `metric_value` (numeric)
  - `metadata` (jsonb) - additional context
  - `recorded_at` (timestamptz)

  ### 6. `uploaded_content`
  Tracks uploaded NCERT content
  - `id` (uuid, primary key)
  - `grade` (text)
  - `subject` (text)
  - `language` (text)
  - `file_name` (text)
  - `file_type` (text) - 'pdf' or 'image'
  - `processing_status` (text) - 'pending', 'processing', 'completed', 'failed'
  - `chunk_count` (integer)
  - `uploaded_at` (timestamptz)
  - `processed_at` (timestamptz, optional)

  ## Security
  - RLS enabled on all tables
  - Policies configured for authenticated access
  - Students can only access their own data
  - Admins have broader read access for analytics

  ## Notes
  - All timestamps use timestamptz for timezone awareness
  - JSONB used for flexible citation and metadata storage
  - Indexes added on foreign keys and frequently queried columns
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  role text NOT NULL CHECK (role IN ('student', 'admin')),
  grade text CHECK (grade IN ('5', '6', '7', '8', '9', '10')),
  preferred_language text NOT NULL,
  preferred_subject text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New Chat',
  grade text NOT NULL,
  subject text NOT NULL,
  language text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  confidence_level text CHECK (confidence_level IN ('high', 'medium', 'low')),
  is_out_of_scope boolean DEFAULT false,
  citations jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES chat_messages(id) ON DELETE CASCADE,
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('helpful', 'incorrect', 'wrong-language')),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS system_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb,
  recorded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS uploaded_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade text NOT NULL,
  subject text NOT NULL,
  language text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('pdf', 'image')),
  processing_status text NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  chunk_count integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_message_feedback_message_id ON message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_system_analytics_metric_type ON system_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_system_analytics_recorded_at ON system_analytics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_uploaded_content_status ON uploaded_content(processing_status);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view messages from own sessions"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own sessions"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view feedback from own sessions"
  ON message_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = message_feedback.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert feedback for own sessions"
  ON message_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = message_feedback.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all analytics"
  ON system_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert analytics"
  ON system_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all uploaded content"
  ON uploaded_content FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert uploaded content"
  ON uploaded_content FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update uploaded content"
  ON uploaded_content FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

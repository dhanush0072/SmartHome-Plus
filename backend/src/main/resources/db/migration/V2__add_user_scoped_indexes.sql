CREATE INDEX idx_rooms_user ON rooms (user_id);
CREATE INDEX idx_devices_room ON devices (room_id);
CREATE INDEX idx_devices_user ON devices (user_id);
CREATE INDEX idx_automation_user ON automation_rules (user_id);
CREATE INDEX idx_security_events_user_time ON security_events (user_id, occurred_at);
CREATE INDEX idx_energy_records_user_time ON energy_records (user_id, recorded_at);
CREATE INDEX idx_notifications_user_time ON notifications (user_id, created_at);
CREATE INDEX idx_feedback_user_time ON feedback (user_id, created_at);
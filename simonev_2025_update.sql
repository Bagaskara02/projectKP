-- =====================================================
-- SIMONEV 2025 - DATABASE UPDATE
-- Menambahkan: users, audit_logs, tahun, file_path
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- =====================================================
-- 1. TABEL USERS (Untuk Autentikasi Pegawai)
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `role` ENUM('admin', 'operator', 'viewer') DEFAULT 'operator',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`nama`, `email`, `password`, `jabatan`, `role`) VALUES
('Administrator', 'admin@pn-yogyakarta.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Sistem', 'admin'),
('Operator SIMONEV', 'operator@pn-yogyakarta.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff TI', 'operator')
ON DUPLICATE KEY UPDATE `nama` = VALUES(`nama`);

-- =====================================================
-- 2. TABEL AUDIT LOGS (Activity Log)
-- =====================================================
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT 'Guest',
  `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'IMPORT', 'EXPORT', 'BACKUP', 'RESTORE') NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_data` JSON DEFAULT NULL,
  `new_data` JSON DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_action` (`action`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- 3. TAMBAH KOLOM TAHUN (Multi-Year Support)
-- =====================================================
ALTER TABLE `detail_perkara` 
  ADD COLUMN IF NOT EXISTS `tahun` YEAR DEFAULT 2025 AFTER `indikator_id`,
  ADD COLUMN IF NOT EXISTS `file_path` varchar(255) DEFAULT NULL AFTER `status_akhir`,
  ADD INDEX IF NOT EXISTS `idx_tahun` (`tahun`);

ALTER TABLE `detail_survei`
  ADD COLUMN IF NOT EXISTS `tahun` YEAR DEFAULT 2025 AFTER `indikator_id`,
  ADD COLUMN IF NOT EXISTS `file_path` varchar(255) DEFAULT NULL AFTER `link_bukti`,
  ADD INDEX IF NOT EXISTS `idx_tahun` (`tahun`);

ALTER TABLE `detail_nilai`
  ADD COLUMN IF NOT EXISTS `tahun` YEAR DEFAULT 2025 AFTER `indikator_id`,
  ADD COLUMN IF NOT EXISTS `file_path` varchar(255) DEFAULT NULL AFTER `link_bukti`,
  ADD INDEX IF NOT EXISTS `idx_tahun` (`tahun`);

-- =====================================================
-- 4. TABEL UPLOADED FILES (Track uploaded files)
-- =====================================================
CREATE TABLE IF NOT EXISTS `uploaded_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `related_table` varchar(50) DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_related` (`related_table`, `related_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

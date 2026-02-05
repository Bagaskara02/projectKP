-- phpMyAdmin SQL Dump
-- Database: `simonev_2025`
-- Restructured: Separate tables for each indicator type
-- Date: 2026-02-02

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simonev_2025`
--

-- --------------------------------------------------------
-- Drop existing tables if restructuring
-- --------------------------------------------------------
-- DROP TABLE IF EXISTS `detail_kinerja`;

-- --------------------------------------------------------
-- 1. TABEL PERKARA (Indikator 1.1 - 1.14)
-- Untuk data perkara pengadilan
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `detail_perkara` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indikator_id` varchar(10) NOT NULL COMMENT 'ID indikator (1.1, 1.2, dst)',
  `nomor_perkara` varchar(100) NOT NULL COMMENT 'Nomor perkara',
  `klasifikasi` varchar(100) DEFAULT NULL COMMENT 'Jenis/klasifikasi perkara',
  `tgl_register` date DEFAULT NULL COMMENT 'Tanggal register perkara',
  `tgl_sidang_pertama` date DEFAULT NULL COMMENT 'Tanggal sidang pertama',
  `tgl_putus` date DEFAULT NULL COMMENT 'Tanggal putusan',
  `waktu_proses` varchar(50) DEFAULT NULL COMMENT 'Waktu proses (hari)',
  `status_teknis` varchar(100) DEFAULT NULL COMMENT 'Status teknis (Minutasi, dsb)',
  `status_akhir` varchar(100) DEFAULT NULL COMMENT 'Status akhir untuk statistik kartu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_indikator` (`indikator_id`),
  INDEX `idx_tgl_register` (`tgl_register`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 2. TABEL SURVEI (Indikator 2.1)
-- Untuk data Indeks Kepuasan Masyarakat (IKM)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `detail_survei` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indikator_id` varchar(10) NOT NULL DEFAULT '2.1' COMMENT 'ID indikator survei',
  `triwulan` varchar(20) NOT NULL COMMENT 'Triwulan 1/2/3/4',
  `jumlah_responden` int(11) NOT NULL DEFAULT 0 COMMENT 'Jumlah responden survei',
  `nilai_ikm` decimal(10,4) NOT NULL DEFAULT 0.0000 COMMENT 'Nilai IKM (contoh: 3.6868)',
  `konversi_interval_ikm` decimal(10,2) GENERATED ALWAYS AS (`nilai_ikm` * 25) STORED COMMENT 'Konversi IKM (nilai_ikm x 25)',
  `link_bukti` varchar(500) DEFAULT NULL COMMENT 'URL link bukti survei',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_indikator` (`indikator_id`),
  INDEX `idx_triwulan` (`triwulan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3. TABEL NILAI (Indikator 3.1 - 3.4)
-- Untuk data nilai/skor dari sistem eksternal
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `detail_nilai` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `indikator_id` varchar(10) NOT NULL COMMENT 'ID indikator (3.1, 3.2, 3.3, 3.4)',
  `keterangan` varchar(255) NOT NULL COMMENT 'Keterangan/deskripsi nilai',
  `nilai_akhir` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Nilai akhir',
  `periode` varchar(20) DEFAULT NULL COMMENT 'Periode nilai',
  `link_bukti` varchar(500) DEFAULT NULL COMMENT 'URL link bukti',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX `idx_indikator` (`indikator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- MIGRASI DATA (jika ada data lama di detail_kinerja)
-- Uncomment jika ingin migrasi data existing
-- --------------------------------------------------------
/*
-- Migrasi data perkara
INSERT INTO `detail_perkara` (indikator_id, nomor_perkara, klasifikasi, tgl_register, tgl_sidang_pertama, tgl_putus, waktu_proses, status_teknis, status_akhir, created_at)
SELECT indikator_id, nomor_perkara, klasifikasi, tgl_register, tgl_sidang_pertama, tgl_putus, waktu_proses, status_teknis, status_akhir, created_at
FROM `detail_kinerja` WHERE indikator_id LIKE '1.%';

-- Migrasi data survei
INSERT INTO `detail_survei` (indikator_id, triwulan, jumlah_responden, nilai_ikm, link_bukti, created_at)
SELECT indikator_id, keterangan, jumlah_responden, nilai_ikm, status_teknis, created_at
FROM `detail_kinerja` WHERE indikator_id = '2.1';

-- Migrasi data nilai
INSERT INTO `detail_nilai` (indikator_id, keterangan, nilai_akhir, created_at)
SELECT indikator_id, keterangan, nilai_akhir, created_at
FROM `detail_kinerja` WHERE indikator_id LIKE '3.%';
*/

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

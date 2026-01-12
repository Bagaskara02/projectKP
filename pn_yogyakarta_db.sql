-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 12 Jan 2026 pada 04.16
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pn_yogyakarta_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `m_pegawai`
--

CREATE TABLE `m_pegawai` (
  `pegawai_id` int(11) NOT NULL,
  `nip` varchar(20) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `jabatan` enum('Ketua','Wakil Ketua','Hakim','Panitera','Panitera Pengganti','Jurusita','Staff') NOT NULL,
  `nilai_ip_asn` decimal(5,2) DEFAULT 0.00 COMMENT 'IKU 3.1: Indeks Profesionalitas ASN (Max 100)',
  `status_aktif` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `m_pegawai`
--

INSERT INTO `m_pegawai` (`pegawai_id`, `nip`, `nama_lengkap`, `jabatan`, `nilai_ip_asn`, `status_aktif`) VALUES
(1, '198001012005011001', 'Budi Santoso, S.H., M.H.', 'Hakim', 85.50, 1),
(2, '198205052006042002', 'Siti Aminah, S.H.', 'Hakim', 90.00, 1),
(3, '197512121998031003', 'Rahmat Hidayat, S.H.', 'Panitera', 88.00, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_eksekusi`
--

CREATE TABLE `t_eksekusi` (
  `eksekusi_id` int(11) NOT NULL,
  `perkara_id` int(11) NOT NULL,
  `nomor_permohonan` varchar(50) DEFAULT NULL,
  `tgl_permohonan` date DEFAULT NULL,
  `tgl_selesai` date DEFAULT NULL,
  `status_eksekusi` enum('Permohonan','Aanmaning','Sita Eksekusi','Lelang','Selesai','Non-Executable','Dicabut') DEFAULT 'Permohonan'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_kinerja_admin`
--

CREATE TABLE `t_kinerja_admin` (
  `id` int(11) NOT NULL,
  `perkara_id` int(11) NOT NULL,
  `tgl_upload_direktori` date DEFAULT NULL COMMENT 'Wajib 1x24 jam setelah putus/minutasi',
  `tgl_kirim_salinan` date DEFAULT NULL,
  `metode_kirim` enum('Manual/Jurusita','Pos Tercatat','Elektronik') DEFAULT 'Manual/Jurusita',
  `tgl_terima_banding` date DEFAULT NULL,
  `tgl_beritahu_banding` date DEFAULT NULL COMMENT 'Harus segera diberitahukan ke pihak'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_kinerja_admin`
--

INSERT INTO `t_kinerja_admin` (`id`, `perkara_id`, `tgl_upload_direktori`, `tgl_kirim_salinan`, `metode_kirim`, `tgl_terima_banding`, `tgl_beritahu_banding`) VALUES
(1, 1, '2025-04-05', '2025-04-06', 'Elektronik', NULL, NULL),
(2, 2, NULL, '2025-07-01', 'Manual/Jurusita', NULL, NULL),
(3, 4, '2025-03-05', '2025-03-05', 'Elektronik', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_laporan_bulanan`
--

CREATE TABLE `t_laporan_bulanan` (
  `id` int(11) NOT NULL,
  `periode_bulan` date NOT NULL COMMENT 'Contoh: 2025-01-01',
  `nilai_ikm` decimal(4,2) DEFAULT NULL COMMENT 'Skala 1.00 - 4.00',
  `nilai_ikpa` decimal(5,2) DEFAULT NULL COMMENT 'Skala 0 - 100',
  `realisasi_anggaran_persen` decimal(5,2) DEFAULT NULL,
  `nilai_ipa` decimal(4,2) DEFAULT NULL COMMENT 'Indeks Pengelolaan Aset (Skala 1-4)',
  `catatan_evaluasi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_laporan_bulanan`
--

INSERT INTO `t_laporan_bulanan` (`id`, `periode_bulan`, `nilai_ikm`, `nilai_ikpa`, `realisasi_anggaran_persen`, `nilai_ipa`, `catatan_evaluasi`) VALUES
(1, '2025-01-01', 3.85, 98.50, 8.50, 3.50, NULL),
(2, '2025-02-01', 3.90, 99.00, 15.20, 3.60, NULL),
(3, '2025-03-01', 3.88, 97.50, 22.80, 3.60, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_mediasi_rj`
--

CREATE TABLE `t_mediasi_rj` (
  `id` int(11) NOT NULL,
  `perkara_id` int(11) NOT NULL,
  `wajib_mediasi` tinyint(1) DEFAULT 0,
  `hasil_mediasi` enum('Tidak Mediasi','Berhasil','Berhasil Sebagian','Gagal') DEFAULT 'Tidak Mediasi',
  `is_rj_eligible` tinyint(1) DEFAULT 0 COMMENT 'Apakah memenuhi syarat RJ?',
  `hasil_rj` enum('N/A','Berhasil RJ','Gagal RJ') DEFAULT 'N/A'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_mediasi_rj`
--

INSERT INTO `t_mediasi_rj` (`id`, `perkara_id`, `wajib_mediasi`, `hasil_mediasi`, `is_rj_eligible`, `hasil_rj`) VALUES
(1, 1, 1, 'Gagal', 0, 'N/A'),
(2, 3, 1, 'Berhasil', 0, 'N/A'),
(3, 4, 0, 'Tidak Mediasi', 1, 'Gagal RJ');

-- --------------------------------------------------------

--
-- Struktur dari tabel `t_perkara`
--

CREATE TABLE `t_perkara` (
  `perkara_id` int(11) NOT NULL,
  `nomor_perkara` varchar(50) NOT NULL,
  `jenis_perkara` enum('Perdata Gugatan','Perdata Permohonan','Pidana Biasa','Pidana Singkat','Pidana Anak','Tipikor','PHI') NOT NULL,
  `tanggal_register` date NOT NULL,
  `tanggal_putus` date DEFAULT NULL,
  `tanggal_minutasi` date DEFAULT NULL COMMENT 'Jika (Tgl Minutasi - Tgl Register) > 5 bulan, maka MERAH',
  `hakim_ketua_id` int(11) DEFAULT NULL,
  `panitera_id` int(11) DEFAULT NULL,
  `is_ecourt` tinyint(1) DEFAULT 0 COMMENT 'IKU 1.10: 1=Ya, 0=Tidak',
  `is_eberpadu` tinyint(1) DEFAULT 0 COMMENT 'IKU 1.11: Khusus Pidana',
  `status_akhir` enum('Proses','Putus','Minutasi','Banding','Kasasi','PK','Cabut') DEFAULT 'Proses'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `t_perkara`
--

INSERT INTO `t_perkara` (`perkara_id`, `nomor_perkara`, `jenis_perkara`, `tanggal_register`, `tanggal_putus`, `tanggal_minutasi`, `hakim_ketua_id`, `panitera_id`, `is_ecourt`, `is_eberpadu`, `status_akhir`) VALUES
(1, '1/Pdt.G/2025/PN Yyk', 'Perdata Gugatan', '2025-01-02', '2025-04-02', '2025-04-05', 1, 3, 1, 0, 'Minutasi'),
(2, '2/Pid.B/2025/PN Yyk', 'Pidana Biasa', '2025-01-05', '2025-06-10', '2025-06-25', 2, 3, 0, 0, 'Minutasi'),
(3, '3/Pdt.G/2025/PN Yyk', 'Perdata Gugatan', '2025-01-10', '2025-02-10', '2025-02-12', 1, 3, 1, 0, 'Cabut'),
(4, '1/Pid.Sus-Anak/2025/PN Yyk', 'Pidana Anak', '2025-02-01', '2025-03-01', '2025-03-05', 2, 3, 0, 1, 'Minutasi');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `m_pegawai`
--
ALTER TABLE `m_pegawai`
  ADD PRIMARY KEY (`pegawai_id`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- Indeks untuk tabel `t_eksekusi`
--
ALTER TABLE `t_eksekusi`
  ADD PRIMARY KEY (`eksekusi_id`),
  ADD KEY `perkara_id` (`perkara_id`);

--
-- Indeks untuk tabel `t_kinerja_admin`
--
ALTER TABLE `t_kinerja_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `perkara_id` (`perkara_id`);

--
-- Indeks untuk tabel `t_laporan_bulanan`
--
ALTER TABLE `t_laporan_bulanan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `t_mediasi_rj`
--
ALTER TABLE `t_mediasi_rj`
  ADD PRIMARY KEY (`id`),
  ADD KEY `perkara_id` (`perkara_id`);

--
-- Indeks untuk tabel `t_perkara`
--
ALTER TABLE `t_perkara`
  ADD PRIMARY KEY (`perkara_id`),
  ADD UNIQUE KEY `nomor_perkara` (`nomor_perkara`),
  ADD KEY `hakim_ketua_id` (`hakim_ketua_id`),
  ADD KEY `panitera_id` (`panitera_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `m_pegawai`
--
ALTER TABLE `m_pegawai`
  MODIFY `pegawai_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `t_eksekusi`
--
ALTER TABLE `t_eksekusi`
  MODIFY `eksekusi_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `t_kinerja_admin`
--
ALTER TABLE `t_kinerja_admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `t_laporan_bulanan`
--
ALTER TABLE `t_laporan_bulanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `t_mediasi_rj`
--
ALTER TABLE `t_mediasi_rj`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `t_perkara`
--
ALTER TABLE `t_perkara`
  MODIFY `perkara_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `t_eksekusi`
--
ALTER TABLE `t_eksekusi`
  ADD CONSTRAINT `t_eksekusi_ibfk_1` FOREIGN KEY (`perkara_id`) REFERENCES `t_perkara` (`perkara_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `t_kinerja_admin`
--
ALTER TABLE `t_kinerja_admin`
  ADD CONSTRAINT `t_kinerja_admin_ibfk_1` FOREIGN KEY (`perkara_id`) REFERENCES `t_perkara` (`perkara_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `t_mediasi_rj`
--
ALTER TABLE `t_mediasi_rj`
  ADD CONSTRAINT `t_mediasi_rj_ibfk_1` FOREIGN KEY (`perkara_id`) REFERENCES `t_perkara` (`perkara_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `t_perkara`
--
ALTER TABLE `t_perkara`
  ADD CONSTRAINT `t_perkara_ibfk_1` FOREIGN KEY (`hakim_ketua_id`) REFERENCES `m_pegawai` (`pegawai_id`),
  ADD CONSTRAINT `t_perkara_ibfk_2` FOREIGN KEY (`panitera_id`) REFERENCES `m_pegawai` (`pegawai_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

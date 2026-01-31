-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Jan 2026 pada 12.19
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
-- Database: `simonev_2025`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `detail_kinerja`
--

CREATE TABLE `detail_kinerja` (
  `id` int(11) NOT NULL,
  `indikator_id` varchar(10) NOT NULL,
  `periode` varchar(20) NOT NULL,
  `nomor_perkara` varchar(100) DEFAULT NULL,
  `klasifikasi` varchar(100) DEFAULT NULL,
  `tgl_register` date DEFAULT NULL,
  `tgl_sidang_pertama` date DEFAULT NULL,
  `tgl_putus` date DEFAULT NULL,
  `waktu_proses` varchar(50) DEFAULT NULL,
  `status_akhir` varchar(100) DEFAULT NULL,
  `status_teknis` varchar(100) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `jumlah_responden` int(11) DEFAULT 0,
  `nilai_ikm` decimal(10,2) DEFAULT 0.00,
  `nilai_akhir` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `detail_kinerja`
--
ALTER TABLE `detail_kinerja`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `detail_kinerja`
--
ALTER TABLE `detail_kinerja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

<?php
/**
 * KONFIGURASI API e-Berpadu
 * 
 * Isi nilai-nilai di bawah ini setelah menerima informasi dari Tim IT e-Berpadu
 */

return [

    // URL API e-Berpadu (contoh: https://eberpadu.mahkamahagung.go.id/api/v1)
    'api_url' => 'https://eberpadu.example.com/api/v1',

    // API Key dari Tim IT e-Berpadu
    'api_key' => 'ISI_API_KEY_DARI_TIM_IT_EBERPADU',

    // Token/Bearer (jika menggunakan Bearer token)
    'bearer_token' => '',

    'endpoints' => [
        'perkara' => '/perkara',           // Endpoint untuk data perkara
        'perkara_detail' => '/perkara/{id}', // Detail perkara
        'login' => '/auth/login',           // Endpoint login (jika perlu)
    ],

    // =====================================================
    // MAPPING FIELD - Sesuaikan dengan response API e-Berpadu
    // =====================================================
    // Format: 'field_simonev' => 'field_eberpadu'
    'field_mapping' => [
        'nomor_perkara' => 'nomor_perkara',
        'klasifikasi' => 'jenis_perkara',
        'tgl_register' => 'tanggal_register',
        'tgl_sidang_pertama' => 'tanggal_sidang_pertama',
        'tgl_putus' => 'tanggal_putusan',
        'waktu_proses' => 'lama_proses',
        'status_teknis' => 'status',
        'status_akhir' => 'status_akhir',
    ],

    // =====================================================
    // MAPPING INDIKATOR - Sesuaikan dengan jenis perkara
    // =====================================================
    'indikator_mapping' => [
        'Perdata Gugatan' => '1.2',
        'Pidana Biasa' => '1.3',
        'PHI' => '1.4',
        'Tipikor' => '1.5',
        // Tambahkan mapping lainnya sesuai kebutuhan
    ],

    // =====================================================
    // PENGATURAN LAINNYA
    // =====================================================
    'timeout' => 30,                    // Timeout request (detik)
    'verify_ssl' => true,               // Verifikasi SSL certificate
    'satker_id' => '',                  // ID Satker (jika diperlukan)
    'pengadilan_kode' => 'PN_YYK',      // Kode pengadilan
];

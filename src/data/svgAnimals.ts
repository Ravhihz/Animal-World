/**
 * SVG Animal Coloring Data — v3
 *
 * Path dibuat dengan kurva Bezier yang smooth dan proporsi yang benar.
 * ViewBox: 0 0 200 200 (koordinat relatif, lebih mudah dikontrol)
 *
 * Setiap hewan adalah tampak depan/samping yang kartun dan ramah anak.
 */

export interface ColorRegion {
  id: string;
  label: string;
  defaultColor: string;
  strokeColor: string;
  strokeWidth: number;
  path: string;
  zIndex?: number;
}

export interface SvgAnimalData {
  viewBox: string;
  regions: ColorRegion[];
}

// ─── SINGA (tampak depan, kartun lucu) ───────────────────────────────────────
const LION: SvgAnimalData = {
  viewBox: '0 0 200 200',
  regions: [
    // Surai — lingkaran luar berbentuk bunga/matahari
    {
      id: 'mane',
      label: 'Surai',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M100 22
        C112 22 118 10 128 14 C138 18 136 30 146 32
        C156 34 162 24 170 30 C178 36 172 48 176 58
        C180 68 192 70 192 80 C192 90 180 92 178 102
        C176 112 184 120 180 130 C176 140 164 138 158 146
        C152 154 154 166 144 170 C134 174 128 164 118 166
        C108 168 106 180 100 180 C94 180 92 168 82 166
        C72 164 66 174 56 170 C46 166 48 154 42 146
        C36 138 24 140 20 130 C16 120 24 112 22 102
        C20 92 8 90 8 80 C8 70 20 68 24 58
        C28 48 22 36 30 30 C38 24 44 34 54 32
        C64 30 62 18 72 14 C82 10 88 22 100 22 Z`,
    },
    // Wajah
    {
      id: 'face',
      label: 'Wajah',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 2,
      path: `M100 42
        C120 42 138 54 144 72
        C150 88 148 108 140 122
        C132 136 118 144 100 144
        C82 144 68 136 60 122
        C52 108 50 88 56 72
        C62 54 80 42 100 42 Z`,
    },
    // Telinga kiri
    {
      id: 'ear_left',
      label: 'Telinga kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M56 60 C50 48 55 36 64 34 C72 32 80 40 78 52 C72 54 64 56 56 60 Z`,
    },
    // Telinga kanan
    {
      id: 'ear_right',
      label: 'Telinga kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M144 60 C150 48 145 36 136 34 C128 32 120 40 122 52 C128 54 136 56 144 60 Z`,
    },
    // Mata kiri
    {
      id: 'eye_left',
      label: 'Mata kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M76 80 C76 72 82 68 88 70 C94 72 96 80 94 86 C92 92 86 94 82 90 C78 86 76 84 76 80 Z`,
    },
    // Pupil kiri
    {
      id: 'pupil_left',
      label: 'Pupil kiri',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 5,
      path: `M82 80 C82 76 84 74 86 75 C88 76 89 79 88 82 C87 84 85 85 83 84 C81 83 82 81 82 80 Z`,
    },
    // Mata kanan
    {
      id: 'eye_right',
      label: 'Mata kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M124 80 C124 72 118 68 112 70 C106 72 104 80 106 86 C108 92 114 94 118 90 C122 86 124 84 124 80 Z`,
    },
    // Pupil kanan
    {
      id: 'pupil_right',
      label: 'Pupil kanan',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 5,
      path: `M118 80 C118 76 116 74 114 75 C112 76 111 79 112 82 C113 84 115 85 117 84 C119 83 118 81 118 80 Z`,
    },
    // Hidung
    {
      id: 'nose',
      label: 'Hidung',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M94 100 C94 96 97 94 100 94 C103 94 106 96 106 100 C106 104 103 106 100 106 C97 106 94 104 94 100 Z`,
    },
    // Pipi
    {
      id: 'cheeks',
      label: 'Pipi',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 4,
      path: `M66 102 C66 96 72 92 78 94 C84 96 86 103 84 108 C82 113 76 114 72 112 C68 110 66 106 66 102 Z
             M134 102 C134 96 128 92 122 94 C116 96 114 103 116 108 C118 113 124 114 128 112 C132 110 134 106 134 102 Z`,
    },
    // Mulut
    {
      id: 'mouth',
      label: 'Mulut',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M88 112 C92 120 100 124 100 124 C100 124 108 120 112 112`,
    },
    // Dagu (area bawah wajah)
    {
      id: 'chin',
      label: 'Dagu',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M80 128 C86 138 93 142 100 142 C107 142 114 138 120 128 C113 134 107 136 100 136 C93 136 87 134 80 128 Z`,
    },
  ],
};

// ─── GAJAH (tampak depan, kartun) ────────────────────────────────────────────
const ELEPHANT: SvgAnimalData = {
  viewBox: '0 0 200 220',
  regions: [
    // Telinga kiri (besar)
    {
      id: 'ear_left',
      label: 'Telinga kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M55 70 C30 65 15 85 18 108 C20 128 38 142 58 136
             C52 118 50 96 55 70 Z`,
    },
    // Telinga kanan
    {
      id: 'ear_right',
      label: 'Telinga kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M145 70 C170 65 185 85 182 108 C180 128 162 142 142 136
             C148 118 150 96 145 70 Z`,
    },
    // Kepala bulat besar
    {
      id: 'head',
      label: 'Kepala',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 2,
      path: `M100 30 C128 30 150 48 154 72 C158 94 150 116 136 128
             C122 140 112 144 100 144 C88 144 78 140 64 128
             C50 116 42 94 46 72 C50 48 72 30 100 30 Z`,
    },
    // Belalai
    {
      id: 'trunk',
      label: 'Belalai',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M86 128 C80 142 76 160 78 176 C79 185 84 190 90 188
             C96 186 98 178 97 168 C96 155 97 142 100 134
             C103 142 104 155 103 168 C102 178 104 186 110 188
             C116 190 121 185 122 176 C124 160 120 142 114 128 Z`,
    },
    // Mata kiri
    {
      id: 'eye_left',
      label: 'Mata kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M68 76 C68 68 74 64 80 66 C86 68 88 76 86 82
             C84 88 78 90 74 86 C70 82 68 80 68 76 Z`,
    },
    // Pupil kiri
    {
      id: 'pupil_left',
      label: 'Pupil kiri',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 5,
      path: `M74 76 C74 72 77 70 79 72 C81 73 82 76 81 79 C80 81 78 82 76 81 C74 80 74 78 74 76 Z`,
    },
    // Mata kanan
    {
      id: 'eye_right',
      label: 'Mata kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M132 76 C132 68 126 64 120 66 C114 68 112 76 114 82
             C116 88 122 90 126 86 C130 82 132 80 132 76 Z`,
    },
    // Pupil kanan
    {
      id: 'pupil_right',
      label: 'Pupil kanan',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 5,
      path: `M126 76 C126 72 123 70 121 72 C119 73 118 76 119 79 C120 81 122 82 124 81 C126 80 126 78 126 76 Z`,
    },
    // Gading kiri
    {
      id: 'tusk_left',
      label: 'Gading kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M82 136 C76 148 72 164 76 174 C78 180 84 180 88 176 C90 168 88 152 86 136 Z`,
    },
    // Gading kanan
    {
      id: 'tusk_right',
      label: 'Gading kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M118 136 C124 148 128 164 124 174 C122 180 116 180 112 176 C110 168 112 152 114 136 Z`,
    },
  ],
};

// ─── IKAN (tampak samping, kartun) ───────────────────────────────────────────
const FISH: SvgAnimalData = {
  viewBox: '0 0 220 160',
  regions: [
    // Ekor
    {
      id: 'tail',
      label: 'Ekor',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M42 80 C28 58 10 44 6 30 C10 38 22 54 26 72
             C22 74 22 74 22 74 C22 74 22 76 26 78
             C22 90 10 106 6 118 C10 104 28 90 42 80 Z`,
    },
    // Sirip bawah
    {
      id: 'fin_bottom',
      label: 'Sirip bawah',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M90 118 C88 128 92 138 100 142 C105 144 110 142 108 134 C104 128 96 122 90 118 Z`,
    },
    // Sirip atas
    {
      id: 'fin_top',
      label: 'Sirip atas',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M90 42 C88 30 94 18 106 14 C112 12 116 16 112 24 C106 32 96 36 90 42 Z`,
    },
    // Badan utama
    {
      id: 'body',
      label: 'Badan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 2,
      path: `M42 80 C42 54 65 32 100 28 C130 25 158 36 170 54
             C182 70 182 90 170 106 C158 124 130 135 100 132
             C65 128 42 106 42 80 Z`,
    },
    // Sirip dada
    {
      id: 'pectoral_fin',
      label: 'Sirip dada',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M136 78 C136 65 148 56 160 60 C153 66 149 74 152 82
             C149 90 153 98 160 102 C148 106 136 97 136 78 Z`,
    },
    // Mata
    {
      id: 'eye',
      label: 'Mata',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M162 70 C162 60 170 54 178 58 C186 62 188 72 184 80
             C180 86 172 88 166 84 C162 80 162 76 162 70 Z`,
    },
    // Pupil
    {
      id: 'pupil',
      label: 'Pupil',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 5,
      path: `M170 72 C170 68 173 65 176 67 C179 69 180 73 178 77
             C176 80 173 80 171 78 C169 76 170 74 170 72 Z`,
    },
    // Sisik
    {
      id: 'scales',
      label: 'Sisik',
      defaultColor: 'transparent',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M110 50 C116 44 126 46 128 54
             M95 55 C101 48 112 50 114 58
             M82 65 C88 58 99 60 101 68
             M78 80 C84 73 95 75 97 83
             M82 95 C88 88 99 90 101 98
             M95 108 C101 101 112 103 114 111`,
    },
    // Mulut
    {
      id: 'mouth',
      label: 'Mulut',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M196 78 C200 72 200 88 196 82`,
    },
  ],
};

// ─── ELANG (tampak depan sayap terbuka) ──────────────────────────────────────
const EAGLE: SvgAnimalData = {
  viewBox: '0 0 240 200',
  regions: [
    // Sayap kiri
    {
      id: 'wing_left',
      label: 'Sayap kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M108 100 C95 88 72 72 48 64 C28 58 10 60 4 72
             C2 80 8 90 22 95 C40 102 68 100 90 96 Z`,
    },
    // Bulu ujung sayap kiri
    {
      id: 'feathers_left',
      label: 'Bulu sayap kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M12 80 C16 70 26 66 34 72
             M36 88 C40 78 50 74 58 80
             M60 94 C64 84 74 80 82 86
             M84 96 C88 86 98 84 104 90`,
    },
    // Sayap kanan
    {
      id: 'wing_right',
      label: 'Sayap kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M132 100 C145 88 168 72 192 64 C212 58 230 60 236 72
             C238 80 232 90 218 95 C200 102 172 100 150 96 Z`,
    },
    // Bulu ujung sayap kanan
    {
      id: 'feathers_right',
      label: 'Bulu sayap kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M228 80 C224 70 214 66 206 72
             M204 88 C200 78 190 74 182 80
             M180 94 C176 84 166 80 158 86
             M156 96 C152 86 142 84 136 90`,
    },
    // Badan
    {
      id: 'body',
      label: 'Badan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 2,
      path: `M108 95 C108 128 114 158 120 174 C122 180 120 185 120 185
             C120 185 118 190 120 190 C120 190 122 190 120 190
             C120 190 118 185 120 174 C120 190 120 185 120 185
             M120 95 C120 128 126 158 132 174 C134 180 132 185 132 185
             C132 185 128 190 120 190 C112 190 108 185 108 185
             C108 185 106 180 108 174 C114 158 120 128 120 95 Z`,
    },
    // Dada
    {
      id: 'chest',
      label: 'Dada',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M104 95 C104 115 110 135 120 148 C130 135 136 115 136 95
             C130 90 110 90 104 95 Z`,
    },
    // Kepala
    {
      id: 'head',
      label: 'Kepala',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M106 56 C106 36 112 24 120 24 C128 24 134 36 134 56
             C134 72 128 82 120 84 C112 82 106 72 106 56 Z`,
    },
    // Paruh
    {
      id: 'beak',
      label: 'Paruh',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 5,
      path: `M113 70 C110 78 110 86 114 90 C117 94 120 94 120 94
             C120 94 123 94 126 90 C130 86 130 78 127 70 Z`,
    },
    // Mata kiri
    {
      id: 'eye_left',
      label: 'Mata kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 6,
      path: `M108 50 C108 44 113 40 118 42 C123 44 124 50 122 56
             C120 60 115 62 112 58 C109 55 108 52 108 50 Z`,
    },
    // Pupil kiri
    {
      id: 'pupil_left',
      label: 'Pupil kiri',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 7,
      path: `M113 51 C113 48 115 46 117 47 C119 48 120 51 119 54
             C118 56 116 57 114 56 C112 55 113 53 113 51 Z`,
    },
    // Ekor
    {
      id: 'tail',
      label: 'Ekor',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 2,
      path: `M108 185 C104 196 100 205 100 205 C108 202 116 200 120 200
             C124 200 132 202 140 205 C140 205 136 196 132 185 Z`,
    },
  ],
};

// ─── KUPU-KUPU (tampak atas, simetris) ───────────────────────────────────────
const BUTTERFLY: SvgAnimalData = {
  viewBox: '0 0 220 200',
  regions: [
    // Sayap atas kiri
    {
      id: 'wing_top_left',
      label: 'Sayap atas kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M106 100 C98 82 80 55 55 40 C34 27 12 28 4 42
             C-2 54 6 70 20 82 C38 96 68 102 94 104 Z`,
    },
    // Corak besar sayap atas kiri
    {
      id: 'pattern_tl_big',
      label: 'Corak sayap kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M42 60 C42 50 52 46 60 50 C68 54 68 66 60 70 C52 74 42 70 42 60 Z
             M68 82 C68 76 74 72 80 74 C86 76 86 84 80 88 C74 90 68 88 68 82 Z`,
    },
    // Sayap atas kanan
    {
      id: 'wing_top_right',
      label: 'Sayap atas kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M114 100 C122 82 140 55 165 40 C186 27 208 28 216 42
             C222 54 214 70 200 82 C182 96 152 102 126 104 Z`,
    },
    // Corak besar sayap atas kanan
    {
      id: 'pattern_tr_big',
      label: 'Corak sayap kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M178 60 C178 50 168 46 160 50 C152 54 152 66 160 70 C168 74 178 70 178 60 Z
             M152 82 C152 76 146 72 140 74 C134 76 134 84 140 88 C146 90 152 88 152 82 Z`,
    },
    // Sayap bawah kiri
    {
      id: 'wing_bottom_left',
      label: 'Sayap bawah kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M106 108 C94 120 74 138 55 152 C38 164 20 168 14 158
             C8 148 18 132 34 122 C55 110 82 106 106 108 Z`,
    },
    // Corak sayap bawah kiri
    {
      id: 'pattern_bl',
      label: 'Corak bawah kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M50 136 C50 128 58 124 64 128 C70 132 68 142 62 144 C56 146 50 142 50 136 Z`,
    },
    // Sayap bawah kanan
    {
      id: 'wing_bottom_right',
      label: 'Sayap bawah kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M114 108 C126 120 146 138 165 152 C182 164 200 168 206 158
             C212 148 202 132 186 122 C165 110 138 106 114 108 Z`,
    },
    // Corak sayap bawah kanan
    {
      id: 'pattern_br',
      label: 'Corak bawah kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M170 136 C170 128 162 124 156 128 C150 132 152 142 158 144 C164 146 170 142 170 136 Z`,
    },
    // Tubuh (lonjong vertikal)
    {
      id: 'body',
      label: 'Badan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M107 50 C104 55 102 70 102 90 C102 130 104 162 107 174
             C108 178 110 180 110 180 C110 180 112 178 113 174
             C116 162 118 130 118 90 C118 70 116 55 113 50 Z`,
    },
    // Kepala
    {
      id: 'head',
      label: 'Kepala',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 4,
      path: `M103 44 C103 34 107 28 110 28 C113 28 117 34 117 44
             C117 52 113 58 110 58 C107 58 103 52 103 44 Z`,
    },
    // Antena kiri
    {
      id: 'antenna_left',
      label: 'Antena kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 5,
      path: `M106 32 C100 20 90 12 82 11 C88 10 96 15 104 26
             M80 8 C80 5 83 3 86 5 C88 7 87 11 85 12 C82 13 80 11 80 8 Z`,
    },
    // Antena kanan
    {
      id: 'antenna_right',
      label: 'Antena kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 5,
      path: `M114 32 C120 20 130 12 138 11 C132 10 124 15 116 26
             M140 8 C140 5 137 3 134 5 C132 7 133 11 135 12 C138 13 140 11 140 8 Z`,
    },
  ],
};

// ─── KELINCI (tampak depan, lucu) ─────────────────────────────────────────────
const RABBIT: SvgAnimalData = {
  viewBox: '0 0 200 240',
  regions: [
    // Telinga kiri (panjang lancip)
    {
      id: 'ear_left',
      label: 'Telinga kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M75 112 C68 88 65 60 68 36 C70 20 78 10 85 10
             C92 10 98 20 98 36 C98 60 93 90 86 112 Z`,
    },
    // Bagian dalam telinga kiri
    {
      id: 'ear_left_inner',
      label: 'Dalam telinga kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M78 110 C72 88 70 62 72 40 C74 26 79 18 85 18
             C91 18 94 26 94 40 C94 62 90 90 84 110 Z`,
    },
    // Telinga kanan
    {
      id: 'ear_right',
      label: 'Telinga kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M125 112 C132 88 135 60 132 36 C130 20 122 10 115 10
             C108 10 102 20 102 36 C102 60 107 90 114 112 Z`,
    },
    // Bagian dalam telinga kanan
    {
      id: 'ear_right_inner',
      label: 'Dalam telinga kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M122 110 C128 88 130 62 128 40 C126 26 121 18 115 18
             C109 18 106 26 106 40 C106 62 110 90 116 110 Z`,
    },
    // Kepala bulat
    {
      id: 'head',
      label: 'Kepala',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 2,
      path: `M55 148 C55 118 74 100 100 100 C126 100 145 118 145 148
             C145 174 128 192 100 192 C72 192 55 174 55 148 Z`,
    },
    // Badan
    {
      id: 'body',
      label: 'Badan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 1,
      path: `M50 190 C50 220 70 238 100 238 C130 238 150 220 150 190
             C150 172 136 160 100 158 C64 160 50 172 50 190 Z`,
    },
    // Mata kiri
    {
      id: 'eye_left',
      label: 'Mata kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M70 142 C70 134 76 130 82 132 C88 134 90 142 88 148
             C86 154 80 156 76 152 C72 148 70 146 70 142 Z`,
    },
    // Pupil kiri
    {
      id: 'pupil_left',
      label: 'Pupil kiri',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 4,
      path: `M76 143 C76 139 79 137 81 138 C83 139 84 143 83 146 C82 148 80 149 78 148 C76 147 76 145 76 143 Z`,
    },
    // Mata kanan
    {
      id: 'eye_right',
      label: 'Mata kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 2,
      zIndex: 3,
      path: `M130 142 C130 134 124 130 118 132 C112 134 110 142 112 148
             C114 154 120 156 124 152 C128 148 130 146 130 142 Z`,
    },
    // Pupil kanan
    {
      id: 'pupil_right',
      label: 'Pupil kanan',
      defaultColor: '#333',
      strokeColor: '#111',
      strokeWidth: 1,
      zIndex: 4,
      path: `M124 143 C124 139 121 137 119 138 C117 139 116 143 117 146 C118 148 120 149 122 148 C124 147 124 145 124 143 Z`,
    },
    // Hidung
    {
      id: 'nose',
      label: 'Hidung',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M94 164 C94 160 97 158 100 158 C103 158 106 160 106 164
             C106 168 103 170 100 170 C97 170 94 168 94 164 Z`,
    },
    // Mulut
    {
      id: 'mouth',
      label: 'Mulut',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M86 173 C91 180 100 183 100 183 C100 183 109 180 114 173`,
    },
    // Pipi kiri
    {
      id: 'cheek_left',
      label: 'Pipi kiri',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M62 160 C62 154 68 150 74 152 C80 154 82 162 78 167
             C74 171 64 169 62 164 Z`,
    },
    // Pipi kanan
    {
      id: 'cheek_right',
      label: 'Pipi kanan',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 3,
      path: `M138 160 C138 154 132 150 126 152 C120 154 118 162 122 167
             C126 171 136 169 138 164 Z`,
    },
    // Ekor
    {
      id: 'tail',
      label: 'Ekor',
      defaultColor: '#FFFFFF',
      strokeColor: '#222',
      strokeWidth: 1.5,
      zIndex: 2,
      path: `M140 196 C140 186 148 180 157 182 C166 184 170 193 166 201
             C162 208 152 210 146 205 C141 201 140 198 140 196 Z`,
    },
  ],
};

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

export const SVG_ANIMALS: Record<string, SvgAnimalData> = {
  lion:      LION,
  elephant:  ELEPHANT,
  fish:      FISH,
  eagle:     EAGLE,
  butterfly: BUTTERFLY,
  rabbit:    RABBIT,
  // Fallbacks
  tiger:     LION,
  giraffe:   ELEPHANT,
  crocodile: FISH,
  parrot:    EAGLE,
  bee:       BUTTERFLY,
  owl:       EAGLE,
  flamingo:  EAGLE,
  dolphin:   FISH,
  whale:     FISH,
  shark:     FISH,
  octopus:   FISH,
  crab:      FISH,
  horse:     ELEPHANT,
  cow:       ELEPHANT,
  goat:      RABBIT,
};

export function getSvgAnimal(animalId: string): SvgAnimalData {
  return SVG_ANIMALS[animalId] ?? BUTTERFLY;
}

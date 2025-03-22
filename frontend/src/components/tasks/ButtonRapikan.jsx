import React from "react";

const ButtonRapikan = ({ value, onChange, inputClasses, labelClasses }) => {
  const handleRapikan = () => {
    // 1. Bersihkan karakter “aneh” tanpa menghapus baris kosong
    let cleanedText = value
      .normalize("NFKC")        // Normalisasi Unicode
      .replace(/\u200B/g, "")   // Hapus zero-width space
      .replace(/\u2060/g, "")   // Hapus word joiner (jika perlu)
      .replace(/\uFEFF/g, "")   // Hapus zero-width no-break space
      .replace(/\u00A0/g, " "); // Ganti non-breaking space ke spasi biasa
    
    // 2. Ubah tiap baris non-kosong menjadi bullet
    cleanedText = cleanedText
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed === "") {
          // Kalo kosong, biarkan tetap kosong
          return "";
        }
        // Kalo tidak kosong, tambahkan bullet di depan
        return `• ${trimmed}`;
      })
      .join("\n");
  
    onChange(cleanedText);
  };
  
      
  return (
    <div>
      <label className={labelClasses} htmlFor="deskripsiTugas">
        Deskripsi Tugas *
      </label>
      <textarea
        id="deskripsiTugas"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClasses} min-h-[300px] resize-y`}
        placeholder="Jelaskan tugas yang diberikan"
        required
      />
      <button
        type="button"
        onClick={handleRapikan}
        className="mt-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition-colors"
      >
        Rapikan Teks
      </button>
    </div>
  );
};

export default ButtonRapikan;

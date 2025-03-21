import React from "react";

const DeskripsiTugasInput = ({ value, onChange, inputClasses, labelClasses }) => {
    const handleRapikan = () => {
        const cleanedText = value
        .normalize("NFKC") // Normalisasi Unicode
        .replace(/\u200B/g, "") // Hapus zero-width space
        .replace(/\uFEFF/g, "") // Hapus zero-width no-break space
        .replace(/\u00A0/g, " ") // Ganti non-breaking space ke spasi biasa
        .replace(/\s+\n/g, "\n") // Hapus spasi berlebihan sebelum newline
        .split("\n")            // Pisah baris
        .map((line) => line.trim())  // Trim tiap baris
        .filter((line) => line !== "") // Buang baris kosong kalau mau
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

export default DeskripsiTugasInput;

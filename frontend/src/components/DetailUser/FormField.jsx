import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FormField = ({ icon, label, name, type = "text", options, value, onChange, ref, onKeyDown }) => {
  return (
    <div className="mb-4">
      <label className="text-blue-300 mb-2 font-medium flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {label}
      </label>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          ref={ref}
          onKeyDown={onKeyDown}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={value}
            onChange={onChange}
            ref={ref}
            className="w-5 h-5 rounded bg-gray-700 border-gray-600 focus:ring-blue-500 text-blue-600"
          />
          <span className="ml-2 text-white">
            {value ? "Aktif" : "Tidak Aktif"}
          </span>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          ref={ref}
          onKeyDown={onKeyDown}
          autoComplete={type === "password" ? "new-password" : "off"}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
        />
      )}
    </div>
  );
};

export default FormField;
// InputField.js (buat file baru)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputField = ({ icon, type, name, label, placeholder, value, onChange }) => {
  return (
    <div className="mb-5">
      <label htmlFor={name} className="text-blue-300 mb-2 font-medium flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default InputField;
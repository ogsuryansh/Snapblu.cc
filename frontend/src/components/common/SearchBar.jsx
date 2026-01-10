import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = 'Search...', value, onChange, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="input-field pl-10 w-full"
            />
        </div>
    );
};

export default SearchBar;

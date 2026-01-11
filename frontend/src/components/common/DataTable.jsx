import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

const DataTable = ({ columns, data: rawData = [], selectable = false, onSelectionChange }) => {
    const data = Array.isArray(rawData) ? rawData : [];
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(new Set(data.map((_, idx) => idx)));
            onSelectionChange?.(data);
        } else {
            setSelectedRows(new Set());
            onSelectionChange?.([]);
        }
    };

    const handleSelectRow = (idx) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(idx)) {
            newSelected.delete(idx);
        } else {
            newSelected.add(idx);
        }
        setSelectedRows(newSelected);
        onSelectionChange?.(data.filter((_, i) => newSelected.has(i)));
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronsUpDown size={14} className="text-gray-600" />;
        }
        return sortConfig.direction === 'asc' ? (
            <ChevronUp size={14} className="text-blue-500" />
        ) : (
            <ChevronDown size={14} className="text-blue-500" />
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                    <tr>
                        {selectable && (
                            <th className="table-header w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.size === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                    className="rounded bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-blue-600 focus:ring-blue-600"
                                />
                            </th>
                        )}
                        {columns.map((column) => (
                            <th key={column.key} className="table-header">
                                {column.sortable ? (
                                    <button
                                        onClick={() => handleSort(column.key)}
                                        className="flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors font-bold"
                                    >
                                        {column.label}
                                        <SortIcon columnKey={column.key} />
                                    </button>
                                ) : (
                                    column.label
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                    {sortedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (selectable ? 1 : 0)}
                                className="table-cell text-center py-12 text-gray-500"
                            >
                                No data found.
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row, idx) => (
                            <tr
                                key={idx}
                                className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                            >
                                {selectable && (
                                    <td className="table-cell">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(idx)}
                                            onChange={() => handleSelectRow(idx)}
                                            className="rounded bg-white dark:bg-dark-bg border-gray-300 dark:border-dark-border text-blue-600 focus:ring-blue-600"
                                        />
                                    </td>
                                )}
                                {columns.map((column) => (
                                    <td key={column.key} className="table-cell">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;

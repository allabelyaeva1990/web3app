import { Button } from "./Button"
import { FilterButton } from "./FilterButton"

export type FilterType = 'all' | 'pending' | 'success' | 'failed'
export type SortType = 'newest' | 'oldest'
export interface FilterOption {
    value: FilterType,
    label: string
}

interface FilterPanelProps {
  currentFilter: string
  onFilterChange: (filter: FilterType) => void
  sortBy: string
  onSortChange: (sort: SortType) => void
  onClear?: () => void
  hasData: boolean
}

export function FilterPanel({ 
  currentFilter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  onClear,
  hasData 
}: FilterPanelProps) {
  const filterOptions: Array<FilterOption> = [
    { value: 'all', label: 'Все' },
    { value: 'pending', label: 'В ожидании' },
    { value: 'success', label: 'Успешно' },
    { value: 'failed', label: 'Неудачно' }
  ]

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e1e5e9',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      {/* Фильтры */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
          Фильтр:
        </span>
        {filterOptions.map(option => (
          <FilterButton
            key={option.value}
            active={currentFilter === option.value}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </FilterButton>
        ))}
      </div>

      {/* Сортировка и действия */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortType)}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '12px',
            outline: 'none'
          }}
        >
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
        </select>
        
        {hasData && onClear && (
          <Button
            variant="danger"
            size="sm"
            onClick={onClear}
          >
            Очистить
          </Button>
        )}
      </div>
    </div>
  )
}
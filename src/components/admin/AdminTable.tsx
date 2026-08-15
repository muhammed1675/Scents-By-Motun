import React from 'react';
import { cn } from '../../utils/format';
import { Spinner } from '../ui/Loading';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function AdminTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  emptyMessage = 'Nothing here yet.',
  onRowClick
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="grid place-items-center rounded-sm border border-cocoa/10 bg-white py-16">
        <Spinner />
      </div>);

  }

  if (rows.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-cocoa/20 bg-white py-14 text-center text-sm text-cocoa/60">
        {emptyMessage}
      </div>);

  }

  return (
    <div className="overflow-x-auto rounded-sm border border-cocoa/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-cocoa/10 bg-cream/60">
            {columns.map((col) =>
            <th
              key={col.key}
              scope="col"
              className={cn(
                'whitespace-nowrap px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-chestnut',
                col.hideOnMobile && 'hidden md:table-cell',
                col.className
              )}>
              
                {col.header}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-cocoa/10">
          {rows.map((row) =>
          <tr
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              'transition-colors',
              onRowClick && 'cursor-pointer hover:bg-cream/50'
            )}>
            
              {columns.map((col) =>
            <td
              key={col.key}
              className={cn(
                'px-4 py-3 align-middle text-ink',
                col.hideOnMobile && 'hidden md:table-cell',
                col.className
              )}>
              
                  {col.render(row)}
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}
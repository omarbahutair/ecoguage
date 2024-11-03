import React from 'react';

interface IColumn {
  label: string;
  field?: string;
  render?: (doc: Record<string, any>) => React.ReactNode;
}

interface TableProps {
  data: Array<Record<string, any>>;
  columns: IColumn[];
  keyField?: string;
}

export default function Table({ columns, data, keyField = '' }: TableProps) {
  return (
    <>
      <table className="w-full hidden sm:table relative">
        <thead className="sticky top-0">
          <tr>
            {columns.map((c) => (
              <th
                key={c.label}
                className="text-start px-5 py-2 bg-primary-fade text-white first:rounded-tl-lg font-normal last:rounded-tr-lg"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((doc) => (
            <tr key={doc[keyField]} className="group">
              {columns.map((c) => (
                <td
                  key={`${doc[keyField]}.${c.field ?? c.label}`}
                  className="group-odd:bg-neutral-100 text-start px-5 py-2 group-last:rounded-bl-lg font-normal group-last:rounded-br-lg"
                >
                  {c.render?.(doc) ?? doc[c.field ?? ''] ?? 'Unknown'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.map((doc) => (
        <table key={doc[keyField]} className="w-full sm:hidden">
          <thead>
            <tr>
              <th className="text-start px-5 py-2 bg-primary-fade text-white first:rounded-tl-lg last:rounded-tr-lg">
                {columns[0].label}
              </th>
              <th className="text-start px-5 py-2 bg-primary-fade text-white font-normal first:rounded-tl-lg last:rounded-tr-lg">
                {columns[0].render?.(doc) ??
                  doc[columns[0].field ?? ''] ??
                  'Unknown'}
              </th>
            </tr>
          </thead>
          <tbody>
            {columns.slice(1).map((c) => (
              <tr
                key={`${doc[keyField]}.${c.field ?? c.label}`}
                className="group"
              >
                <td className="group-even:bg-neutral-100 text-start px-5 py-2 font-normal group-last:rounded-bl-lg group-last:rounded-tb-lg">
                  {c.label}
                </td>
                <td className="group-even:bg-neutral-100 text-start px-5 py-2 font-normal group-last:rounded-bl-lg group-last:rounded-tb-lg">
                  {c.render?.(doc) ?? doc[c.field ?? ''] ?? 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </>
  );
}

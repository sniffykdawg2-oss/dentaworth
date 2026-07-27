import { ReactNode } from "react";

export function AdminReviewPanel<T extends { id: string }>({
  title,
  emptyText,
  records,
  renderRecord,
}: {
  title: string;
  emptyText: string;
  records: T[];
  renderRecord: (record: T) => ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="compact-heading">
        <p className="eyebrow">{records.length} pending</p>
        <h2>{title}</h2>
      </div>
      {records.length > 0 ? (
        <div className="admin-list">
          {records.map((record) => (
            <article key={record.id}>{renderRecord(record)}</article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{emptyText}</h3>
          <p>New submissions will appear here when visitors use the public forms.</p>
        </div>
      )}
    </section>
  );
}

export function AdminRecordList<T extends { id: string }>({
  title,
  emptyText,
  records,
  renderRecord,
}: {
  title: string;
  emptyText: string;
  records: T[];
  renderRecord: (record: T) => ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="compact-heading">
        <p className="eyebrow">{records.length} records</p>
        <h2>{title}</h2>
      </div>
      {records.length > 0 ? (
        <div className="admin-list">
          {records.map((record) => (
            <article key={record.id}>{renderRecord(record)}</article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>{emptyText}</h3>
          <p>Use the form to create the first launch record.</p>
        </div>
      )}
    </section>
  );
}

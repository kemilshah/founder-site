export default function Ledger({ items }) {
  return (
    <div className="ledger">
      {items.map((item, i) => (
        <div className="ledger-item" key={i}>
          <div className="ledger-value">{item.value}</div>
          <div className="ledger-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

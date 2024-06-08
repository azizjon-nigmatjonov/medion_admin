
const ScopeRow = ({ index, scope }) => {
  return (
    <div className={`ScopeRow ${scope.method} `}>
      <div className="method-block">{scope.method}</div>
      <div className="name">{scope.path}</div>
      <div className="counter">{scope.requests ?? 0}</div>
    </div>
  )
}

export default ScopeRow

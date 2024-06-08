import { Container, Draggable } from "react-smooth-dnd"
import ScopeRow from "./ScopeRow"
import "./style.scss"

const ScopesBlock = ({ scopes }) => {
  return (
    <div className="ScopesBlock">
      <div className="card-header silver-bottom-border ">
        <h4 className="card-title">SCOPES</h4>
      </div>

      <div className="rows-block">
        <Container
          groupName="scopes"
          behaviour="move"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
          getChildPayload={(i) => scopes[i]}
        >
          {scopes.map((scope, index) => (
            <Draggable key={scope.path + scope.method}>
              <ScopeRow scope={scope} key={scope.path + scope.method} index={index} />
            </Draggable>
          ))}
        </Container>
      </div>
    </div>
  )
}

export default ScopesBlock

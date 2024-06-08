import { useMemo } from "react"
import { useSelector } from "react-redux"
import { elements } from "./elements"
import { useParams } from "react-router-dom"

const useSidebarElements = () => {
  const { appId } = useParams()
  const constructorElements = useSelector(
    (state) => state.constructorTable.list
  )
  const permissions = useSelector((state) => state.auth.permissions)
  const role = useSelector((state) => state.auth.roleInfo)

  const computedElements = useMemo(() => {
    const computedConstructorElements = constructorElements
      .filter(
        (el) =>
          el.is_visible &&
          (permissions?.[el.slug]?.["read"] || role?.name === "DEFAULT ADMIN")
      )
      .map((el) => ({
        ...el,
        title: el.label,
        path: `/main/${appId}/object/${el.slug}`,
      }))

    return [...computedConstructorElements, ...elements]
  }, [constructorElements, permissions, appId, role])

  return { elements: computedElements ?? [] }
}

export default useSidebarElements

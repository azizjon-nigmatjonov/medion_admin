import { useAliveController } from "react-activation"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { tabRouterActions } from "../store/tabRouter/tabRouter.slice"
import { generateGUID, generateID } from "../utils/generateID"

export default function useTabRouter() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appId } = useParams()
  const tabs = useSelector((state) => state.tabRouter.tabs)
  const { drop } = useAliveController()

  const navigateToForm = (tableSlug, type = "CREATE", row = {}, state) => {
    if (type === "CREATE") {
      const id = generateID()

      const link = `/main/${appId}/object/${tableSlug}/create/${id}`

      const newTab = {
        id,
        link,
        tableSlug: tableSlug,
      }

      dispatch(tabRouterActions.addTab(newTab))
      navigate(link, { state })
      return
    }

    const link = `/main/${appId}/object/${tableSlug}/${row.guid}`

    const tab = tabs.find((tab) => tab.link === link)

    if (tab) {
      navigate(link)
      return
    }

    const newTab = {
      id: generateID(),
      link,
      tableSlug,
      row,
    }

    dispatch(tabRouterActions.addTab(newTab))
    navigate(link)
  }

  const removeTab = (link) => {
    const index = tabs.findIndex((tab) => tab.link === link)

    let navigateLink = ""

    if (tabs.length === 1) {
      navigateLink = `/main/${appId}`
    } else {
      navigateLink = tabs[index - 1]?.link || tabs[index + 1]?.link
    }

    navigate(navigateLink)
    drop(link)
    dispatch(tabRouterActions.removeTab(link))
  }

  const deleteTab = (link) => {
    const index = tabs.findIndex((tab) => tab.link === link)
    drop(link)
    dispatch(tabRouterActions.removeTab(link))
  }

  return { navigateToForm, removeTab, deleteTab }
}

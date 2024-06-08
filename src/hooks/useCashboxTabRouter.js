

import { useAliveController } from "react-activation"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { tabRouterActions } from "../store/tabRouter/tabRouter.slice"
import { generateID } from "../utils/generateID"

export default function useCashboxTabRouter() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tabs = useSelector(state => state.tabRouter.tabs)
  const { drop } = useAliveController()

  const navigateToForm = (id, type, title) => {

    const link = `/cashbox/appointments/${type}/${id}`

    const tab = tabs.find(tab => tab.link === link)

    if(tab) {
      navigate(link)
      return
    }

    const newTab = {
      id: generateID(),
      title,
      link,
    }

    dispatch(tabRouterActions.addTab(newTab))
    navigate(link)
  }

  const removeTab = (link) => {

    const index = tabs.findIndex(tab => tab.link === link)

    let navigateLink = ""

    if(tabs.length === 1) {
      navigateLink = `/cashbox/appointments`
    } else {
      navigateLink = tabs[index - 1]?.link || tabs[index + 1]?.link
    }

    navigate(navigateLink)
    drop(link)
    dispatch(tabRouterActions.removeTab(link))
  }

  return { navigateToForm, removeTab }
}
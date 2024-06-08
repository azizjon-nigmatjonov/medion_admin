

import { useAliveController } from "react-activation"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { tabRouterActions } from "../store/tabRouter/tabRouter.slice"
import { generateID } from "../utils/generateID"

export default function useAnalyticsTabRouter() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tabs = useSelector(state => state.tabRouter.tabs)
  const { drop } = useAliveController()

  const navigateToForm = (id, type, title, state) => {


    if(type === 'CREATE') {

      const id = generateID()

      const link = `/analytics/dashboard/create/${id}`

      const newTab = {
        id,
        link,
        title: 'Dashboard (New)'
      }

      dispatch(tabRouterActions.addTab(newTab))
      navigate(link, { state })
      return
    }

    const link = `/analytics/dashboard/${id}`

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
      navigateLink = `/analytics/dashboard`
    } else {
      navigateLink = tabs[index - 1]?.link || tabs[index + 1]?.link
    }

    navigate(navigateLink)
    drop(link)
    dispatch(tabRouterActions.removeTab(link))
  }

  return { navigateToForm, removeTab }
}
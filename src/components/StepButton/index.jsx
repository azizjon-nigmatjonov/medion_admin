import { LoadingButton } from "@mui/lab"
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import sprintService from "../../services/sprintService"

const StepButton = ({ currentStep, sprintId, updateSprintStep }) => {
  const globalStepsList = useSelector((state) => state.project.sprintStepsList)

  const [loading, setLoading] = useState(false)

  const computedSteps = useMemo(() => {
    let current = null
    let next = null

    const currentIndex = globalStepsList?.findIndex(
      (el) => el.id === currentStep?.project_sprint_step_id
    )

    if (currentIndex !== -1) {
      current = { ...currentStep, ...globalStepsList[currentIndex] }

      next = globalStepsList[currentIndex + 1] ?? null
    }

    return {
      current,
      next,
    }
  }, [globalStepsList, currentStep])

  const computedType = useMemo(() => {
    const { current, next } = computedSteps

    if (current && !current?.confirmed) return "CONFIRM"

    if (next) return "NEXT"

    return null
  }, [computedSteps])


  const computedTitle = useMemo(() => {
    const { current, next } = computedSteps

    if (computedType === "CONFIRM") return `Confirm ${current?.title}`

    return `Start ${next?.title}`
  }, [computedType])


  const clickHandler = () => {
    setLoading(true)

    if (computedType === "CONFIRM") {
      sprintService
        .confirmSprintStep({
          confirmed: true,
          project_sprint_step_id: computedSteps.current.id,
          sprint_id: sprintId,
        })
        .then((res) => {
          updateSprintStep(res)
        })
        .finally(() => setLoading(false))
    }
    else {
      sprintService
        .moveSprintToNextStep({
          confirmed: false,
          project_sprint_step_id: computedSteps.next.id,
          sprint_id: sprintId,
        })
        .then((res) => {
          updateSprintStep(res)
        })
        .finally(() => setLoading(false))
    }
  }

  if (!computedType) return null

  return (
    <LoadingButton  onClick={clickHandler} loading={loading} variant="contained">
      {computedTitle}
    </LoadingButton>
  )
}

export default StepButton

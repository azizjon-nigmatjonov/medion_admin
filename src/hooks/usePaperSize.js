import { useCallback } from "react";



const paperSizes = [
  {
    name: 'A4',
    width: 595,
    height: 842
  },
  {
    name: 'A5',
    width: 420,
    height: 595
  },
  {
    name: 'A6',
    width: 298,
    height: 420
  },
  {
    name: 'Сash receipt',
    width: 220,
    height: 1000
  }
]


const usePaperSize = (selectedIndex) => {
  
  const selectPaperIndexBySize = useCallback((paperSize = []) => {
    const index = paperSizes.findIndex(paper => paper.width === Number(paperSize[0]) && paper.height === Number(paperSize[1])) 
    return index === -1 ? 0 : index
  }, [])
  
  const selectPaperIndexByName = useCallback((name) => {
    const index = paperSizes.findIndex(paper => paper.name === name) 
    return index === -1 ? 0 : index
  }, [])

  return {
    paperSizes,
    selectedPaperSize: paperSizes[selectedIndex] ?? {},
    selectPaperIndexBySize,
    selectPaperIndexByName
  }

}
 
export default usePaperSize;
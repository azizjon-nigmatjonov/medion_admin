import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ThemeConfig from "../theme/index";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ruLocale from "date-fns/locale/ru";


const MaterialUIProvider = ({children}) => {
  const theme = "light"

  return (
    <div className={theme === "dark" ? 'night-mode' : ''} >
      <ThemeConfig >
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale} >
          {children}
        </LocalizationProvider>
      </ThemeConfig>
    </div>
  );
};

export default MaterialUIProvider;

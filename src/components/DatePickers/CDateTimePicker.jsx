import DatePicker from "react-multi-date-picker"
import weekends from "react-multi-date-picker/plugins/highlight_weekends"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import {DateRange} from "@mui/icons-material"
import {InputAdornment, TextField} from "@mui/material"
import InputMask from "react-input-mask";
import "./style2.scss"
import {locale} from "./Plugins/locale"
import "react-multi-date-picker/styles/layouts/mobile.css"
import CopyToClipboard from "../CopyToClipboard"

const CDateTimePicker = ({
                             value,
                             placeholder,
                             isBlackBg,
                             classes,
                             onChange,
                             isFormEdit,
                             tabIndex,
                             mask,
                             showCopyBtn = true,
                             disabled = false,
                         }) => {
    return (
        <div className="main_wrapper">
            <DatePicker
                render={(value, openCalendar, handleChange) => {
                    return (
                        <InputMask
                            mask={mask}
                            value={value ?? undefined}
                            onChange={handleChange}
                            disabled={disabled}
                        >
                            {(InputProps) => (
                                <TextField
                                    value={value}
                                    onClick={() => (disabled ? null : openCalendar())}
                                    onChange={handleChange}
                                    size="small"
                                    placeholder={placeholder.split("#")[0]}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRight: 0,
                                        },
                                    }}
                                    fullWidth
                                    className={`${isFormEdit ? "custom_textfield" : ""}`}
                                    autoComplete="off"
                                    autoFocus={tabIndex === 1}
                                    InputProps={{
                                        ...InputProps,
                                        inputProps: { tabIndex },
                                        readOnly: disabled,
                                        classes: {
                                            input: isBlackBg ? classes.input : "",
                                        },
                                        style: disabled
                                            ? {
                                                background: "#c0c0c039",
                                            }
                                            : {
                                                background: isBlackBg ? "#2A2D34" : "",
                                                color: isBlackBg ? "#fff" : "",
                                            },
                                    }}
                                />
                            )}
                        </InputMask>
                    )
                }}
                plugins={[weekends()]}
                weekStartDayIndex={1}
                portal
                locale={locale}
                format="DD.MM.YYYY"
                value={new Date(value) || ""}
                onChange={(val) => onChange(val ? new Date(val) : "")}
            />
            <DatePicker
                disableDayPicker
                render={(value, openCalendar, handleChange) => {
                    return (
                        <InputMask
                            mask={'99:99'}
                            value={value ?? undefined}
                            onChange={handleChange}
                            disabled={disabled}
                        >
                            {(InputProps) => (
                                <TextField
                                    value={value}
                                    onClick={() => (disabled ? null : openCalendar())}
                                    onChange={handleChange}
                                    size="small"
                                    autoComplete="off"
                                    placeholder={placeholder.split("#")[1]}
                                    className={`${isFormEdit ? "custom_textfield" : ""}`}
                                    style={{border: "none"}}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderLeft: 0,
                                        },
                                    }}
                                    InputProps={{
                                        readOnly: disabled,
                                        classes: {
                                            input: isBlackBg ? classes.input : "",
                                        },
                                        style: disabled
                                            ? {
                                                background: "#c0c0c039",
                                            }
                                            : {
                                                background: isBlackBg ? "#2A2D34" : "",
                                                color: isBlackBg ? "#fff" : "",
                                            },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <DateRange/>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        </InputMask>
                    )
                }}
                plugins={[<TimePicker hideSeconds/>]}
                portal
                format="HH:mm"
                value={new Date(value) || ""}
                onChange={(val) => onChange(val ? new Date(val) : "")}
            />
            {showCopyBtn && (
                <CopyToClipboard copyText={value} style={{marginLeft: 8}}/>
            )}
        </div>
    )
}

export default CDateTimePicker

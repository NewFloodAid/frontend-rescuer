import { Autocomplete, TextField } from "@mui/material";

interface InputDropdownProps {
  placeholder: string;
  value: string | undefined;
  onChange: (event: unknown, newValue: string | null) => void;
  options: string[];
}

const InputDropdown = ({
  value,
  onChange,
  options,
  placeholder,
}: InputDropdownProps) => {
  return (
    <Autocomplete
      value={value}
      onChange={onChange}
      options={options}
      getOptionLabel={(option) => option}
      isOptionEqualToValue={(option, value) => option === value}
      sx={{
        width: "15dvw",
      }}
      slotProps={{
        listbox: {
          sx: {
            fontFamily: "kanit",
            fontSize: "2vmin",
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          sx={{
            "& .MuiInputBase-root": {
              fontFamily: "kanit", // Font family for the input
              fontSize: "2vmin",
              height: "4.5dvh",
              caretColor: "transparent",
            },
          }}
        />
      )}
    />
  );
};

export default InputDropdown;

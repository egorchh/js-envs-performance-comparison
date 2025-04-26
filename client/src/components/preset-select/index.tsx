import { Dispatch, SetStateAction, useState } from "react";
import {
    FormControl,
    MenuItem,
    Paper,
    Select,
    SelectProps,
    Typography,
    useMediaQuery,
    useTheme,
    InputLabel
} from "@mui/material";
import { presets } from "./constants";

type Props = {
    onChange: Dispatch<SetStateAction<string | undefined>>;
};

export const PresetSelect = ({ onChange }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [selectedKey, setSelectedKey] = useState<string | undefined>();

    const handleChange: SelectProps["onChange"] = (event) => {
        const key = event.target.value as string;
        setSelectedKey(key);
        onChange(presets[key]?.codeSnippet);
    };

    return (
        <Paper sx={{ p: theme.spacing(2), mb: theme.spacing(2) }}>
            <Typography variant="h6" component="h2" gutterBottom id="presets-label">
                Заготовки кода
            </Typography>
            <FormControl fullWidth>
                <Select
                    value={selectedKey ?? ""}
                    displayEmpty
                    onChange={handleChange}
                    size='small'
                    labelId="preset-select-label"
                    id="preset-select"
                    aria-labelledby="presets-label preset-select-label"
                    inputProps={{
                        'aria-label': 'Выберите заготовку кода'
                    }}
                >
                    <MenuItem value="" disabled>
                        Выберите сниппет
                    </MenuItem>
                    {Object.entries(presets).map(([key, { label }]) => (
                        <MenuItem key={key} value={key}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    );
};

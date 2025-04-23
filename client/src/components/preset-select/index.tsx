import { Dispatch, SetStateAction, useState } from "react";
import {
    FormControl,
    MenuItem,
    Paper,
    Select,
    SelectProps,
    Typography,
    useMediaQuery,
    useTheme
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
            <Typography variant="h6" gutterBottom>
                Заготовки кода
            </Typography>
            <FormControl fullWidth>
                <Select
                    value={selectedKey ?? ""}
                    displayEmpty
                    onChange={handleChange}
                    size='small'
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

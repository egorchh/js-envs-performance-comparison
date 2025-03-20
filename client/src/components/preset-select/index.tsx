import { Select } from "@mui/material";
import { useState } from "react";

export const PresetSelect = () => {
    const [preset, setPreset] = useState<string>('default');

    return <Select label="Заготовка кода" />;
};
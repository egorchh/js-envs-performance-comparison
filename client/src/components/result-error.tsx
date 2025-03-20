type Props = {
    error: string;
};

export const ResultError = ({ error }: Props) => {
    return <div>Result Error: {error}</div>;
};
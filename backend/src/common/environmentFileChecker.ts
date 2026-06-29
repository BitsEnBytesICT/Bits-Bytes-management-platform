const requiredVariables: string[] = [
    "DATABASE_TYPE",
    "DATABASE_URL",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
    "INVENTORYDB_NAME",
    "DATABASE_PORT"
]

export const environmentFileChecker = () => {
    let missingVariables = requiredVariables.filter((variable) => process.env[variable] === undefined);
    if (!missingVariables || missingVariables.length === 0) return;
    throw `Missing the following env variables: ${missingVariables.join(", ")}`;
}
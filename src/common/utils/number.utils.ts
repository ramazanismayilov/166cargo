export function generateNumber(): number {
    return Math.floor(1000000 + Math.random() * 9000000);
}

export function roundToDecimal(value: number): number {
    return Math.round(value * 10) / 10;
} 

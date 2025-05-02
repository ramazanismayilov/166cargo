export function generateNumber(): number {
    return Math.floor(1000000 + Math.random() * 9000000);
}

export function roundToDecimal(value: number): number {
    return Math.round(value * 10) / 10;
} 

export function generateOtpNumber(): number {
    return Math.floor(100000 + Math.random() * 900000)
}

export function generateOtpExpireDate(): Date {
    return new Date(Date.now() + 10 * 60 * 1000)
}
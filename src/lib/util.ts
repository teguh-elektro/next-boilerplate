export function generateRandomBase64(length:number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

export function generateBackgroundColor(email:string) {
    const hash = Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomColor = `#${((hash & 0x00FFFFFF) | 0xFF000000).toString(16).slice(1)}`;
    const rgb = parseInt(randomColor.slice(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    const textColor = luminance > 186 ? 'black' : 'white';
    return {
        backgroundColor: randomColor,
        textColor: textColor,
    };
}
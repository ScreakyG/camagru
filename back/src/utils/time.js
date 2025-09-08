// Simple function to set a expirationTime (in minutes);
export function setExpirationDate(expirationTime) {
    const expireAt = Math.floor(Date.now() / 1000) + expirationTime * 60;
    return expireAt;
}

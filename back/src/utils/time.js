// Simple function to set a expirationTime (in minutes);
export function setExpirationDate(expirationTime) {
    const expireAt = Math.floor(Date.now() / 1000) + expirationTime * 60; // Get time in seconds since 01/01/1070 and add expiration time
    return expireAt; // in seconds
}

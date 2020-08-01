/**
 * Sets cookie
 * @param {string} cname cookie name
 * @param {string} cvalue cookie value
 * @param {Date} exdays Cookie expire date
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Fetches a cookie
 * @param {string} cname Cookie name
 */
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toggleTheme(elm) {
    if (getCookie("theme") === "dark") {
        setCookie("theme", "light", 1);
        return updateTheme();
    } else {
        setCookie("theme", "dark", 1);
        return updateTheme();
    }
    if (elm) elm.checked = "true";
}
export function showMessageAndRedirect(message, time, redirectUrl) {
    document.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><h1>${message}</h1></div>`;
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, time);
}
